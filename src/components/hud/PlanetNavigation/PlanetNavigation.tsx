import { useCameraStore } from '../../../store/useCameraStore';
import solarSystemData from '../../../data/solarSystem.json';
import styles from './PlanetNavigation.module.css';

interface CelestialBody {
  id: string;
  type: string;
  parentId?: string;
}

const getBodyName = (id: string): string => {
  const names: Record<string, string> = {
    SOL_001: 'Sol',
    PL_MERCURY: 'Mercurio',
    PL_VENUS: 'Venus',
    PL_EARTH: 'Tierra',
    MO_MOON: 'Luna',
    PL_MARS: 'Marte',
    MO_PHOBOS: 'Fobos',
    PL_JUPITER: 'Júpiter',
    MO_IO: 'Ío',
    PL_SATURN: 'Saturno',
    PL_URANUS: 'Urano',
    PL_NEPTUNE: 'Neptuno',
  };
  return names[id] || id;
};

const PlanetNavigation = () => {
  const { startOrbitById } = useCameraStore();

  const handleNavigate = (id: string) => {
    startOrbitById?.(id);
  };

  const mainBodies = (solarSystemData as CelestialBody[]).filter(
    (body) =>
      body.type === 'star' || body.type === 'planet' || body.id === 'MO_MOON'
  );

  return (
    <div className={styles.navigationPanel}>
      <div className={styles.bodyList}>
        {mainBodies.map((body) => (
          <button
            key={body.id}
            className={styles.bodyButton}
            onClick={() => handleNavigate(body.id)}
            title={`Navegar a ${getBodyName(body.id)}`}
          >
            <span className={styles.bodyName}>{getBodyName(body.id)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlanetNavigation;
