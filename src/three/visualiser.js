import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { DataParser } from '../utilities/DataParser';

const stats = new Stats();
let container;
let camera, scene, renderer;
let material;
let uniforms, particleSystem;
let controls;
let cases, locations;
let frame = -Math.PI * 0.5;
let day = 0;

// functions
export function init(
  containerRef,
  data,
  spriteTexture,
  globeTexture,
  globeBumpMap,
  globeLightMap,
) {
  container = containerRef.current;

  locations = DataParser.getPositionVectorsFromData(data);
  cases = DataParser.getConfirmedCases(data);

  const [
    caseData,
    totalDays,
    totalLocations,
  ] = DataParser.getConfirmedCasesAsTextureData(data);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = -2;

  controls = new OrbitControls(camera, container);
  controls.enablePan = false;
  controls.minDistance = 1.5;
  controls.maxDistance = 6.0;
  controls.target = new THREE.Vector3(0, 0, 0);

  scene = new THREE.Scene();

  const placementGeometry = new THREE.IcosahedronGeometry(1, 6);
  const globeGeometry = new THREE.SphereBufferGeometry(0.99, 32, 32);

  const globeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: globeTexture,
    bumpMap: globeBumpMap,
    bumpScale: 0.015,
    emissiveMap: globeLightMap,
    emissive: 0xffffdd,
  });

  const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);

  // lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);

  scene.add(ambientLight);

  uniforms = {
    pointTexture: { value: spriteTexture },
    caseData: { value: caseData },
    day: { value: day },
    totalDays: { value: totalDays },
    totalLocations: { value: totalLocations },
    tween: { value: 0 },
    pixelRatio: { value: window.devicePixelRatio },
    containerHeight: { value: container.clientHeight },
  };

  material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: `
      uniform float tween;
      uniform float pixelRatio;
      uniform float containerHeight;
      uniform sampler2D caseData;
      uniform float day;
      uniform float totalDays;
      uniform float totalLocations;

      attribute float size;
      attribute vec4 locationIndices;
      attribute vec4 locationWeights;

      varying vec3 vColor;

      void setColor(float displacement) {
        // let's try and change the color based on the amplitude received for now...
        if ( displacement < 0.1 ) {
          vColor = vec3(0.0, 0.0, 0.0);
        } else {
          vColor = vec3(0.5 + (displacement * 0.5), 0.5 - (displacement * 0.5), 0.5 - (displacement * 0.5));
        }
      }

      float getCasesValueFromTexture(vec2 coords) {
        vec4 value = texture2D(caseData, coords);
        float combined = (value.w * 256. + value.z * 256. * 256. + value.y * 256. * 256. * 256. + value.x * 256. * 256. * 256. * 256.);
        return combined / 100000000.;
      }

      void main() {
        vec3 pNormal = normalize(position);

        // get current data coords
        vec2 dataCoordX = vec2(locationIndices.x/totalLocations, day/totalDays);
        vec2 dataCoordY = vec2(locationIndices.y/totalLocations, day/totalDays);
        vec2 dataCoordZ = vec2(locationIndices.z/totalLocations, day/totalDays);
        vec2 dataCoordW = vec2(locationIndices.w/totalLocations, day/totalDays);

        // get current dataValues
        float vx = getCasesValueFromTexture(dataCoordX);
        float vy = getCasesValueFromTexture(dataCoordY);
        float vz = getCasesValueFromTexture(dataCoordZ);
        float vw = getCasesValueFromTexture(dataCoordW);

        // for each of the 4 closest locations determine the amout of displacement
        float currentDisplacement = 0.0;

        currentDisplacement += vx * locationWeights.x;
        currentDisplacement += vy * locationWeights.y;
        currentDisplacement += vz * locationWeights.z;
        currentDisplacement += vw * locationWeights.w;

        // get next data coords
        vec2 dataCoordX2 = vec2(locationIndices.x/totalLocations, (day + 1.)/totalDays);
        vec2 dataCoordY2 = vec2(locationIndices.y/totalLocations, (day + 1.)/totalDays);
        vec2 dataCoordZ2 = vec2(locationIndices.z/totalLocations, (day + 1.)/totalDays);
        vec2 dataCoordW2 = vec2(locationIndices.w/totalLocations, (day + 1.)/totalDays);

        // get current dataValues
        float vx2 = getCasesValueFromTexture(dataCoordX2);
        float vy2 = getCasesValueFromTexture(dataCoordY2);
        float vz2 = getCasesValueFromTexture(dataCoordZ2);
        float vw2 = getCasesValueFromTexture(dataCoordW2);

        // for each of the 4 closest locations determine the amout of displacement
        float nextDisplacement = 0.0;

        nextDisplacement += vx2 * locationWeights.x;
        nextDisplacement += vy2 * locationWeights.y;
        nextDisplacement += vz2 * locationWeights.z;
        nextDisplacement += vw2 * locationWeights.w;

        float displacement = mix(currentDisplacement, nextDisplacement, tween);

        // displace the vertex by displacement in direction of normal
        vec3 displacedPosition = position + (pNormal * displacement * 0.05);

        setColor(displacement);

        vec4 mvPosition = modelViewMatrix * vec4( displacedPosition, 1.0 );
        float adjustedPointSize = (size * pixelRatio * containerHeight) * 0.01;
        gl_PointSize = adjustedPointSize * ( 1.0 / (-mvPosition.z));
        gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      
      varying vec3 vColor;
      
      void main() {
      
        gl_FragColor = vec4( vColor, 1.0 );
      
        gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
      
      }
    `,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    depthWrite: false,
    transparent: true,
    vertexColors: true,
  });

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

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
  scene.add(globeMesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);
  container.appendChild(stats.dom);

  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);

  renderer.setAnimationLoop(() => {
    render(totalDays, 0.01);
    stats.update();
  });
}

function onWindowResize() {
  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas AND the uniforms!
  uniforms.containerHeight.value = container.clientHeight;
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function render(totalDays, playSpeed) {
  // currently just stop the animation when the final day is reached
  if (day < totalDays) {
    if (frame >= 1) {
      day += 1;
      frame = day < totalDays ? 0 : 1;
      if (day < cases.length - 1) {
        uniforms.day.value = day;
      }
    }
    uniforms.tween.value = frame;
    frame += playSpeed;
  }
  renderer.render(scene, camera);
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
      // normalise remaining distances to value between 0 and 10
      const calcDistance = (position.distance / 0.4) * 30;
      // weight = normalised inverse square of normalised distance
      position.weight = 1 / (calcDistance * calcDistance + 1);
    }
  });

  return activePositions;
}
