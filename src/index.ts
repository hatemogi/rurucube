const { Elm } = require('./Main.elm');
import * as THREE from 'three';
import * as Model from './model';

const mountNode = document.getElementById('elm-app');

const app = Elm.Main.init({ node: mountNode });

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);

function cellToMesh(cell: Model.Cell): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(2, 2, 2);

  const [red, green, blue, orange, yellow, white, grey] = [
    0xFF0000, 0x00C000, 0x0000FF,
    0xFF8C00, 0xFFFF00, 0xFFFFFF, 0x777777
  ];

  // meterial 순서 => [right, left, up, down, front, back]
  const materials = [cell.right, cell.left, cell.up, cell.down, cell.front, cell.back]
    .map(color => {
      if (color === Model.Color.W) return white;
      else if (color === Model.Color.Y) return yellow;
      else if (color === Model.Color.G) return green;
      else if (color === Model.Color.B) return blue;
      else if (color === Model.Color.R) return red;
      else if (color === Model.Color.O) return orange;
      else return grey;
    }).map(color => new THREE.MeshPhongMaterial({ color }));

  const cube = new THREE.Mesh(geometry, materials);
  return cube;
}

function layerToMeshes(layer: Model.Layer): THREE.Mesh[] {
  const cells = layer;
  return cells.map((cell: Model.Cell, idx: number) => {
    const [x, z] = [idx % 3, Math.floor(idx / 3)];
    const mesh = cellToMesh(cell);
    const pos = new THREE.Vector3(x * 2.2, 0, (2-z) * 2.2);
    mesh.position.add(pos);
    return mesh;
  });
}

function modelToCube(model: Model.Cube): THREE.Mesh[] {
  const layers = model;
  return layers.flatMap((layer: Model.Layer, index: number) => {
    const meshes = layerToMeshes(layer);
    const top = new THREE.Vector3(0, 2.2 * index, 0);
    meshes.forEach(mesh => mesh.position.add(top));
    return meshes;
  });
}

const cubes = modelToCube(Model.defaultCube);
cubes.forEach(cube => scene.add(cube));

const light = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
light.position.set(-2, 3, 5);
// const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

camera.position.add(new THREE.Vector3(7, 7, 20));
camera.lookAt(new THREE.Vector3(0,0, 0));

function animate(time: number) {
  requestAnimationFrame(animate);
  // time = 3400;
  const speed = 0.001;
  const current = time * speed;
  cubes.forEach(cube => {
    //  cube.rotation.x = current;
    cube.rotation.x = current; cube.rotation.y = current; cube.rotation.z = current * 1.1;
  });
  renderer.render(scene, camera);
}

requestAnimationFrame(animate);
