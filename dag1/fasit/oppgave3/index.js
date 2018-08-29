const THREE = require("three");
const OrbitControls = require("three-orbit-controls")(THREE);
const analyse = require("./soundanalyser.js");

const fs = require("fs");
const fragmentShaderCode = fs.readFileSync(
  __dirname + "/fragmentshader.glsl",
  "utf8"
);

let scene, camera, renderer, cubes, analyser, timeStart;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const NUM_CUBES = 32;

const UNIFORMS = {
  time: { value: 0.0 }
};

function init() {
  scene = new THREE.Scene();

  timeStart = new Date().getTime();

  initCubes();
  initCamera();
  initRenderer();

  document.body.appendChild(renderer.domElement);

  renderer.render(scene, camera);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 100);
  camera.position.set(0, 7, 20);
  camera.lookAt(scene.position);

  new OrbitControls(camera);
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
}

function initCubes() {
  const material = new THREE.ShaderMaterial({
    uniforms: UNIFORMS,
    fragmentShader: fragmentShaderCode
  });

  cubes = Array(NUM_CUBES)
    .fill()
    .map(function(_, i, l) {
      let n = -1 * Math.floor(l.length / 2) + i;
      let cube = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), material);
      cube.position.set(n * 1 + n * 0.1, 0, 0);
      scene.add(cube);

      return cube;
    });
}

function normalise(min, max, v) {
  return (v - min) / max;
}

function makeCubeDance(analyser) {
  let min = analyser.analyser.minDecibels;
  let max = analyser.analyser.maxDecibels;
  let frequencies = analyser.frequencies();
  cubes.forEach((c, i) =>
    c.scale.set(1, normalise(min, max, frequencies[i]), 1)
  );
}

function updateTime() {
  const now = new Date().getTime();
  UNIFORMS.time.value = (now - timeStart) / 1000;
}

function render(analyser) {
  requestAnimationFrame(render.bind(null, analyser));
  updateTime();
  makeCubeDance(analyser);
  renderer.render(scene, camera);
}

init();
analyse({ fftSize: NUM_CUBES * 2 }, render);
