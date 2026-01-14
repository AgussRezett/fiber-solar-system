import { useState } from 'react';
import { useCameraSettingsStore } from '../../../store/useCameraSettingsStore';
import styles from './CameraSettings.module.css';

const SliderControl = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.1,
  tooltip,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  tooltip?: string;
}) => (
  <div className={styles.sliderGroup} title={tooltip}>
    <div className={styles.sliderLabel}>
      <span>{label}</span>
      <span className={styles.sliderValue}>{value.toFixed(2)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className={styles.slider}
    />
  </div>
);

const CameraSettings = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    baseMoveSpeed,
    fastMultiplier,
    sensitivity,
    maxPitch,
    minSpeed,
    maxSpeed,
    dragThreshold,
    rotateSpeed,
    zoomSpeed,
    transitionSpeed,
    setBaseMoveSpeed,
    setFastMultiplier,
    setSensitivity,
    setMaxPitch,
    setMinSpeed,
    setMaxSpeed,
    setDragThreshold,
    setRotateSpeed,
    setZoomSpeed,
    setTransitionSpeed,
    resetToDefaults,
  } = useCameraSettingsStore();

  return (
    <div className={styles.settingsPanel}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? 'Colapsar configuración' : 'Expandir configuración'}
      >
        <span className={styles.toggleIcon}>{isExpanded ? '⚙️' : '⚙️'}</span>
        <span className={styles.toggleText}>Configuración</span>
        <span className={styles.toggleArrow}>{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className={styles.settingsContent}>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Cámara Libre</h4>
            <SliderControl
              label="Velocidad Base"
              value={baseMoveSpeed}
              onChange={setBaseMoveSpeed}
              min={10}
              max={200}
              step={1}
              tooltip="Velocidad de movimiento base de la cámara libre"
            />
            <SliderControl
              label="Multiplicador Rápido"
              value={fastMultiplier}
              onChange={setFastMultiplier}
              min={1}
              max={10}
              step={0.1}
              tooltip="Multiplicador de velocidad al mantener Shift"
            />
            <SliderControl
              label="Sensibilidad"
              value={sensitivity}
              onChange={setSensitivity}
              min={0.001}
              max={0.01}
              step={0.0001}
              tooltip="Sensibilidad del movimiento del mouse"
            />
            <SliderControl
              label="Pitch Máximo"
              value={maxPitch}
              onChange={setMaxPitch}
              min={0.5}
              max={Math.PI / 2 - 0.01}
              step={0.01}
              tooltip="Ángulo máximo de inclinación vertical"
            />
            <SliderControl
              label="Velocidad Mínima"
              value={minSpeed}
              onChange={setMinSpeed}
              min={1}
              max={50}
              step={1}
              tooltip="Velocidad mínima de movimiento"
            />
            <SliderControl
              label="Velocidad Máxima"
              value={maxSpeed}
              onChange={setMaxSpeed}
              min={100}
              max={1000}
              step={10}
              tooltip="Velocidad máxima de movimiento"
            />
            <SliderControl
              label="Umbral de Arrastre"
              value={dragThreshold}
              onChange={setDragThreshold}
              min={1}
              max={20}
              step={0.5}
              tooltip="Distancia mínima para activar el arrastre"
            />
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Cámara Órbita</h4>
            <SliderControl
              label="Velocidad de Rotación"
              value={rotateSpeed}
              onChange={setRotateSpeed}
              min={0.5}
              max={10}
              step={0.1}
              tooltip="Velocidad de rotación alrededor del objetivo"
            />
            <SliderControl
              label="Velocidad de Zoom"
              value={zoomSpeed}
              onChange={setZoomSpeed}
              min={0.1}
              max={5}
              step={0.1}
              tooltip="Velocidad de zoom"
            />
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Transiciones</h4>
            <SliderControl
              label="Velocidad de Transición"
              value={transitionSpeed}
              onChange={setTransitionSpeed}
              min={0.5}
              max={5}
              step={0.1}
              tooltip="Velocidad de transición entre objetivos"
            />
          </div>

          <button
            className={styles.resetButton}
            onClick={resetToDefaults}
            title="Restaurar valores por defecto"
          >
            Restaurar Valores por Defecto
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraSettings;
