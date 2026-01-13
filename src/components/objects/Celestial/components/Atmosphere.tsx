import * as THREE from 'three';

type Props = {
  radius: number;
  color: string;
  scale: number;
  intensity?: number;
};

const Atmosphere = ({ radius, color, scale, intensity = 1.0 }: Props) => {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(color) },
      intensity: { value: intensity },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float intensity;

      varying vec3 vNormal;
      varying vec3 vWorldPosition;

      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        float fresnel = pow(1.0 - dot(viewDir, vNormal), 4.0);
        gl_FragColor = vec4(glowColor, fresnel * intensity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.FrontSide,
  });

  return (
    <mesh scale={scale}>
      <sphereGeometry args={[radius, 96, 96]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

export default Atmosphere;
