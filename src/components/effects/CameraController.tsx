import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  CAMERA_FREE_MODE,
  CAMERA_ORBIT_MODE,
} from '../../types/cameraModes.type';
import { useCameraStore } from '../../store/useCameraStore';

const BASE_MOVE_SPEED = 80;
const FAST_MULTIPLIER = 5;
const SENSITIVITY = 0.004;
const MAX_PITCH = Math.PI / 2 - 0.01;
const MIN_SPEED = 10;
const MAX_SPEED = 500;

const DEBUG = true;

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

      isDragging.current = true;

      yaw.current = camera.rotation.y;
      pitch.current = camera.rotation.x;

      gl.domElement.requestPointerLock();

      if (DEBUG) console.log('[CAMERA] drag START + pointer lock');
    };

    const onMouseUp = () => {
      if (isDragging.current && DEBUG) {
        console.log('[CAMERA] drag END + release pointer lock');
      }

      isDragging.current = false;
      document.exitPointerLock();
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
      if (!isDragging.current) return;
      if (document.pointerLockElement !== gl.domElement) return;

      yaw.current -= e.movementX * SENSITIVITY;
      pitch.current -= e.movementY * SENSITIVITY;

      pitch.current = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, pitch.current));

      camera.rotation.order = 'YXZ';
      camera.rotation.y = yaw.current;
      camera.rotation.x = pitch.current;

      if (DEBUG) {
        console.log('[CAMERA] rotate', {
          yaw: yaw.current.toFixed(2),
          pitch: pitch.current.toFixed(2),
        });
      }
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
  useFrame((_, delta) => {
    if (cameraMode !== CAMERA_FREE_MODE) return;
    if (!isDragging.current) return;

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

    if (DEBUG) console.log('[CAMERA] move');
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
