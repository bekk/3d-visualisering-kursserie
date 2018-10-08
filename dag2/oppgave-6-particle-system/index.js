const THREE = require('three');
const fs = require('fs');
const vertexShaderCode = fs.readFileSync(__dirname + '/vertexshader.glsl', 'utf8');
const fragmentShaderCode = fs.readFileSync(__dirname + '/fragmentshader.glsl', 'utf8');

const pixelRatio = window.devicePixelRatio || 1;

const nofParticles = 0;

let timeStart, camera, renderer, scene;

const uniforms = {
    time: {value: 0.0},
    pixelRatio: {value: pixelRatio},
    nofParticles: {value: nofParticles}
};

const initAnimation = function() {
    timeStart = new Date().getTime();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x1D1D1D);
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    renderer.setPixelRatio(pixelRatio);

    const ratio = renderer.getContext().drawingBufferWidth / renderer.getContext().drawingBufferHeight;
    
    camera = new THREE.PerspectiveCamera(60, ratio, 0.1, 10000);
    camera.position.set(-120, 40, 0)
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();

    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
}

const animate = function() {
    requestAnimationFrame(animate);

    const now = new Date().getTime();
    uniforms.time.value = (now - timeStart) / 1000;

    renderer.render(scene, camera);
}

initAnimation();
animate();