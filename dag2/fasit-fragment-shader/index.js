const THREE = require('three');
const dat = require('dat.gui');
const fs = require('fs');
const vertexShaderCode = fs.readFileSync(__dirname + '/vertexshader.glsl', 'utf8');
const fragmentShaderCode = fs.readFileSync(__dirname + '/fragmentshader.glsl', 'utf8');

let scene, camera, renderer;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const uniforms = {
  baseColor: {value: null},
};

const params = {
  baseColor: "#ffaa00"
}

function init() {
  scene = new THREE.Scene();

  initCube();
  initCamera();
  initRenderer();
  initDatGui();
  updateUniforms();

  timeStart = new Date().getTime();

  document.body.appendChild(renderer.domElement);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 0.01, 1000);
  camera.position.set(0, 0, 3.75);
  camera.lookAt(scene.position);
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer();
  //renderer.gammaInput = true;
  //renderer.gammaOutput = true;
  //renderer.gammaFactor = 2;
  renderer.setSize(WIDTH, HEIGHT);
}

function initCube() {
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShaderCode,
    fragmentShader: fragmentShaderCode,
    transparent: true
  });

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    material
  );

  scene.add(plane);
}

function updateUniforms() {
  uniforms.baseColor.value = new THREE.Color(params.baseColor);
}

function initDatGui() {
  var gui = new dat.GUI({width: 275});

  const gradientTypeNames = ["additive", "multiplicative", "hsl space"];

  gui.addColor(params, 'baseColor').onChange(updateUniforms).listen();
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

init();
render();
