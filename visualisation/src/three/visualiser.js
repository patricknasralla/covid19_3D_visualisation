import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DataParser } from '../utilities/DataParser';
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

export function parseData(data) {
  const locations = DataParser.getPositionVectorsFromData(data);
  const [
    caseData,
    totalDays,
    totalLocations,
  ] = DataParser.getConfirmedCasesAsTextureData(data);
  return [locations, caseData, totalDays, totalLocations];
}

export function createParticleMesh(scene, data, uniforms) {
  const geometry = new THREE.BufferGeometry();

  const colors = [];
  const sizes = [];

  const color = new THREE.Color();

  // calculations per vertex in pointSphere
  for (let i = 0; i < data.positions.length; i++) {
    // set base colour to 50% grey (for additive shader)
    color.setHSL(0.0, 0.0, 0.5);
    colors.push(color.r, color.g, color.b);
    // set size to 1 (likely pointless... but I may want to change things later so...)
    sizes.push(1);
  }

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(data.positions, 3),
  );
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
  geometry.setAttribute(
    'locationIndices',
    new THREE.Float32BufferAttribute(data.locationIndices, 4),
  );
  geometry.setAttribute(
    'locationWeights',
    new THREE.Float32BufferAttribute(data.locationWeights, 4),
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
