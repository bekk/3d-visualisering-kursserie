const THREE = require('three');
const dat = require('dat.gui');
const fs = require('fs');
const vertexShaderCode = fs.readFileSync(`${__dirname}/vertexshader.glsl`, 'utf8');
const fragmentShaderCode = fs.readFileSync(`${__dirname}/fragmentshader.glsl`, 'utf8');

let scene, camera, renderer;

let star, debugStar;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const uniforms = {
  baseColor: {value: null},
  coreSize: {value: null},
  glowRange: {value: null},
  glowIntensity: {value: null},
};

const params = {
  baseColor: "#ff9500",
  coreSize: 0.1,
  glowRange: 1.4,
  glowIntensity: 0.56,
  scale: 1.0,
  enableDebug: false,
}

function init() {
  scene = new THREE.Scene();

  initStar();
  initBackdrop();
  initCamera();
  initRenderer();
  initDatGui();

  updateParameters();

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

  const debugPlane = makeDebugObject(plane);

  scene.add(plane);
  scene.add(debugPlane);

  star = plane;
  debugStar = debugPlane;
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
  scene.add(makeDebugObject(backdrop));
}

function makeDebugObject(mesh) {
  const debugObject = mesh.clone(true);
  debugObject.material = new THREE.MeshBasicMaterial({wireframe: true});
  debugObject.isDebugObject = true;
  return debugObject;
}

function updateParameters() {
  uniforms.baseColor.value = new THREE.Color(params.baseColor);
  uniforms.coreSize.value = params.coreSize;
  uniforms.glowRange.value = params.glowRange;
  uniforms.glowIntensity.value = params.glowIntensity;

  scene.traverse((child) => {
    if (child.isDebugObject) child.visible = params.enableDebug;
  });

  star.scale.set(params.scale, params.scale, params.scale);
  debugStar.scale.copy(star.scale);
}

function initDatGui() {
  var gui = new dat.GUI();

  gui.addColor(params, 'baseColor').onChange(updateParameters);
  gui.add(params, "coreSize", 0.02, 0.5).onChange(updateParameters);
  gui.add(params, "glowRange", 0.1, 5.0).onChange(updateParameters);
  gui.add(params, "glowIntensity", 0.02, 3.0).onChange(updateParameters);
  gui.add(params, "scale", 0.05, 8.0).onChange(updateParameters);
  gui.add(params, "enableDebug").onChange(updateParameters)
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

init();
render();
