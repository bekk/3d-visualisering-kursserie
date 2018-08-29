const THREE = require("three");
const fs = require("fs");
const fragmentShaderCode = fs.readFileSync(
  __dirname + "/fragmentshader.glsl",
  "utf8"
);

let scene, camera, renderer;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const SPEED = 0.004;

const uniforms = {
  time: { value: 0.0 }
};

let timeStart = 0;

function init() {
  scene = new THREE.Scene();

  initCube();
  initCamera();
  initRenderer();

  timeStart = new Date().getTime();

  document.body.appendChild(renderer.domElement);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10);
  camera.position.set(0, 3, 4);
  camera.lookAt(scene.position);
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
}

function initCube() {
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: fragmentShaderCode,
    transparent: true
  });

  cube = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 2), material);
  scene.add(cube);
}

function rotateCube() {
  cube.rotation.x -= SPEED * 2;
  cube.rotation.y -= SPEED;
  cube.rotation.z -= SPEED * 3;
}

function updateTime() {
  const now = new Date().getTime();
  uniforms.time.value = (now - timeStart) / 1000;
}

function render() {
  requestAnimationFrame(render);
  updateTime();
  rotateCube();
  renderer.render(scene, camera);
}

init();
render();
