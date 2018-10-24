const THREE = require('three');
const fs = require('fs');
const util = require('./util.js');

let camera, renderer, scene, car, ground, hasWon, hasLost, gravity = 0;
const pointHelpers = [];

const keyPressed = {};

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

    util.addKeyListeners(keyPressed);

    ground = makeGround();
    scene.add(ground);

    car = makeCar();
    scene.add(car);

    const points = makePoints()
    scene.add(points)

    makePointHelpers(points);

    const light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(-1, 2.5, -2).normalize();
    scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-2, 1, 1).normalize();
    scene.add(light2);
}

function makeCar() {
    const car = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 4), 
        new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0x202020})
    )

    const wheelGeometry = new THREE.CylinderGeometry(1, 1, 1, 20);
    wheelGeometry.rotateZ(Math.PI/2);

    for (let x = -1; x <= 1; x+=2) {
        for (let y = -1; y <= 1; y+=2) {
            const wheel = new THREE.Mesh(
                wheelGeometry, 
                new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0x202020})
            );

            wheel.position.set(x*1.5, 1, y * 1.5);

            car.add(wheel);
        }
    }

    body.position.y = 1.5;

    car.add(body);

    return car;
}

function makeGround() {
    const ground = new THREE.Group();

    for (let x = -2; x <= 2; x++) {
        for (let y = -2; y <= 2; y++) {
            const tile = new THREE.Mesh(
                new THREE.BoxGeometry(20-0.1, 1, 20-0.1), 
                new THREE.MeshLambertMaterial({color: 0x1dd11d, emissive: 0x202020})
            );

            tile.position.set(x * 20, -1/2, y * 20);

            ground.add(tile);
        }
    }

    return ground;
}

function makePoints() {
    const points = new THREE.Group();

    for (let x = 0; x < 5; x++) {
        const point = new THREE.Mesh(
            new THREE.SphereGeometry(1, 16, 32), 
            new THREE.MeshLambertMaterial({color: 0xd11d1d, emissive: 0x202020})
        );

        point.position.set(util.random(-2*20, 2*20), 1/2, util.random(-2*20, 2*20));

        points.add(point)
    }

    return points;
}

function makePointHelpers(points) {
    for (const point of points.children) {
        pointHelpers.push({
            bbox: new THREE.Box3().setFromObject(point),
            mesh: point
        })   
    }
}

function moveCar() {
    const direction = new THREE.Vector3();
    car.getWorldDirection(direction);

    const speed = 0.4;
    const rotationSpeed = 0.04;

    if (keyPressed.up) {
        car.position.add(direction.multiplyScalar(speed));
    }

    if (keyPressed.left) {
        car.rotation.y += rotationSpeed;
    }

    if (keyPressed.right) {
        car.rotation.y -= rotationSpeed;
    }

    car.position.y -= gravity;
}

function moveCamera() {
    const carOffset = new THREE.Vector3(car.position.x, 0, car.position.z);
    const cameraTarget = initialCameraPosition.clone().add(carOffset);
    const cameraDiff = cameraTarget.clone().sub(camera.position);

    const dampingFactor = 0.1;

    camera.position.add(cameraDiff.multiplyScalar(dampingFactor))
}

function checkIntersections() {
    var carBBox = new THREE.Box3().setFromObject(car);

    let pointsTaken = 0;

    for (const pointHelper of pointHelpers) {
        if (!pointHelper.mesh.visible) {
            pointsTaken++;
            continue;
        }

        if (pointHelper.bbox.intersectsBox(carBBox)) {
            console.log("POINT");
            pointHelper.mesh.visible = false;
        }
    }

    if (pointsTaken == pointHelpers.length && !hasWon) {
        console.log("GAME WON")
        hasWon = true;
    }

    var groundBBox = new THREE.Box3().setFromObject(ground);
    
    if (!carBBox.intersectsBox(groundBBox)) {
        gravity = 1;
    } else {
        gravity = 0;
    }

    if (car.position.y < -10 && !hasLost) {
        console.log("GAME LOST");

        hasLost = true;
    }
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