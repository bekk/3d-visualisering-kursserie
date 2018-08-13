const fs = require('fs');
const vertexShaderCode = fs.readFileSync(__dirname + '/vertexshader.glsl', 'utf8');
const fragmentShaderCode = fs.readFileSync(__dirname + '/fragmentshader.glsl', 'utf8');
const THREE = require('three');
const dat = require('dat.gui');

const nofParticles = 30*30*30;

let timeStart;
let camera;
let renderer;
let scene;
let phase = 0;
let transitionInProgress = false;
let transitionStart = 0.0;

const uniforms = {
    time: {value: 0.0},
    transitionTime: {value: 0.0},
    phase: {value: 0.0},
    pixelRatio: {value: window.devicePixelRatio},
    nofParticles: {value: nofParticles},
    particleSize: {value: window.screen.width/4},
};

const initAnimation = function() {

    timeStart = new Date().getTime();

    renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setClearColor(0x1D1D1D);
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    const ratio = renderer.getContext().drawingBufferWidth / renderer.getContext().drawingBufferHeight;
    
    camera = new THREE.PerspectiveCamera(60, ratio, 0.1, 10000);
    camera.position.set(-150, 50, 0)
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
    const positions = new Float32Array(nofParticles * 3);

    const geometry = new THREE.BufferGeometry();

    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

    const vertexIndecies = new Float32Array(nofParticles);
    for (let i = 0; i < vertexIndecies.length; i++) {
        vertexIndecies[i] = i;
    }

    geometry.addAttribute('vertexIndex', new THREE.BufferAttribute(vertexIndecies, 1));

    const deviance = new Float32Array(nofParticles * 4);
    for (let i = 0; i < deviance.length; i++) {
        deviance[i] = Math.random();
    }

    geometry.addAttribute('deviance', new THREE.BufferAttribute(deviance, 4));

    geometry.computeBoundingSphere();

    return geometry;
}

function initMouseEvents() {
    function callback(event) {
       transitionInProgress = !transitionInProgress;
       transitionStart = new Date().getTime();
    }

    document.getElementsByTagName("canvas")[0].addEventListener("click", callback);
}

const animate = function() {
    requestAnimationFrame(animate);

    const now = new Date().getTime();
    const animationTime = (now - timeStart) / 1000;
    let transitionTime = (now - transitionStart) / 1000;

    uniforms.time.value = animationTime;

    console.log(`animationTime: ${animationTime} transitionTime: ${uniforms.transitionTime.value} phase: ${phase}`)

    if (transitionInProgress) {
        uniforms.transitionTime.value = transitionTime;

        if (transitionTime > 1.0) {
            phase = (phase+1) % 2;
            transitionInProgress = false;
            uniforms.transitionTime.value = 0.0;
        }
    }

    uniforms.phase.value = phase;

    renderer.render(scene, camera);
}

initAnimation();
animate();