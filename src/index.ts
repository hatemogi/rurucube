const { Elm } = require('./Main.elm');
import * as THREE from 'three';
import * as Model from './model';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const mountNode = document.getElementById('elm-app');

const app = Elm.Main.init({ node: mountNode });

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 500);

const controls = new OrbitControls( camera, renderer.domElement );
controls.minDistance = 10;
controls.maxDistance = 30;

const CELL_SIZE = 2;
const CELL_DISTANCE = CELL_SIZE * 1.03

function cubeToMeshes(cube: Model.Cube): THREE.Mesh[] {
  const [red, green, blue, orange, yellow, white, grey] = [
    0xFF0000, 0x00FF00, 0x0000FF,
    0xFA8128, 0xFFFF00, 0xFFFFFF, 0x555555
  ];
  const C = Model.FaceColor;
  const color = (color: Model.FaceColor) => {
    if (color === C.WHITE) return white;
    else if (color === C.YELLOW) return yellow;
    else if (color === C.GREEN) return green;
    else if (color === C.BLUE) return blue;
    else if (color === C.RED) return red;
    else if (color === C.ORANGE) return orange;
  }
  const {front, back, up, down, left, right} = cube;
  return [0, 1, 2].flatMap(z => [0, 1, 2].flatMap(y => [0, 1, 2].map(x => {
    // z = 0 -> 앞쪽.
    // z = 2 -> 뒷쪽
    const frontColor = (z == 0) ? color(front[x + y * 3]) : grey;
    const backColor  = (z == 2) ? color(back[(2 - x) + y * 3]) : grey;
    const upColor    = (y == 2) ? color(up[x + z * 3]) : grey;
    const downColor  = (y == 0) ? color(down[x + (2 - z) * 3]) : grey;
    const leftColor  = (x == 0) ? color(left[(2 - z) + y * 3]) : grey;
    const rightColor = (x == 2) ? color(right[z + y * 3]) : grey;

    const geometry = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE);
    // meterial 순서 => [right, left, up, down, front, back]

    const materials = [
      rightColor, leftColor, upColor, downColor, frontColor, backColor
    ].map(color => new THREE.MeshPhongMaterial({ color }));

    const cube = new THREE.Mesh(geometry, materials);
    cube.position.set((x-1) * CELL_DISTANCE, (y-1) * CELL_DISTANCE, -(z-1) * CELL_DISTANCE);
    return cube;
  })));
}

var cube = Model.defaultCube;
var meshes = cubeToMeshes(cube);
scene.add.apply(scene, meshes);
// cubes.forEach(cube => scene.add(cube));

// scene.remove.apply(scene, cubes);

const rotX: (theta: number) => THREE.Matrix4 = theta => new THREE.Matrix4().makeRotationX(theta);
const rotY: (theta: number) => THREE.Matrix4 = theta => new THREE.Matrix4().makeRotationY(theta);
const rotZ: (theta: number) => THREE.Matrix4 = theta => new THREE.Matrix4().makeRotationZ(theta);

type Layer = [number,number,number,  number,number,number, number,number,number];
const layers: [Layer, Layer, Layer, Layer, Layer, Layer, Layer, Layer, Layer] = [
  [ 0, 1, 2,  3, 4, 5,  6, 7, 8],
  [ 9,10,11, 12,13,14, 15,16,17],
  [18,19,20, 21,22,23, 24,25,26],

  [ 0, 9,18,  3,12,21,  6,15,24],
  [ 1,10,19,  4,13,22,  7,16,25],
  [ 2,11,20,  5,14,23,  8,17,26],

  [ 6,15,24,  7,16,25,  8,17,26],
  [ 3,12,21,  4,13,22,  5,14,23],
  [ 0, 9,18,  1,10,19,  2,11,20]
];

const light1 = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
light1.position.set(-5, 10, 15);

const light2 = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
light2.position.set(-5, -10, 15);
const light = new THREE.AmbientLight(0xF7F7F7); // white light
scene.add(light);
// scene.add(light1, light2);

camera.position.add(new THREE.Vector3(8, 8, 10));
camera.lookAt(new THREE.Vector3(0, 0, 0));


function animate(time: number) {
  requestAnimationFrame(animate);
  // time = 3400;
  const speed = 0.001;
  const current = time * speed;
  meshes.forEach(mesh => {
    //  cube.rotation.x = current;
    // cube.rotation.x = current; cube.rotation.y = current; cube.rotation.z = current * 1.1;
  });
  controls.update();
  renderer.render(scene, camera);
}

renderer.setPixelRatio( window.devicePixelRatio );
requestAnimationFrame(animate);

function rotateLayer(layerIndex: number, theta: number) {
  const matrix = (theta: number) => {
    if (layerIndex < 3) return rotZ(theta);
    else if (layerIndex < 6) return rotX(theta);
    else return rotY(theta);
  }
  layers[layerIndex].forEach(i => meshes[i].applyMatrix4(matrix(theta)));
}

function move(m: Model.Move) {
  scene.remove.apply(scene, meshes);
  cube = Model.move(m)(cube);
  meshes = cubeToMeshes(cube);
  scene.add.apply(scene, meshes);
}

window.onkeydown = (ev: KeyboardEvent) => {
  console.log('keydown', ev.code, ev.ctrlKey, ev.timeStamp);
  const M = Model.Move;
  const prime = ev.ctrlKey;
  switch (ev.code) {
    case "KeyU": move(prime ? M.U_ : M.U); break;
    case "KeyL": move(prime ? M.L_ : M.L); break;
    case "KeyR": move(prime ? M.R_ : M.R); break;
    case "KeyF": move(prime ? M.F_ : M.F); break;
    case "KeyB": move(prime ? M.B_ : M.B); break;
    case "KeyD": move(prime ? M.D_ : M.D); break;
  }
  return '';
};