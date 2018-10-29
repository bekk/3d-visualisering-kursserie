const THREE = require('three');
const fs = require('fs');
const util = require('./util.js');

let camera, renderer, scene, car;

const initialCameraPosition = new THREE.Vector3(-100, 100, -100);

function initAnimation() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0xA0D9FE);
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    const ratio = renderer.getContext().drawingBufferWidth / renderer.getContext().drawingBufferHeight;

    scene = new THREE.Scene();
    
    const height = 50;
    const width = ratio*height;
    camera = new THREE.OrthographicCamera(width/-2, width/2, height/2, height/-2, 0.1, 1000);
    camera.position.copy(initialCameraPosition);
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    document.body.appendChild(renderer.domElement);

    car = makeCar();
    scene.add(car);

    const light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(-1, 2.5, -2);
    scene.add(light);
}

function makeCar() {
    const car = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 4), 
        new THREE.MeshLambertMaterial({color: 0xd1d1d1})
    )
    return car;
}

function moveCar() {
    
}

function moveCamera() {
    
}

function checkIntersections() {
    
}

function animate() {
    requestAnimationFrame(animate);

    moveCar();
    moveCamera();
    checkIntersections();

    renderer.render(scene, camera);
}

initAnimation();
animate();