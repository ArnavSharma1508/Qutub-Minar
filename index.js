import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new STLLoader();
let models = [];

function loadModel(path, visible) {
  loader.load(path, function (geometry) {
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 200 });
    const model = new THREE.Mesh(geometry, material);
    model.position.set(0, 2, 0);
    model.rotation.x = Math.PI * 1.5;
    model.visible = visible;
    scene.add(model);
    model.updateMatrix();
    model.geometry.applyMatrix4(model.matrix);
    model.rotation.set(0, 0, 0);
    models.push(model);
  }, undefined, function (error) {
    console.error(error);
  });
}

loadModel('models/qutub1minar.stl', true);
loadModel('models/frustumqutubminar.stl', false);
loadModel('models/halfqutubminar.stl', false);

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

const buttonsContainer = document.getElementById('buttonsContainer');

function createButton(text, index) {
  const button = document.createElement('button');
  button.innerHTML = text;
  button.style.marginBottom = '10px'; // Adjust spacing between buttons
  button.addEventListener('click', function () {
    models.forEach((model, i) => (model.visible = i === index));
  });
  return button;
}

['Qutub Minar', 'Frustum Qutub Minar', 'Half Qutub Minar'].forEach((text, index) => {
  const button = createButton(text, index);
  buttonsContainer.appendChild(button);
});

const animate = function () {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

animate();
