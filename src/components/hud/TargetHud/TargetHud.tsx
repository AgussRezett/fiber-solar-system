import styles from './TargetHud.module.css';
import { useCameraStore } from '../../../store/useCameraStore';

const formatKm = (value: number) =>
  value.toLocaleString('en-US', { maximumFractionDigits: 0 });

const TargetHud = () => {
  const { targetHud } = useCameraStore();

  return (
    <div
      className={`${styles.container} ${targetHud.visible && styles.containerVisible}`}
    >
      <div className={styles.title}>{targetHud.name}</div>
      <div className={styles.subtitle}>{targetHud.type}</div>

      <div className={styles.separator} />

      {targetHud.radiusKm && (
        <div className={styles.row}>
          <span>Radius</span>
          <span>{formatKm(targetHud.radiusKm)} km</span>
        </div>
      )}
    </div>
  );
};

export default TargetHud;
