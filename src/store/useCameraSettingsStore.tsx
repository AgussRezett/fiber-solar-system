import { create } from 'zustand';
import {
  BASE_MOVE_SPEED,
  FAST_MULTIPLIER,
  SENSITIVITY,
  MAX_PITCH,
  MIN_SPEED,
  MAX_SPEED,
  DRAG_THRESHOLD,
} from '../components/camera/consts/camera.constants';

interface CameraSettings {
  // Free camera settings
  baseMoveSpeed: number;
  fastMultiplier: number;
  sensitivity: number;
  maxPitch: number;
  minSpeed: number;
  maxSpeed: number;
  dragThreshold: number;

  // Orbit camera settings
  rotateSpeed: number;
  zoomSpeed: number;

  // Transition settings
  transitionSpeed: number;

  // Actions
  setBaseMoveSpeed: (value: number) => void;
  setFastMultiplier: (value: number) => void;
  setSensitivity: (value: number) => void;
  setMaxPitch: (value: number) => void;
  setMinSpeed: (value: number) => void;
  setMaxSpeed: (value: number) => void;
  setDragThreshold: (value: number) => void;
  setRotateSpeed: (value: number) => void;
  setZoomSpeed: (value: number) => void;
  setTransitionSpeed: (value: number) => void;
  resetToDefaults: () => void;
}

const defaultSettings = {
  baseMoveSpeed: BASE_MOVE_SPEED,
  fastMultiplier: FAST_MULTIPLIER,
  sensitivity: SENSITIVITY,
  maxPitch: MAX_PITCH,
  minSpeed: MIN_SPEED,
  maxSpeed: MAX_SPEED,
  dragThreshold: DRAG_THRESHOLD,
  rotateSpeed: 3,
  zoomSpeed: 1.2,
  transitionSpeed: 1.5,
};

export const useCameraSettingsStore = create<CameraSettings>((set) => ({
  ...defaultSettings,

  setBaseMoveSpeed: (value) => set({ baseMoveSpeed: value }),
  setFastMultiplier: (value) => set({ fastMultiplier: value }),
  setSensitivity: (value) => set({ sensitivity: value }),
  setMaxPitch: (value) => set({ maxPitch: value }),
  setMinSpeed: (value) => set({ minSpeed: value }),
  setMaxSpeed: (value) => set({ maxSpeed: value }),
  setDragThreshold: (value) => set({ dragThreshold: value }),
  setRotateSpeed: (value) => set({ rotateSpeed: value }),
  setZoomSpeed: (value) => set({ zoomSpeed: value }),
  setTransitionSpeed: (value) => set({ transitionSpeed: value }),
  resetToDefaults: () => set(defaultSettings),
}));
