import { create } from 'zustand';
import * as THREE from 'three';
import {
  CAMERA_FREE_MODE,
  CAMERA_TRANSITION_MODE,
} from '../types/cameraModes.type';

interface CameraStore {
  cameraMode: string;
  setCameraMode: (mode: string) => void;

  focusTarget: THREE.Object3D | null;
  focusTargetId: string | null;

  startOrbitById: (id: string) => void;

  registry: Record<string, THREE.Object3D>;
  registerBody: (id: string, obj: THREE.Object3D) => void;

  targetHud: {
    visible: boolean;
    name?: string;
    type?: string;
    radiusKm?: number;
  };
  setTargetHud: (targetHud: Partial<CameraStore['targetHud']>) => void;
}

export const useCameraStore = create<CameraStore>((set, get) => ({
  cameraMode: CAMERA_FREE_MODE,
  setCameraMode: (mode) => set({ cameraMode: mode }),

  focusTarget: null,
  focusTargetId: null,

  registry: {},

  registerBody: (id, obj) => {
    /* console.log('-----------------------');
    console.log('id', id);
    console.log('obj', obj);
    console.log('-----------------------'); */

    set((s) => ({
      registry: { ...s.registry, [id]: obj },
    }));
  },

  startOrbitById: (id: string) => {
    console.log('registry', get().registry);

    const obj = get().registry[id];
    if (!obj) return;

    set({
      focusTarget: obj,
      focusTargetId: id,
      cameraMode: CAMERA_TRANSITION_MODE,
    });
  },
  targetHud: {
    visible: false,
    opacity: 0,
    distance: 0,
    name: '',
    type: '',
    radiusKm: 0,
  },
  setTargetHud: (data: Partial<CameraStore['targetHud']>) =>
    set((s) => ({
      targetHud: { ...s.targetHud, ...data },
    })),
}));
