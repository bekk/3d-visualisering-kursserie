const THREE = require("three");
const OrbitControls = require("three-orbit-controls")(THREE);
const dat = require("dat.gui");
const fs = require("fs");
const vertexShaderCode = fs.readFileSync(
  `${__dirname}/vertexshader.glsl`,
  "utf8"
);
const fragmentShaderCode = fs.readFileSync(
  `${__dirname}/fragmentshader.glsl`,
  "utf8"
);

let scene, camera, renderer;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

function init() {
  scene = new THREE.Scene();

  initCamera();
  initRenderer();
  initDatGui();

  document.body.appendChild(renderer.domElement);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 0.01, 1000);
  camera.position.set(0, 0, 50);
  camera.lookAt(scene.position);

  new OrbitControls(camera);
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
}

function initDatGui() {
  var gui = new dat.GUI();
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

init();
render();
