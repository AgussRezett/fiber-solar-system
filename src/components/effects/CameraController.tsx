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
  const { cameraMode, setCameraMode } = useCameraStore();

  const targetRef = useRef<THREE.Object3D | null>(null);
  const keys = useRef<Record<string, boolean>>({});

  const yaw = useRef(0);
  const pitch = useRef(0);

  // ───────────────── KEYBOARD ─────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true;

      if (e.code === 'Escape') {
        targetRef.current = null;
        setCameraMode(CAMERA_FREE_MODE);
      }
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

  // ───────────────── MOUSE LOOK ─────────────────
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

  // ───────────────── MOVEMENT ─────────────────
  useFrame((_, delta) => {
    if (cameraMode !== CAMERA_FREE_MODE) return;

    const speed =
      MOVE_SPEED * (keys.current.ShiftLeft ? FAST_MULTIPLIER : 1) * delta;

    const move = new THREE.Vector3(
      (keys.current.KeyD ? 1 : 0) - (keys.current.KeyA ? 1 : 0),
      (keys.current.Space ? 1 : 0) - (keys.current.ControlLeft ? 1 : 0),
      (keys.current.KeyS ? 1 : 0) - (keys.current.KeyW ? 1 : 0)
    );

    if (move.lengthSq() === 0) return;

    move.normalize();
    move.applyQuaternion(camera.quaternion);
    camera.position.addScaledVector(move, speed);
  });

  // ───────────────── POINTER LOCK ─────────────────
  useEffect(() => {
    if (cameraMode === CAMERA_FREE_MODE) {
      gl.domElement.requestPointerLock();
    } else {
      document.exitPointerLock();
    }
  }, [cameraMode, gl.domElement]);

  // ───────────────── ORBIT API ─────────────────
  const focusBody = (object: THREE.Object3D) => {
    targetRef.current = object;
    setCameraMode(CAMERA_ORBIT_MODE);
  };

  useEffect(() => {
    useCameraStore.getState().registerFocus(focusBody);
  }, []);

  return (
    <>
      {cameraMode === CAMERA_ORBIT_MODE && targetRef.current && (
        <OrbitControls
          args={[camera, gl.domElement]}
          target={targetRef.current.position}
          enablePan={false}
          enableZoom
          enableDamping
          dampingFactor={0.1}
        />
      )}
    </>
  );
};

export default CameraController;
