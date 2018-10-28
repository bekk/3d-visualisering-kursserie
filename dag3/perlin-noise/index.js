const THREE = require("three");
const OrbitControls = require("three-orbit-controls")(THREE);
const dat = require("dat.gui");
const fs = require("fs");
const glsl = require("glslify");

const vertexShaderCode = glsl(
  fs.readFileSync(`${__dirname}/vertexshader.glsl`, "utf8")
);
const fragmentShaderCode = glsl(
  fs.readFileSync(`${__dirname}/fragmentshader.glsl`, "utf8")
);
const orbVertexShaderCode = glsl(
  fs.readFileSync(`${__dirname}/orb-vertexshader.glsl`, "utf8")
);
const orbFragmentShaderCode = glsl(
  fs.readFileSync(`${__dirname}/orb-fragmentshader.glsl`, "utf8")
);

let scene, camera, renderer;
let plane, orb;

let t0 = Date.now();
let uniforms = {
  time: { value: 0 },
  light: { value: new THREE.Vector3(0, 0, 5) }
};

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

function init() {
  scene = new THREE.Scene();

  initCamera();
  initRenderer();
  initDatGui();
  initPlane();
  initOrb();

  document.body.appendChild(renderer.domElement);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 0.01, 1000);
  camera.position.set(0, 0, 15);
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

function initPlane() {
  let geometry = new THREE.PlaneBufferGeometry(20, 10, 200, 200);
  let material = new THREE.ShaderMaterial({
    vertexShader: vertexShaderCode,
    fragmentShader: fragmentShaderCode,
    // wireframe: true,
    // transparent: true,
    uniforms
  });

  plane = new THREE.Mesh(geometry, material);
  plane.rotation.set((-2 * Math.PI) / 5, 0, 0);
  scene.add(plane);
}

function initOrb() {
  let geometry = new THREE.SphereBufferGeometry(0.1, 16, 16);
  let material = new THREE.ShaderMaterial({
    vertexShader: orbVertexShaderCode,
    fragmentShader: orbFragmentShaderCode,
    uniforms
  });

  orb = new THREE.Mesh(geometry, material);
  orb.position.set(0, 1, 0);
  scene.add(orb);
}

function render() {
  requestAnimationFrame(render);
  uniforms.time.value = Date.now() - t0;
  renderer.render(scene, camera);
}

init();
render();
