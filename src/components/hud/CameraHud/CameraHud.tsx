import TargetHUD from '../TargetHud/TargetHud';

const CameraHud = () => {
  return (
    <>
      {/* <div className={styles.hudContainer}>
      <div className={styles.statusChip}>
        <span className={styles.statusLabel}>MODO:</span>
        <span className={styles.statusValue}>
          {cameraMode === CAMERA_FREE_MODE ? 'LIBRE' : 'ÓRBITA'}
        </span>
      </div>

      <div className={styles.rightPanel}>
        <CameraSettings />
      </div>

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
      </div> */}
      <TargetHUD />
    </>
  );
};

export default CameraHud;
