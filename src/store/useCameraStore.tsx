import { create } from 'zustand';
import * as THREE from 'three';
import { CAMERA_FREE_MODE, CAMERA_ORBIT_MODE } from '../types/cameraModes.type';

interface CameraStore {
  cameraMode: string;
  setCameraMode: (mode: string) => void;

  focusTarget: THREE.Object3D | null;
  focusById?: (id: string) => void;

  registry: Record<string, THREE.Object3D>;
  registerBody: (id: string, obj: THREE.Object3D) => void;
}

export const useCameraStore = create<CameraStore>((set, get) => ({
  cameraMode: CAMERA_FREE_MODE,
  setCameraMode: (mode) => set({ cameraMode: mode }),

  focusTarget: null,

  registry: {},
  registerBody: (id, obj) =>
    set((s) => ({
      registry: { ...s.registry, [id]: obj },
    })),

  focusById: (id: string) => {
    const obj = get().registry[id];
    if (!obj) return;
    set({
      focusTarget: obj,
      cameraMode: CAMERA_ORBIT_MODE,
    });
  },
}));
