import { create } from 'zustand';
import { CAMERA_FREE_MODE, type CameraMode } from '../types/cameraModes.type';
import * as THREE from 'three';

type CameraStore = {
  cameraMode: CameraMode;
  setCameraMode: (cameraMode: CameraMode) => void;
  focusBody?: (obj: THREE.Object3D) => void;
  registerFocus: (fn: (obj: THREE.Object3D) => void) => void;
};

export const useCameraStore = create<CameraStore>((set) => ({
  cameraMode: CAMERA_FREE_MODE,
  setCameraMode: (cameraMode: CameraMode) => set({ cameraMode }),

  registerFocus: (fn) => set({ focusBody: fn }),
}));
