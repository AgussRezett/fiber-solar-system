import style from './CameraHud.module.css';
import { useCameraStore } from '../../../store/useCameraStore';
import { CAMERA_FREE_MODE } from '../../../types/cameraModes.type';

const CameraHud = () => {
  const { cameraMode, setCameraMode, focusById } = useCameraStore();

  return (
    <div className={style.hudContainer}>
      <div className={style.cameraChip}>
        CAM: {cameraMode === CAMERA_FREE_MODE ? 'FREE' : 'ORBIT'}
      </div>

      <button onClick={() => focusById?.('SOL_001')}>Ir al Sol</button>
      <button onClick={() => focusById?.('PL_EARTH')}>Ir a la Tierra</button>

      <button onClick={() => setCameraMode(CAMERA_FREE_MODE)}>
        Cámara libre
      </button>
    </div>
  );
};

export default CameraHud;
