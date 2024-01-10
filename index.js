import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new STLLoader();
let currentModel;

// Load the original model
loader.load('models/qutub1minar.stl', function (geometry) {
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 200 });
  currentModel = new THREE.Mesh(geometry, material);
  currentModel.position.set(0, 2, 0);
  currentModel.rotation.x = Math.PI * 1.5;
  scene.add(currentModel);
  currentModel.updateMatrix();
  currentModel.geometry.applyMatrix4(currentModel.matrix);
  currentModel.rotation.set(0, 0, 0);
  const boundingBox = new THREE.Box3().setFromObject(currentModel);
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
const switchButton = createSwitchButton('Switch Model', currentModel);
document.body.appendChild(switchButton);

function createSwitchButton(text, targetModel) {
  const button = document.createElement('button');
  button.innerHTML = text;
  button.addEventListener('click', function () {
    scene.remove(targetModel); // Remove the current model
    // Load the new model (change the file path accordingly)
    loader.load('models/frustumqutubminar.stl', function (geometry) {
      const material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 200 });
      currentModel = new THREE.Mesh(geometry, material);
      currentModel.position.set(0, 2, 0);
      currentModel.rotation.x = Math.PI * 1.5;
      scene.add(currentModel);
      currentModel.updateMatrix();
      currentModel.geometry.applyMatrix4(currentModel.matrix);
      currentModel.rotation.set(0, 0, 0);
    }, undefined, function (error) {
      console.error(error);
    });
  });
  return button;
}

const animate = function () {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
};

animate();
