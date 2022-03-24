import * as THREE from 'three';
import * as M from './model';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 500);

const controls = new OrbitControls( camera, renderer.domElement );
controls.minDistance = 10;
controls.maxDistance = 30;

const CELL_SIZE = 2;
const CELL_DISTANCE = CELL_SIZE * 1.03;

/*
const light1 = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
light1.position.set(-5, 10, 15);

const light2 = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
light2.position.set(-5, -10, 15);
*/

const light = new THREE.AmbientLight(0xFfFfFf); // white light
scene.add(light);
// scene.add(light1, light2);

function setCameraPosition() {
  camera.position.set(8, 8, 10);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
}

// https://colorswall.com/palette/171
const [red, green, blue, orange, yellow, white, grey] = [
  0xb71234, 0x009b48, 0x0046ad,
  0xff5800, 0xffd500, 0xffffff, 0x222222
].map(color => new THREE.MeshBasicMaterial({ color }));

const materialTable: THREE.MeshBasicMaterial[] = (function() {
  const table = [];
  const C = M.FaceColor;
  table[C.WHITE]  = white;
  table[C.YELLOW] = yellow;
  table[C.BLUE]   = blue;
  table[C.GREEN]  = green;
  table[C.RED]    = red;
  table[C.ORANGE] = orange;
  table[C.NONE]   = grey;
  return table;
})();

function cubeToMeshes({front, back, up, down, left, right}: M.Cube): THREE.Mesh[] {
  return [0, 1, 2].flatMap(z => [0, 1, 2].flatMap(y => [0, 1, 2].map(x => {
    // z = 0 -> 앞쪽.
    // z = 2 -> 뒷쪽

    const geometry = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE);

    const grey = M.FaceColor.NONE;
    const T = materialTable;
    const materials = [
      // meterial 순서 => [right, left, up, down, front, back]
      T[ x == 2 ? right[z + y*3    ] : grey ],
      T[ x == 0 ? left [(2-z) + y*3] : grey ],
      T[ y == 2 ? up   [x + z*3    ] : grey ],
      T[ y == 0 ? down [x + (2-z)*3] : grey ],
      T[ z == 0 ? front[x + y*3    ] : grey ],
      T[ z == 2 ? back [(2-x) + y*3] : grey ]
    ];

    const mesh = new THREE.Mesh(geometry, materials);
    mesh.position.set((x-1) * CELL_DISTANCE, (y-1) * CELL_DISTANCE, -(z-1) * CELL_DISTANCE);
    return mesh;
  })));
}

var cube = M.defaultCube;
var meshes: THREE.Mesh[] = [];

function resetCubes(c: M.Cube): M.Cube {
  scene.remove.apply(scene, meshes);
  meshes.forEach(m => m.geometry.dispose());
  cube = c;
  meshes = cubeToMeshes(cube);
  scene.add.apply(scene, meshes);
  return cube;
}

function initCubes(c: M.Cube): M.Cube {
  meshes = cubeToMeshes(cube);
  scene.add.apply(scene, meshes);
  return cube;
}

const rotX: (theta: number) => THREE.Matrix4 = theta => new THREE.Matrix4().makeRotationX(theta);
const rotY: (theta: number) => THREE.Matrix4 = theta => new THREE.Matrix4().makeRotationY(theta);
const rotZ: (theta: number) => THREE.Matrix4 = theta => new THREE.Matrix4().makeRotationZ(theta);

type Layer = number[];
const allMeshes = [0,1,2, 3,4,5, 6,7,8, 9,10,11, 12,13,14, 15,16,17, 18,19,20, 21,22,23, 24,25,26];

const layers: Layer[] = [
  [ 0, 1, 2,  3, 4, 5,  6, 7, 8],
  [ 9,10,11, 12,13,14, 15,16,17],
  [18,19,20, 21,22,23, 24,25,26],
  allMeshes,

  [ 0, 9,18,  3,12,21,  6,15,24],
  [ 1,10,19,  4,13,22,  7,16,25],
  [ 2,11,20,  5,14,23,  8,17,26],
  allMeshes,

  [ 6,15,24,  7,16,25,  8,17,26],
  [ 3,12,21,  4,13,22,  5,14,23],
  [ 0, 9,18,  1,10,19,  2,11,20],
  allMeshes,
];

function moveToLayer({slice}: M.Move): number {
  const S = M.Slice;
  switch (slice) {
    case S.U: return 8;
    case S.D: return 10;
    case S.R: return 6;
    case S.L: return 4;
    case S.F: return 0;
    case S.B: return 2;
    case S.X: return 7;
    case S.Y: return 11;
    case S.Z: return 3;
  }
}

function moveToAngle({slice, prime}: M.Move): number {
  const angle = Math.PI / 2;
  const S = M.Slice;
  switch (slice) {
    case S.U: case S.R: case S.F: case S.Y: case S.X: case S.Z:
      return prime ? angle : -angle;
    default:
      return prime ? -angle : angle;
  }
}

function rotate(m: M.Move, percent: number) {
  const layer = moveToLayer(m);
  const angle = moveToAngle(m);
  const matrix = (theta: number) => {
    if (layer < 4) return rotZ(theta);
    else if (layer < 8) return rotX(theta);
    else return rotY(theta);
  }
  const mat = matrix(angle * percent);
  layers[layer].forEach(i => meshes[i].applyMatrix4(mat));
}

function render() {
  controls.update();
  renderer.render(scene, camera);
}

export { initCubes, resetCubes, rotate, setCameraPosition, render };