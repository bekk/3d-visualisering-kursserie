const THREE = require('three');
const fs = require('fs');
const vertexShaderCode = fs.readFileSync(__dirname + '/vertexshader.glsl', 'utf8');
const fragmentShaderCode = fs.readFileSync(__dirname + '/fragmentshader.glsl', 'utf8');

const pixelRatio = window.devicePixelRatio || 1;

const nofParticles = Math.pow(125, 2);
const animationLength = 2.5;

let timeStart, camera, renderer, scene, animationStart;

let animationInProgress = false;

const uniforms = {
    time: {value: 0.0},
    animationTime: {value: 0.0},
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
       animationInProgress = true;
       animationStart = new Date().getTime();
    }

    document.getElementsByTagName("canvas")[0].addEventListener("click", callback);
}

const animate = function() {
    requestAnimationFrame(animate);

    const now = new Date().getTime();

    uniforms.time.value = (now - timeStart) / 1000;

    let animationTime = 0.0;

    if (animationInProgress) {
        animationTime = (now - animationStart) / 1000 / animationLength;
        
        if (animationTime > 1) {
            animationInProgress = false;
            animationTime = 1;
        }
    }

    uniforms.animationTime.value = animationTime;

    renderer.render(scene, camera);
}

initAnimation();
animate();