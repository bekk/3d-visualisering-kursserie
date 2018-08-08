const createAnalyser = require('web-audio-analyser');
const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

var scene, camera, renderer, cubes, analyser;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var SPEED = 0.01;

function init() {
  scene = new THREE.Scene();

  initCube();
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

function initCube() {
  cubes = Array(32)
    .fill()
    .map(function(_, i, l) {
      let n = -1 * Math.floor(l.length / 2) + i;
      let cube = new THREE.Mesh(
        new THREE.CubeGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial()
      );
      cube.position.set(n * 1 + n * 0.1, 0, 0);
      scene.add(cube);

      return cube;
    });
}

function normalise(v) {
  return (v - analyser.analyser.minDecibels) / analyser.analyser.maxDecibels;
}

function rotateCube(freqs) {
  cubes.forEach((c, i) => c.scale.set(1, normalise(freqs[i]), 1));
}

function render() {
  requestAnimationFrame(render);
  rotateCube(analyser.frequencies());
  renderer.render(scene, camera);
}

init();
navigator.mediaDevices
  .getUserMedia({ video: false, audio: true })
  .then(function(stream) {
    analyser = createAnalyser(stream, { stereo: false, audible: false });
    analyser.analyser.fftSize = 64;

    render();
  })
  .catch(function(error) {
    console.error(error);
  });
