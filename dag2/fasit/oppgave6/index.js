const fs = require('fs');
const vertexShaderCode = fs.readFileSync(__dirname + '/vertexshader.glsl', 'utf8');
const fragmentShaderCode = fs.readFileSync(__dirname + '/fragmentshader.glsl', 'utf8');
const THREE = require('three');
const dat = require('dat.gui');

const nofParticles = Math.pow(125, 2);
const impulseLength = 2.5;

let timeStart;
let camera;
let renderer;
let scene;
let phase = 0;
let impulseInProgress = false;
let impulseStart = 0.0;

const uniforms = {
    time: {value: 0.0},
    impulseTime: {value: 0.0},
    pixelRatio: {value: window.devicePixelRatio},
    nofParticles: {value: nofParticles},
    particleSize: {value: window.screen.width/4},
};

const initAnimation = function() {

    timeStart = new Date().getTime();

    renderer = new THREE.WebGLRenderer();
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setClearColor(0x1D1D1D);
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    const ratio = renderer.getContext().drawingBufferWidth / renderer.getContext().drawingBufferHeight;
    
    camera = new THREE.PerspectiveCamera(60, ratio, 0.1, 10000);
    camera.position.set(-120, 40, 0)
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();

    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    const geometry = makeGeometry();

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShaderCode,
        fragmentShader: fragmentShaderCode,
        transparent: true
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    initMouseEvents();
}

function makeGeometry() {
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(nofParticles * 3);
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

    let vertexIndecies = new Float32Array(nofParticles);
    vertexIndecies = vertexIndecies.map((element, i) => i);
    geometry.addAttribute('vertexIndex', new THREE.BufferAttribute(vertexIndecies, 1));

    let color = new Float32Array(nofParticles * 3);
    color = color.map(Math.random);
    geometry.addAttribute('color', new THREE.BufferAttribute(color, 3));

    return geometry;
}

function initMouseEvents() {
    function callback(event) {
       impulseInProgress = true;
       impulseStart = new Date().getTime();
    }

    document.getElementsByTagName("canvas")[0].addEventListener("click", callback);
}

const animate = function() {
    requestAnimationFrame(animate);

    const now = new Date().getTime();

    uniforms.time.value = (now - timeStart) / 1000;

    let impulseTime = 0.0;

    if (impulseInProgress) {
        impulseTime = (now - impulseStart) / 1000 / impulseLength;
        
        if (impulseTime > 1) {
            impulseInProgress = false;
            impulseTime = 1;
        }
    }

    uniforms.impulseTime.value = impulseTime;

    renderer.render(scene, camera);
}

initAnimation();
animate();