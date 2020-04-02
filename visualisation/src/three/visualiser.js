import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { vertexShader } from './vertexShader';
import { fragmentShader } from './fragmentShader';

// functions
export function createCamera(container) {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = -2;

  const controls = new OrbitControls(camera, container);
  controls.enablePan = false;
  controls.minDistance = 1.5;
  controls.maxDistance = 6.0;
  controls.target = new THREE.Vector3(0, 0, 0);

  return [camera, controls];
}

export function createParticleMesh(
  scene,
  positionData,
  locationIndices,
  locationWeights,
  uniforms,
) {
  const placementGeometry = new THREE.IcosahedronGeometry(1, 7);
  const geometry = new THREE.BufferGeometry();

  const positions = [];
  const colors = [];
  const sizes = [];

  const color = new THREE.Color();
  color.setHSL(0.0, 0.0, 0.5);

  positionData.forEach(indexValue => {
    positions.push(
      placementGeometry.vertices[indexValue].x,
      placementGeometry.vertices[indexValue].y,
      placementGeometry.vertices[indexValue].z,
    );
    // set base colour to 50% grey (for additive shader)
    colors.push(color.r, color.g, color.b);
    // set size to 1 (likely pointless... but I may want to change things later so...)
    sizes.push(1);
  });
  // calculations per vertex in pointSphere

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
  geometry.setAttribute(
    'locationIndices',
    new THREE.Float32BufferAttribute(locationIndices, 4),
  );
  geometry.setAttribute(
    'locationWeights',
    new THREE.Float32BufferAttribute(locationWeights, 4),
  );

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    depthWrite: false,
    transparent: true,
    vertexColors: true,
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

export function createGlobeMesh(scene, spriteTexture, globeTexture) {
  const globeGeometry = new THREE.SphereBufferGeometry(0.999, 32, 32);

  const globeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: globeTexture,
  });

  const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
  scene.add(globeMesh);
}

export function createLights(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
}
