const THREE = require('three');
const fs = require('fs');
const vertexShaderCode = fs.readFileSync(__dirname + '/vertexshader.glsl', 'utf8');
const fragmentShaderCode = fs.readFileSync(__dirname + '/fragmentshader.glsl', 'utf8');
const util = require('./util.js');

let camera, renderer, scene;

const uniforms = {

};

function initAnimation() {
    addKeyListeners();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xA0D9FE);
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    const ratio = renderer.getContext().drawingBufferWidth / renderer.getContext().drawingBufferHeight;

    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(50, ratio, 0.1, 1000000);

    document.body.appendChild(renderer.domElement);
}

function moveCamera() {

}

function animate() {
    requestAnimationFrame(animate);

    moveCamera();

    renderer.render(scene, camera);
}

function addKeyListeners() {

}

initAnimation();
animate();