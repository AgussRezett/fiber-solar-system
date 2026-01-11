import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  CAMERA_FREE_MODE,
  CAMERA_ORBIT_MODE,
} from '../../types/cameraModes.type';
import { useCameraStore } from '../../store/useCameraStore';

const MOVE_SPEED = 80;
const FAST_MULTIPLIER = 5;
const SENSITIVITY = 0.002;
const MAX_PITCH = Math.PI / 2 - 0.01;

const CameraController = () => {
  const { camera, gl } = useThree();
  const { cameraMode, setCameraMode, focusTarget } = useCameraStore();

  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(0);
  const pitch = useRef(0);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ───────────── Mouse look (FREE) ─────────────
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (cameraMode !== CAMERA_FREE_MODE) return;
      if (document.pointerLockElement !== gl.domElement) return;

      yaw.current -= e.movementX * SENSITIVITY;
      pitch.current -= e.movementY * SENSITIVITY;
      pitch.current = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, pitch.current));

      camera.rotation.order = 'YXZ';
      camera.rotation.y = yaw.current;
      camera.rotation.x = pitch.current;
    };

    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [cameraMode, camera, gl.domElement]);

  // ───────────── Movement (FREE) ─────────────
  useFrame((_, delta) => {
    if (cameraMode !== CAMERA_FREE_MODE) return;

    const speed =
      MOVE_SPEED * (keys.current.ShiftLeft ? FAST_MULTIPLIER : 1) * delta;

    const dir = new THREE.Vector3(
      (keys.current.KeyD ? 1 : 0) - (keys.current.KeyA ? 1 : 0),
      (keys.current.Space ? 1 : 0) - (keys.current.ControlLeft ? 1 : 0),
      (keys.current.KeyS ? 1 : 0) - (keys.current.KeyW ? 1 : 0)
    );

    if (dir.lengthSq() === 0) return;

    dir.normalize().applyQuaternion(camera.quaternion);
    camera.position.addScaledVector(dir, speed);
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

  // ───────────── Pointer lock sync ─────────────
  useEffect(() => {
    if (cameraMode === CAMERA_FREE_MODE) {
      yaw.current = camera.rotation.y;
      pitch.current = camera.rotation.x;
      gl.domElement.requestPointerLock();
    } else {
      document.exitPointerLock();
    }
  }, [cameraMode, camera, gl.domElement]);

  return (
    <>
      {cameraMode === CAMERA_ORBIT_MODE && focusTarget && (
        <OrbitControls
          ref={controlsRef}
          args={[camera, gl.domElement]}
          target={focusTarget.position}
          enablePan={false}
          enableDamping
          dampingFactor={0.1}
        />
      )}
    </>
  );
};

export default CameraController;
