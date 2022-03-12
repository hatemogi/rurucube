const { Elm } = require('./Main.elm');
import * as THREE from 'three';

const mountNode = document.getElementById('elm-app');

const app = Elm.Main.init({ node: mountNode });

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);

function createCube(x: number, y: number, z: number): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const [red, green, blue, orange, white, yellow] = [
    0xFF0000, 0x00C000, 0x0000FF,
    0xFF8C00, 0xFFFF00, 0xFFFFFF
  ];

  const materials = [red, orange, blue, green, yellow, white]
    .map(color => new THREE.MeshPhongMaterial({ color }));

  const cube = new THREE.Mesh(geometry, materials);
  cube.position.add(new THREE.Vector3(x, y, z));
  return cube;
}

const cubes = [
  createCube(0, 0, 0),
  createCube(3, 0, 0),
  createCube(0, 3, 0),
  createCube(3, 3, 0),
  createCube(6, 3, 0),
  createCube(6, 0, 0),
  createCube(0, 6, 0),
  createCube(3, 6, 0),
  createCube(6, 6, 0),
];

cubes.forEach(cube => scene.add(cube));

const light = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
light.position.set(-2, 3, 5);
// const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

camera.position.add(new THREE.Vector3(5, 5, 10));

function animate(time: number) {
  requestAnimationFrame(animate);
  // time = 3400;
  cubes.forEach(cube => {
    cube.rotation.x = time * 0.0001; cube.rotation.y = time * 0.0001;
  });
  renderer.render(scene, camera);
}

requestAnimationFrame(animate);
