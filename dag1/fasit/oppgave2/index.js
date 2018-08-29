const THREE = require("three");
const OrbitControls = require("three-orbit-controls")(THREE);
const analyse = require("./soundanalyser.js");

let scene, camera, renderer, cubes, analyser;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const NUM_CUBES = 32;

function init() {
  scene = new THREE.Scene();

  initCubes();
  initCamera();
  initRenderer();

  document.body.appendChild(renderer.domElement);

  renderer.render(scene, camera);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 1000);
  camera.position.z = 40;

  new OrbitControls(camera);
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
}

function initCubes() {
  cubes = Array(NUM_CUBES)
    .fill()
    .map(function(_, i) {
      let n = -1 * Math.floor(NUM_CUBES / 2) + i;
      let cube = new THREE.Mesh(
        new THREE.CubeGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial()
      );
      cube.position.set(n * 1 + n * 0.1, 0, 0);
      scene.add(cube);

      return cube;
    });
}

function normalise(min, max, v) {
  return (v - min) / max;
}

function makeCubesDance() {
  let min = analyser.analyser.minDecibels;
  let max = analyser.analyser.maxDecibels;
  let frequencies = analyser.frequencies();
  cubes.forEach((c, i) =>
    c.scale.set(1, normalise(min, max, frequencies[i]), 1)
  );
}

function render() {
  requestAnimationFrame(render);
  makeCubesDance();
  renderer.render(scene, camera);
}

init();
analyse({ fftSize: NUM_CUBES * 2 }, function(a) {
  analyser = a;
  render();
});
