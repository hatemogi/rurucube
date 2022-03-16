const { Elm } = require('./Main.elm');
import * as THREE from 'three';
import * as Model from './model';
import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

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

function cubeToMeshes(cube: Model.Cube): THREE.Mesh[] {
  const [red, green, blue, orange, yellow, white, grey] = [
    0xFF0000, 0x00C000, 0x0000FF,
    0xFF8C00, 0xFFFF00, 0xFFFFFF, 0x777777
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
  return [0, 1, 2].flatMap(x => [0, 1, 2].flatMap(y => [0, 1, 2].map(z => {
    const frontColor = (z == 0) ? color(front[x + y * 3]) : grey;
    const backColor  = (z == 2) ? color(back[(2 - x) + y * 3]) : grey;
    const upColor    = (y == 2) ? color(up[x + z * 3]) : grey;
    const downColor  = (y == 0) ? color(down[x + z * 3]) : grey;
    const leftColor  = (x == 0) ? color(left[z + y * 3]) : grey;
    const rightColor = (x == 2) ? color(right[(2 - z) + y * 3]) : grey;

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    // meterial 순서 => [right, left, up, down, front, back]

    const materials = [
      rightColor, leftColor, upColor, downColor, frontColor, backColor
    ].map(color => new THREE.MeshPhongMaterial({ color }));

    const cube = new THREE.Mesh(geometry, materials);
    cube.position.set((x-1) * 2.15, (y-1) * 2.15, -(z-1) * 2.15);
    return cube;
  })));
}

const quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 7 );

const cubes = cubeToMeshes(Model.defaultCube);
cubes.forEach(cube => scene.add(cube));

cubes[6].applyQuaternion(quaternion);

const light = new THREE.HemisphereLight(0xffffff, 0x080820, 1.5);
light.position.set(5, 10, 15);
// const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

camera.position.add(new THREE.Vector3(8, 8, 10));
camera.lookAt(new THREE.Vector3(0, 0, 0));

const aniGroup = new THREE.AnimationObjectGroup(cubes[0], cubes[1], cubes[2]);


function animate(time: number) {
  requestAnimationFrame(animate);
  // time = 3400;
  const speed = 0.001;
  const current = time * speed;
  cubes.forEach(cube => {
    //  cube.rotation.x = current;
    // cube.rotation.x = current; cube.rotation.y = current; cube.rotation.z = current * 1.1;
  });
  controls.update();
  renderer.render(scene, camera);
}

renderer.setPixelRatio( window.devicePixelRatio );
requestAnimationFrame(animate);
