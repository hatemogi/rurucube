const { Elm } = require('./Main.elm');
import * as THREE from 'three';
import * as Model from './model';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const mountNode = document.getElementById('elm-app');

const app = Elm.Main.init({ node: mountNode });

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
const CELL_DISTANCE = CELL_SIZE * 1.03


// https://colorswall.com/palette/171
const [red, green, blue, orange, yellow, white, grey] = [
  0xb71234, 0x009b48, 0x0046ad,
  0xff5800, 0xffd500, 0xffffff, 0x222222
].map(color => new THREE.MeshPhongMaterial({ color }));

const materialTable: THREE.MeshPhongMaterial[] = (function() {
  const table = [];
  const C = Model.FaceColor;
  table[C.WHITE]  = white;
  table[C.YELLOW] = yellow;
  table[C.BLUE]   = blue;
  table[C.GREEN]  = green;
  table[C.RED]    = red;
  table[C.ORANGE] = orange;
  table[C.NONE]   = grey;
  return table;
})();

function cubeToMeshes({front, back, up, down, left, right}: Model.Cube): THREE.Mesh[] {
  return [0, 1, 2].flatMap(z => [0, 1, 2].flatMap(y => [0, 1, 2].map(x => {
    // z = 0 -> 앞쪽.
    // z = 2 -> 뒷쪽

    const geometry = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE);

    const grey = Model.FaceColor.NONE;
    const M = materialTable;
    const materials = [
      // meterial 순서 => [right, left, up, down, front, back]
      M[ x == 2 ? right[z + y*3    ] : grey ],
      M[ x == 0 ? left [(2-z) + y*3] : grey ],
      M[ y == 2 ? up   [x + z*3    ] : grey ],
      M[ y == 0 ? down [x + (2-z)*3] : grey ],
      M[ z == 0 ? front[x + y*3    ] : grey ],
      M[ z == 2 ? back [(2-x) + y*3] : grey ]
    ];

    const mesh = new THREE.Mesh(geometry, materials);
    mesh.position.set((x-1) * CELL_DISTANCE, (y-1) * CELL_DISTANCE, -(z-1) * CELL_DISTANCE);
    return mesh;
  })));
}

var cube = Model.defaultCube;
var meshes = cubeToMeshes(cube);
scene.add.apply(scene, meshes);

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


function rotateLayer(layerIndex: number, theta: number) {
  const matrix = (theta: number) => {
    if (layerIndex < 4) return rotZ(theta);
    else if (layerIndex < 8) return rotX(theta);
    else return rotY(theta);
  }
  const m = matrix(theta);
  layers[layerIndex].forEach(i => meshes[i].applyMatrix4(m));
}

function resetCubes(c: Model.Cube): Model.Cube {
  scene.remove.apply(scene, meshes);
  cube = c;
  meshes = cubeToMeshes(cube);
  scene.add.apply(scene, meshes);
  return cube;
}

const commandHistory: Model.Move[] = [];

type FrameTime = number;
type AnimationCommand = {
  requestAt: FrameTime;
  startAt: FrameTime;
  endAt: FrameTime;
  processedUntil: FrameTime;
  onTime: (t: FrameTime, animation: AnimationCommand) => void;
  onFinish: (t: FrameTime) => void;
}

const animationQueue: AnimationCommand[] = [];

function moveToLayer({slice}: Model.Move): number {
  const S = Model.Slice;
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

function moveToAngle({slice, prime}: Model.Move): number {
  const angle = Math.PI / 2;
  const S = Model.Slice;
  switch (slice) {
    case S.U: case S.R: case S.F: case S.Y: case S.X: case S.Z:
      return prime ? angle : -angle;
    default:
      return prime ? -angle : angle;
  }
}

function move(m: Model.Move, t: FrameTime) {
  commandHistory.push(m);
  console.log("history", commandHistory);
  const layer = moveToLayer(m);
  const angle = moveToAngle(m);
  animationQueue.push({
    requestAt: t,
    startAt: 0,
    processedUntil: 0,
    endAt: 0,
    onTime: (t, animation) => {
      const dt = t - animation.processedUntil;
      const duration = animation.endAt - animation.startAt;
      rotateLayer(layer, angle * (dt / duration));
    },
    onFinish: t => {
      resetCubes(Model.move(m)(cube));
    }
  });
}

function doAnimation(t: FrameTime) {
  const duration = 300; // in milliseconds
  if (animationQueue.length > 0) {
    const animation = animationQueue[0];
    if (animation.startAt <= 0) {
      // not started yet
      animation.startAt = t;
      animation.processedUntil = t;
      animation.endAt = t + (duration / (animationQueue.length * animationQueue.length));
    } else if (t <= animation.endAt) {
      // should be during animation
      animation.onTime(t, animation);
      animation.processedUntil = t;
    } else {
      // finished
      animation.onFinish(t);
      animationQueue.shift();
    }
  }
}

window.onkeydown = (ev: KeyboardEvent) => {
  console.log('keydown', ev.code, ev.shiftKey, ev.timeStamp);
  const S = Model.Slice;
  const t = ev.timeStamp;
  const prime = ev.shiftKey;
  switch (ev.code) {
    case "KeyU": move({slice: S.U, prime}, t); break;
    case "KeyL": move({slice: S.L, prime}, t); break;
    case "KeyR": move({slice: S.R, prime}, t); break;
    case "KeyF": move({slice: S.F, prime}, t); break;
    case "KeyB": move({slice: S.B, prime}, t); break;
    case "KeyD": move({slice: S.D, prime}, t); break;
    case "KeyX": move({slice: S.X, prime}, t); break;
    case "KeyY": move({slice: S.Y, prime}, t); break;
    case "KeyZ": move({slice: S.Z, prime}, t); break;
    case "Space": setCameraPosition(); break;
    case "Escape": resetCubes(Model.defaultCube); break;
  }
  return '';
};

setCameraPosition();

function animate(time: number) {
  requestAnimationFrame(animate);
  doAnimation(time);
  controls.update();
  renderer.render(scene, camera);
}

requestAnimationFrame(animate);
