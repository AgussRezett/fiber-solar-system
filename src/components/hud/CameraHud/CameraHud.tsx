import { useCameraStore } from '../../../store/useCameraStore';
import {
  CAMERA_FREE_MODE,
  CAMERA_ORBIT_MODE,
} from '../../../types/cameraModes.type';
import style from './CameraHud.module.css';
const CameraHud = () => {
  const { cameraMode } = useCameraStore();
  const focusBody = useCameraStore((s) => s.focusBody);
  return (
    <div className={style.hudContainer}>
      <div className={style.cameraChip}>
        CAM: {cameraMode === CAMERA_FREE_MODE ? 'FREE' : 'ORBIT'}
        {cameraMode === CAMERA_ORBIT_MODE && (
          <div style={{ opacity: 0.7 }}>ESC → Free cam</div>
        )}
        {cameraMode === CAMERA_FREE_MODE && (
          <div style={{ opacity: 0.7 }}>WASD · Mouse · Shift</div>
        )}
      </div>

      <button onClick={() => focusBody?.(earthRef.current!)}>
        Focus Earth
      </button>
      {/* <button onClick={() => goToPlanet("PL_EARTH")}> */}
      {/* <button onClick={() => goToPlanet('PL_EARTH')}>Go to Earth</button>
      <button onClick={freeCamera}>Free Camera</button> */}
    </div>
  );
};

export default CameraHud;
