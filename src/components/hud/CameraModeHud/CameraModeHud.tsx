import styles from './CameraModeHud.module.css';
import { useCameraStore } from '../../../store/useCameraStore';
import {
  CAMERA_FREE_MODE,
  CAMERA_ORBIT_MODE,
  CAMERA_TRANSITION_MODE,
} from '../../../types/cameraModes.type';

const CameraModeHud = () => {
  const { cameraMode } = useCameraStore();

  return (
    <div className={`${styles.container} ${styles.containerVisible}`}>
      <div className={styles.blurBackground}></div>
      <div className={styles.content}>
        <section>
          <div className={styles.label}>Camera Mode</div>
          <div className={styles.value}>
            {cameraMode === CAMERA_TRANSITION_MODE
              ? CAMERA_ORBIT_MODE
              : cameraMode}
          </div>
        </section>

        <section>
          <div className={styles.label}>Controls</div>

          <ul className={styles.controls}>
            <li>
              <span>Mouse</span> Rotate / Zoom
            </li>
            {cameraMode === CAMERA_FREE_MODE && (
              <>
                <li>
                  <span>L Shift</span> Boost
                </li>
                <li>
                  <span>W A S D</span> Move
                </li>
                <li>
                  <span>Space</span> Up
                </li>
                <li>
                  <span>Ctrl</span> Down
                </li>
              </>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default CameraModeHud;
