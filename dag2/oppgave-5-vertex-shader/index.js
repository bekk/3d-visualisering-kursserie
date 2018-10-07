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

let sphere, displacement, noise;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let params = {
  noiseClamp: 5,
  circleRadius: 10,
  circleSegments: 128,
  circleRings: 64
};

function init() {
  scene = new THREE.Scene();

  initCamera();
  initRenderer();
  initSphere();
  initDatGui();

  document.body.appendChild(renderer.domElement);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.01, 1000);
  camera.position.set(0, 0, 50);
  camera.lookAt(scene.position);

  new OrbitControls(camera);
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
}

function initSphere() {
  let geometry = new THREE.SphereBufferGeometry(
    params.circleRadius,
    params.circleSegments,
    params.circleRings
  );

  displacement = new Float32Array(geometry.attributes.position.count);
  noise = new Float32Array(geometry.attributes.position.count);
  for (var i = 0; i < displacement.length; i++) {
    noise[i] = Math.random() * params.noiseClamp;
  }

  geometry.addAttribute(
    "displacement",
    new THREE.BufferAttribute(displacement, 1)
  );

  let material = new THREE.ShaderMaterial({
    vertexShader: vertexShaderCode,
    fragmentShader: fragmentShaderCode
  });

  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
}

function initDatGui() {
  var gui = new dat.GUI();

  gui.add(params, "noiseClamp", 0.0, 5.0, 0.25).onChange(updateParameters);
  gui.add(params, "circleRadius", 1.0, 50.0, 1.0).onChange(updateParameters);
  gui.add(params, "circleSegments", 3, 256, 1).onChange(updateParameters);
  gui.add(params, "circleRings", 2, 128).onChange(updateParameters);
}

function updateParameters() {
  scene.remove(sphere);
  initSphere();
}

function updateDisplacement() {
  let time = Date.now() * 0.01; // time in s;
  for (var i = 0; i < displacement.length; i++) {
    displacement[i] = Math.sin(0.1 * i + time);

    noise[i] += 0.5 * (-0.5 + Math.random());
    noise[i] = THREE.Math.clamp(
      noise[i],
      -params.noiseClamp,
      params.noiseClamp
    );

    displacement[i] += noise[i];
  }
  sphere.geometry.attributes.displacement.needsUpdate = true;
}

function render() {
  requestAnimationFrame(render);

  updateDisplacement();
  renderer.render(scene, camera);
}

init();
render();
