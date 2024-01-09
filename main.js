import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load STL model
// Load STL model
// Load STL model
const loader = new STLLoader();
let model;

loader.load('models/qutub1minar.stl', function (geometry) {
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 200 });
  model = new THREE.Mesh(geometry, material);

  // Set the position above the origin
  model.position.set(0, 2, 0); // Adjust the value of '2' as needed

  // Set the initial rotation
  model.rotation.x = Math.PI * 1.5; // 270 degrees in radians

  scene.add(model);

  // Apply rotation and position changes to the geometry
  model.updateMatrix();
  model.geometry.applyMatrix4(model.matrix);

  // Reset the rotation to avoid double transformations
  model.rotation.set(0, 0, 0);
  // Remove the existing grid if it exists
  const existingGrid = scene.getObjectByName('grid');
  if (existingGrid) {
    scene.remove(existingGrid);
  }

  // Adjust grid size based on the bounding box of the loaded model
  const boundingBox = new THREE.Box3().setFromObject(model);
  const size = boundingBox.getSize(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z);

  // Add a new grid with appropriate size
  const grid = new THREE.GridHelper(maxSize * 2, 10, 0x888888, 0x888888);
  grid.position.copy(boundingBox.getCenter(new THREE.Vector3()));
  grid.position.y = 5; // Adjust the grid position to be below the model
  grid.name = 'grid';
  scene.add(grid);
}, undefined, function (error) {
  console.error(error);
});


// Add lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

// Add orbit controls with Blender-like rotation
// Set initial camera position
camera.position.set(100, 100, 10);
camera.lookAt(0, 0, 0);

// Add orbit controls with Blender-like rotation
const controls = new OrbitControls(camera, renderer.domElement);
controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.ROTATE, RIGHT: THREE.MOUSE.DOLLY };
controls.enableDamping = false; // Disable damping for now

// Handle window resize
window.addEventListener('resize', function () {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});

// Animation loop
const animate = function () {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  renderer.render(scene, camera);
};

animate();

