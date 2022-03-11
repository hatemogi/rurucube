const { Elm } = require('./Main.elm');
import * as THREE from 'three';

const mountNode = document.getElementById('elm-app');

const app = Elm.Main.init({ node: mountNode });

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);

const geometry = new THREE.BoxGeometry(2, 2, 2);
const materials = [
  0xFF0000, 0x00FF00, 0x0000FF,
  0xFFFA50, 0xFFFF00, 0xFFFFFF
].map(color => new THREE.MeshToonMaterial({ color }));

const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
// const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

camera.position.x = 2;
camera.position.y = 1;
camera.position.z = 7;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01; cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
