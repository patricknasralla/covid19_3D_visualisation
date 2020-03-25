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

export function createParticleMesh(scene, locations, uniforms) {
  const placementGeometry = new THREE.IcosahedronGeometry(1, 7);
  const geometry = new THREE.BufferGeometry();

  const positions = [];
  const colors = [];
  const sizes = [];
  const locationIndices = [];
  const locationWeights = [];

  const color = new THREE.Color();

  // calculations per vertex in pointSphere
  for (let i = 0; i < placementGeometry.vertices.length; i++) {
    // set vertex positions
    positions.push(
      placementGeometry.vertices[i].x,
      placementGeometry.vertices[i].y,
      placementGeometry.vertices[i].z,
    );

    // calculate bone weights
    const positionWeights = calculateBoneWeights(
      placementGeometry.vertices[i],
      locations,
    );

    positionWeights.forEach(position => {
      locationIndices.push(position.index);
      locationWeights.push(position.weight);
    });

    // set base colour to 50% grey (for additive shader)
    color.setHSL(0.0, 0.0, 0.5);
    colors.push(color.r, color.g, color.b);

    // set size to 1 (likely pointless... but I may want to change things later so...)
    sizes.push(1);
  }

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

export function onWindowResize(camera, container, renderer, uniforms) {
  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas AND the uniforms!
  uniforms.containerHeight.value = container.clientHeight;
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function calculateBoneWeights(vertex, countryVectors) {
  // find closest 4 positions
  const distanceList = [];
  countryVectors.forEach((position, index) => {
    // consider using distanceToSquared...
    const distance = vertex.distanceTo(position);
    distanceList.push({
      index,
      distance,
    });
  });
  distanceList.sort((a, b) => a.distance - b.distance);

  const activePositions = distanceList.slice(0, 4);

  // calculate weights (note, you're gonna want to play with the cutoff...
  activePositions.forEach(position => {
    // set a cutoff for far away values (to stop values passing through sphere)
    if (position.distance > 0.4) position.weight = 0.0;
    else {
      // normalise remaining distances to value between 0 and 50
      const calcDistance = (position.distance / 0.4) * 50;
      // weight = normalised inverse square of normalised distance
      position.weight = 1 / (calcDistance * calcDistance + 1);
    }
  });

  return activePositions;
}
