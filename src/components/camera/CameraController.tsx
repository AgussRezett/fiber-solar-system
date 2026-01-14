import { TrackballControls } from '@react-three/drei';
import { useRef } from 'react';
import { CAMERA_ORBIT_MODE } from '../../types/cameraModes.type';
import { useCameraStore } from '../../store/useCameraStore';
import { useFreeCamera } from './hooks/useFreeCamera';
import { useCameraTransition } from './hooks/useCameraTransition';
import { useOrbitFollow } from './hooks/useOrbitFollow';
import { useCameraSettingsStore } from '../../store/useCameraSettingsStore';

const CameraController = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const { cameraMode, focusTarget } = useCameraStore();
  const { rotateSpeed, zoomSpeed } = useCameraSettingsStore();

  useFreeCamera();
  useCameraTransition(controlsRef);
  useOrbitFollow(controlsRef);

  return (
    <>
      {cameraMode === CAMERA_ORBIT_MODE && focusTarget && (
        <TrackballControls
          ref={controlsRef}
          noPan
          staticMoving
          rotateSpeed={rotateSpeed}
          zoomSpeed={zoomSpeed}
        />
      )}
    </>
  );
};

export default CameraController;
