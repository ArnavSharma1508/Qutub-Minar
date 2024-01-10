import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new STLLoader();
let originalModel;
let frustumModel;
let halfModel;

// Load the original model
loader.load('models/qutub1minar.stl', function (geometry) {
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 200 });
  originalModel = new THREE.Mesh(geometry, material);
  originalModel.position.set(0, 2, 0);
  originalModel.rotation.x = Math.PI * 1.5;
  scene.add(originalModel);
  originalModel.updateMatrix();
  originalModel.geometry.applyMatrix4(originalModel.matrix);
  originalModel.rotation.set(0, 0, 0);
  const boundingBox = new THREE.Box3().setFromObject(originalModel);
  const size = boundingBox.getSize(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z);
  const grid = new THREE.GridHelper(maxSize * 2, 10, 0x888888, 0x888888);
  grid.position.copy(boundingBox.getCenter(new THREE.Vector3()));
  grid.position.y = 5;
  grid.name = 'grid';
  scene.add(grid);
}, undefined, function (error) {
  console.error(error);
});

// Load the frustum model
loader.load('models/frustumqutubminar.stl', function (geometry) {
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 200 });
  frustumModel = new THREE.Mesh(geometry, material);
  frustumModel.position.set(0, 2, 0);
  frustumModel.rotation.x = Math.PI * 1.5;
  frustumModel.visible = false; // Initially set to invisible
  scene.add(frustumModel);
  frustumModel.updateMatrix();
  frustumModel.geometry.applyMatrix4(frustumModel.matrix);
  frustumModel.rotation.set(0, 0, 0);
}, undefined, function (error) {
  console.error(error);
});

// Load the half model
loader.load('models/halfqutubminar.stl', function (geometry) {
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 200 });
  halfModel = new THREE.Mesh(geometry, material);
  halfModel.position.set(0, 2, 0);
  halfModel.rotation.x = Math.PI * 1.5;
  halfModel.visible = false; // Initially set to invisible
  scene.add(halfModel);
  halfModel.updateMatrix();
  halfModel.geometry.applyMatrix4(halfModel.matrix);
  halfModel.rotation.set(0, 0, 0);
}, undefined, function (error) {
  console.error(error);
});

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

camera.position.set(100, 100, 10);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.ROTATE, RIGHT: THREE.MOUSE.DOLLY };
controls.enableDamping = false;

window.addEventListener('resize', function () {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});

// Add buttons to switch between models
const switchToOriginalButton = createSwitchButton('Switch to Original Model', originalModel);
const switchToFrustrumButton = createSwitchButton('Switch to Frustum Model', frustumModel);
const switchToHalfButton = createSwitchButton('Switch to Half Model', halfModel);

document.body.appendChild(switchToOriginalButton);
document.body.appendChild(switchToFrustrumButton);
document.body.appendChild(switchToHalfButton);

function createSwitchButton(text, targetModel) {
  const button = document.createElement('button');
  button.innerHTML = text;
  button.addEventListener('click', function () {
    originalModel.visible = false;
    frustumModel.visible = false;
    halfModel.visible = false;
    targetModel.visible = true;
  });
  return button;
}

const animate = function () {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
};

animate();
