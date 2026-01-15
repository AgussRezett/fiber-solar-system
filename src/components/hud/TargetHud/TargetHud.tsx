import styles from './TargetHud.module.css';
import { useCameraStore } from '../../../store/useCameraStore';

const formatKm = (value: number) =>
  value.toLocaleString('en-US', { maximumFractionDigits: 0 });

const TargetHUD = () => {
  const { targetHud } = useCameraStore();

  if (!targetHud.visible) return null;

  return (
    <div className={styles.container} style={{ opacity: targetHud.opacity }}>
      <div className={styles.title}>{targetHud.name}</div>
      <div className={styles.subtitle}>{targetHud.type}</div>

      <div className={styles.separator} />

      <div className={styles.row}>
        <span>Distance</span>
        <span>{formatKm(targetHud.distance)} km</span>
      </div>

      {targetHud.radiusKm && (
        <div className={styles.row}>
          <span>Radius</span>
          <span>{formatKm(targetHud.radiusKm)} km</span>
        </div>
      )}
    </div>
  );
};

export default TargetHUD;
