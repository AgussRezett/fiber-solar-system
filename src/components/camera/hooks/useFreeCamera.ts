import { useEffect, useRef } from 'react';
import { CAMERA_FREE_MODE } from '../../../types/cameraModes.type';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BASE_MOVE_SPEED } from '../consts/camera.constants';
import { useCameraStore } from '../../../store/useCameraStore';
import { useCameraSettingsStore } from '../../../store/useCameraSettingsStore';

export const useFreeCamera = () => {
  const { camera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});

  const isDragging = useRef(false);

  const yaw = useRef(0);
  const pitch = useRef(0);
  const moveSpeed = useRef(BASE_MOVE_SPEED);

  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const hasDragged = useRef(false);

  const { cameraMode, setCameraMode } = useCameraStore();
  const {
    baseMoveSpeed,
    fastMultiplier,
    sensitivity,
    maxPitch,
    minSpeed,
    maxSpeed,
    dragThreshold,
  } = useCameraSettingsStore();

  useEffect(() => {
    moveSpeed.current = baseMoveSpeed;
  }, [baseMoveSpeed]);

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
  }, [setCameraMode, fastMultiplier]);

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
        if (dist < dragThreshold) return;

        isDragging.current = true;
        gl.domElement.requestPointerLock();
      }

      yaw.current -= dx * sensitivity;
      pitch.current -= dy * sensitivity;
      pitch.current = Math.max(-maxPitch, Math.min(maxPitch, pitch.current));

      camera.rotation.order = 'YXZ';
      camera.rotation.y = yaw.current;
      camera.rotation.x = pitch.current;

      dragStart.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [cameraMode, camera, gl.domElement, sensitivity, maxPitch, dragThreshold]);

  // ───────────── Scroll → velocidad ─────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (cameraMode !== CAMERA_FREE_MODE) return;
      if (!isDragging.current) return;

      moveSpeed.current += e.deltaY * -0.1;
      moveSpeed.current = Math.max(
        minSpeed,
        Math.min(maxSpeed, moveSpeed.current)
      );
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [cameraMode, minSpeed, maxSpeed]);

  // ───────────── Movement (FREE) ─────────────
  useFrame((_, delta) => {
    if (cameraMode !== CAMERA_FREE_MODE) return;

    const speed =
      moveSpeed.current * (keys.current.ShiftLeft ? fastMultiplier : 1) * delta;

    const dir = new THREE.Vector3(
      (keys.current.KeyD ? 1 : 0) - (keys.current.KeyA ? 1 : 0),
      (keys.current.Space ? 1 : 0) - (keys.current.ControlLeft ? 1 : 0),
      (keys.current.KeyS ? 1 : 0) - (keys.current.KeyW ? 1 : 0)
    );

    if (dir.lengthSq() === 0) return;

    dir.normalize().applyQuaternion(camera.quaternion);
    camera.position.addScaledVector(dir, speed);
  });
};
