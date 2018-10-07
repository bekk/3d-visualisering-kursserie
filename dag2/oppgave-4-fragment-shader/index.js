const THREE = require('three');
const dat = require('dat.gui');
const fs = require('fs');
const vertexShaderCode = fs.readFileSync(`${__dirname}/vertexshader.glsl`, 'utf8');
const fragmentShaderCode = fs.readFileSync(`${__dirname}/fragmentshader.glsl`, 'utf8');

let scene, camera, renderer;

let star;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const uniforms = {};

function init() {
  scene = new THREE.Scene();

  initStar();
  initBackdrop();
  initCamera();
  initRenderer();

  document.body.appendChild(renderer.domElement);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 0.01, 1000);
  camera.position.set(0, 0, 3.75);
  camera.lookAt(scene.position);
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
}

function initStar() {
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShaderCode,
    fragmentShader: fragmentShaderCode,
    transparent: true
  });

  const geometry = new THREE.PlaneGeometry(2, 2);

  const plane = new THREE.Mesh(
    geometry,
    material
  );

  plane.position.x = -0.6;

  scene.add(plane);

  star = plane;
}

function initBackdrop() {
  const geometry = new THREE.PlaneGeometry(205, 137);
  const material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(`${__dirname}/img/Milkyway.jpg`)
  });

  const backdrop = new THREE.Mesh(
    geometry,
    material
  );

  backdrop.position.z = -200;

  scene.add(backdrop);
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

init();
render();
