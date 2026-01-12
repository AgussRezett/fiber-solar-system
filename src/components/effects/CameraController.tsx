import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  CAMERA_FREE_MODE,
  CAMERA_ORBIT_MODE,
  CAMERA_TRANSITION_MODE,
} from '../../types/cameraModes.type';
import { useCameraStore } from '../../store/useCameraStore';

const BASE_MOVE_SPEED = 80;
const FAST_MULTIPLIER = 5;
const SENSITIVITY = 0.004;
const MAX_PITCH = Math.PI / 2 - 0.01;
const MIN_SPEED = 10;
const MAX_SPEED = 500;

const DEBUG = false;

const CameraController = () => {
  const { camera, gl } = useThree();
  const { cameraMode, setCameraMode, focusTarget } = useCameraStore();

  const keys = useRef<Record<string, boolean>>({});
  const isDragging = useRef(false);

  const yaw = useRef(0);
  const pitch = useRef(0);
  const moveSpeed = useRef(BASE_MOVE_SPEED);

  //eslint-disable-next-line
  const controlsRef = useRef<any>(null);

  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const hasDragged = useRef(false);

  const DRAG_THRESHOLD = 5; // px

  // ───────────── Keyboard ─────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'Escape') setCameraMode(CAMERA_FREE_MODE);
    };

    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [setCameraMode]);

  // ───────────── Pointer drag ─────────────
  useEffect(() => {
    const dom = gl.domElement;

    const onMouseDown = (e: MouseEvent) => {
      if (cameraMode !== CAMERA_FREE_MODE) return;
      if (e.button !== 0) return;

      dragStart.current = { x: e.clientX, y: e.clientY };
      hasDragged.current = false;

      yaw.current = camera.rotation.y;
      pitch.current = camera.rotation.x;
    };

    const onMouseUp = () => {
      isDragging.current = false;
      dragStart.current = null;

      if (document.pointerLockElement === gl.domElement) {
        document.exitPointerLock();
        if (DEBUG) console.log('[CAMERA] pointer lock DISABLED');
      }
    };

    dom.addEventListener('mousedown', onMouseDown);
    dom.addEventListener('click', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('click', onMouseUp);

    return () => {
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [cameraMode, camera, gl.domElement]);

  // ───────────── Mouse look ─────────────
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (cameraMode !== CAMERA_FREE_MODE) return;
      if (!dragStart.current) return;

      const dx =
        document.pointerLockElement === gl.domElement
          ? e.movementX
          : e.clientX - dragStart.current.x;

      const dy =
        document.pointerLockElement === gl.domElement
          ? e.movementY
          : e.clientY - dragStart.current.y;

      if (!isDragging.current) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < DRAG_THRESHOLD) return;

        isDragging.current = true;
        gl.domElement.requestPointerLock();
      }

      yaw.current -= dx * SENSITIVITY;
      pitch.current -= dy * SENSITIVITY;
      pitch.current = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, pitch.current));

      camera.rotation.order = 'YXZ';
      camera.rotation.y = yaw.current;
      camera.rotation.x = pitch.current;

      dragStart.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [cameraMode, camera, gl.domElement]);

  // ───────────── Scroll → velocidad ─────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (cameraMode !== CAMERA_FREE_MODE) return;
      if (!isDragging.current) return;

      moveSpeed.current += e.deltaY * -0.1;
      moveSpeed.current = Math.max(
        MIN_SPEED,
        Math.min(MAX_SPEED, moveSpeed.current)
      );

      if (DEBUG) {
        console.log('[CAMERA] speed', moveSpeed.current.toFixed(1));
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [cameraMode]);

  // ───────────── Movement (FREE) ─────────────
  const startOrbitTransition = (target: THREE.Object3D) => {
    const targetPos = new THREE.Vector3();
    target.getWorldPosition(targetPos);

    // tamaño del cuerpo
    const box = new THREE.Box3().setFromObject(target);
    const size = new THREE.Vector3();
    box.getSize(size);
    const radius = Math.max(size.x, size.y, size.z) * 0.5;

    const computeOrbitDistance = (r: number) => {
      const MIN = 6;
      const SCALE = 24;
      return MIN + Math.log(r + 1) * SCALE;
    };

    const distance = computeOrbitDistance(radius);

    // dirección actual cámara → planeta
    const direction = new THREE.Vector3()
      .subVectors(camera.position, targetPos)
      .normalize();

    if (direction.lengthSq() === 0) direction.set(0, 0, 1);

    const endPos = targetPos.clone().add(direction.multiplyScalar(distance));

    // 🧠 ROTACIÓN FINAL (sin aplicarla)
    const dummyCam = camera.clone();
    dummyCam.position.copy(endPos);
    dummyCam.lookAt(targetPos);

    transition.current = {
      startPos: camera.position.clone(),
      endPos,
      startQuat: camera.quaternion.clone(),
      endQuat: dummyCam.quaternion.clone(),
      progress: 0,
    };

    setCameraMode(CAMERA_TRANSITION_MODE);
  };

  useEffect(() => {
    if (cameraMode !== CAMERA_TRANSITION_MODE) return;
    if (!focusTarget) return;

    startOrbitTransition(focusTarget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraMode, focusTarget]);

  // ───────────── Movement (FREE) ─────────────
  useFrame((_, delta) => {
    if (cameraMode !== CAMERA_FREE_MODE) return;

    const speed =
      moveSpeed.current *
      (keys.current.ShiftLeft ? FAST_MULTIPLIER : 1) *
      delta;

    const dir = new THREE.Vector3(
      (keys.current.KeyD ? 1 : 0) - (keys.current.KeyA ? 1 : 0),
      (keys.current.Space ? 1 : 0) - (keys.current.ControlLeft ? 1 : 0),
      (keys.current.KeyS ? 1 : 0) - (keys.current.KeyW ? 1 : 0)
    );

    if (dir.lengthSq() === 0) return;

    dir.normalize().applyQuaternion(camera.quaternion);
    camera.position.addScaledVector(dir, speed);
  });

  // ───────────── Movement (TRANSITION) ─────────────
  const transition = useRef<{
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
    startQuat: THREE.Quaternion;
    endQuat: THREE.Quaternion;
    progress: number;
  } | null>(null);

  useFrame((_, delta) => {
    if (cameraMode !== CAMERA_TRANSITION_MODE) return;
    if (!transition.current) return;

    const t = transition.current;

    t.progress = Math.min(t.progress + delta * 1.5, 1);

    const eased = t.progress * t.progress * (3 - 2 * t.progress); // smoothstep

    camera.position.lerpVectors(t.startPos, t.endPos, eased);
    camera.quaternion.slerpQuaternions(t.startQuat, t.endQuat, eased);

    if (t.progress === 1) {
      transition.current = null;

      if (focusTarget && controlsRef.current) {
        const worldPos = new THREE.Vector3();
        focusTarget.getWorldPosition(worldPos);
        controlsRef.current.target.copy(worldPos);
        controlsRef.current.update();
      }

      setCameraMode(CAMERA_ORBIT_MODE);
    }
  });

  // ───────── ORBIT FOLLOW TARGET ─────────
  useFrame(() => {
    if (
      cameraMode === CAMERA_ORBIT_MODE &&
      focusTarget &&
      controlsRef.current
    ) {
      const worldPos = new THREE.Vector3();
      focusTarget.getWorldPosition(worldPos);
      controlsRef.current.target.copy(worldPos);
      controlsRef.current.update();
    }
  });

  return (
    <>
      {cameraMode === CAMERA_ORBIT_MODE && focusTarget && (
        <OrbitControls
          ref={controlsRef}
          args={[camera, gl.domElement]}
          enablePan={false}
          enableDamping
          dampingFactor={0.1}
        />
      )}
    </>
  );
};

export default CameraController;
