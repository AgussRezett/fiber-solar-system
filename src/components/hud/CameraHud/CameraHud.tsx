import styles from './CameraHud.module.css';
import { useCameraStore } from '../../../store/useCameraStore';
import { CAMERA_FREE_MODE } from '../../../types/cameraModes.type';
import PlanetNavigation from '../PlanetNavigation/PlanetNavigation';
import CameraSettings from '../CameraSettings/CameraSettings';

const CameraHud = () => {
  const { cameraMode, setCameraMode } = useCameraStore();

  return (
    <div className={styles.hudContainer}>
      {/* Status indicator - top left */}
      <div className={styles.statusChip}>
        <span className={styles.statusLabel}>MODO:</span>
        <span className={styles.statusValue}>
          {cameraMode === CAMERA_FREE_MODE ? 'LIBRE' : 'ÓRBITA'}
        </span>
      </div>

      {/* Navigation panel - left side */}
      <div className={styles.leftPanel}>
        <PlanetNavigation />
      </div>

      {/* Settings panel - right side */}
      <div className={styles.rightPanel}>
        <CameraSettings />
      </div>

      {/* Quick action button - bottom left */}
      <div className={styles.quickActions}>
        <button
          className={styles.quickButton}
          onClick={() => setCameraMode(CAMERA_FREE_MODE)}
          title="Cambiar a modo cámara libre"
        >
          <span className={styles.quickButtonIcon}>🎥</span>
          <span className={styles.quickButtonText}>Cámara Libre</span>
        </button>
      </div>
    </div>
  );
};

export default CameraHud;
