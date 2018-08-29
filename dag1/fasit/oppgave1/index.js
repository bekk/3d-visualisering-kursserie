const THREE = require("three");

let scene, camera, renderer, cube, analyser;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const SPEED = 0.01;

function init() {
  scene = new THREE.Scene();

  initCube();
  initCamera();
  initRenderer();

  document.body.appendChild(renderer.domElement);

  renderer.render(scene, camera);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 1000);
  camera.position.z = 5;
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
}

function initCube() {
  cube = new THREE.Mesh(
    new THREE.CubeGeometry(2, 2, 2),
    new THREE.MeshNormalMaterial()
  );
  cube.position.set(0, 0, 0);
  scene.add(cube);
}

function rotateCube() {
  cube.rotation.x -= SPEED * 2;
  cube.rotation.y -= SPEED;
  cube.rotation.z -= SPEED * 3;
}

function render() {
  requestAnimationFrame(render);
  rotateCube();
  renderer.render(scene, camera);
}

init();
render();
