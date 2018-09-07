const THREE = require('three');
const fs = require('fs');
const vertexShaderCode = fs.readFileSync(__dirname + '/vertexshader.glsl', 'utf8');
const fragmentShaderCode = fs.readFileSync(__dirname + '/fragmentshader.glsl', 'utf8');

const pixelRatio = window.devicePixelRatio || 1;

const nofParticles = Math.pow(125, 2);

let timeStart, camera, renderer, scene;

let animationStart = 0;
let animationInProgress = false;
let animationPaused = false;

const uniforms = {
    time: {value: 0.0},
    pixelRatio: {value: pixelRatio},
    nofParticles: {value: nofParticles},
    animationTime: {value: 0.0},
};

const initAnimation = function() {
    timeStart = new Date().getTime();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x1D1D1D);
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    renderer.setPixelRatio(pixelRatio);

    const ratio = renderer.getContext().drawingBufferWidth / renderer.getContext().drawingBufferHeight;
    
    camera = new THREE.PerspectiveCamera(60, ratio, 0.1, 10000);
    camera.position.set(0, 40, 120)
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();

    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShaderCode,
        fragmentShader: fragmentShaderCode,
        transparent: true
    });

    const geometry = new THREE.BufferGeometry();

    const nofParticles = Math.pow(125, 2);
    const positions = new Float32Array(nofParticles * 3);
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));


    let color = new Float32Array(nofParticles * 3);
    color = color.map(Math.random);
    geometry.addAttribute('color', new THREE.BufferAttribute(color, 3));

    let vertexIndecies = new Float32Array(nofParticles);
    vertexIndecies = vertexIndecies.map((element, i) => i);
    geometry.addAttribute('vertexIndex', new THREE.BufferAttribute(vertexIndecies, 1));

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    function callback(event) {
       animationInProgress = true;
       animationStart = new Date().getTime();
    }

    document.getElementsByTagName("canvas")[0].addEventListener("click", callback);
}

function updateAnimationTime() {
    const now = new Date().getTime();

    if (animationInProgress) {
        const animationLength = 2.5;
        const now = new Date().getTime();

        let animationTime = (now - animationStart) / 1000 / animationLength;

        if (animationTime > 1) {
            animationInProgress = false;
            animationTime = 0;
        }

        uniforms.animationTime.value = animationTime;
    } else {
        uniforms.animationTime.value = 0;
    }
}

const animate = function() {
    requestAnimationFrame(animate);

    const now = new Date().getTime();
    uniforms.time.value = (now - timeStart) / 1000;

    updateAnimationTime();
    console.log(uniforms.animationTime.value);

    renderer.render(scene, camera);
}

initAnimation();
animate();