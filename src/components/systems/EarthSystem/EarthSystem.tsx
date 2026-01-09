import Earth from './Earth';
import ISS from './ISS';
import Moon from './Moon';

const EarthSystem = () => {
  return (
    <group>
      <Earth displacementScale={0.15} />;
      <Moon />
      <ISS />
    </group>
  );
};

export default EarthSystem;
