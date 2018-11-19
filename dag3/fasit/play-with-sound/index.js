const THREE = require("three");
const OrbitControls = require("three-orbit-controls")(THREE);
const analyse = require("./soundanalyser.js");
const fs = require("fs");
const dat = require('dat.gui');

let scene, camera, renderer, cubes, analyser, soundLevel;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const NUM_CUBES = 32;

const params = {
  baseColor: "#ff9500",
  speed: 50.0
}

let texture = new THREE.Color(params.baseColor);

function init() {


  scene = new THREE.Scene();
  scene.background = texture
  initCubes();
  initCamera();
  initRenderer();
  initDatGui();
  document.body.appendChild(renderer.domElement);

  renderer.render(scene, camera);
}

function initDatGui() {
  var gui = new dat.GUI();

  gui.addColor(params, 'baseColor');
  gui.add(params, "speed", 0.0, 100.0);
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
      let cube = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
      cube.position.set(n * 1 + n * 0.1, 0, 0);
      scene.add(cube);
      return cube;
    });
}

function normalise(min, max, v) {
  return ((v - min) / max) * -1;
}

function updateParameters(){
  scene.background = new THREE.Color(params.baseColor);
}

function makeCubesDance() {
  let min = analyser.analyser.minDecibels;
  let max = analyser.analyser.maxDecibels;
  let frequencies = analyser.frequencies();
  cubes.forEach((c, i) => {
    const freq = normalise(min, max, frequencies[i]);
    c.scale.set(1, freq, 1);
    const freqDamperFactor = 10;
    const factor = Math.min(Math.max((freq)/freqDamperFactor, normalise(min, max, 0) / freqDamperFactor), 1);
    const redhex = Math.floor(0xff * factor);
    const redstring = redhex.toString(16);
    const colorhexstring = redstring + "0000";
    const colorhex = parseInt(colorhexstring, 16);
    c.material.color.setHex(colorhex);
    const rotateAngle = factor <= normalise(min, max, 0)/freqDamperFactor ? 0 : factor*(Math.PI/32);
    c.rotateX(rotateAngle * params.speed/freqDamperFactor);
  });
}

function render() {
  requestAnimationFrame(render);
  makeCubesDance();
  updateParameters();
  renderer.render(scene, camera);
}

init();
analyse(function(a) {
  analyser = a;
  render();
});
