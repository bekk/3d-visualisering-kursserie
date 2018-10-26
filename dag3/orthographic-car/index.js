const THREE = require('three');
const fs = require('fs');
const util = require('./util.js');

let camera, renderer, scene, car, collisionObstacle, ground, points, obstacles, hasWon, hasLost, gravity = 0;
const collisionHelpers = [];
let pointsTaken = 0;

const keyPressed = {};

const initialCameraPosition = new THREE.Vector3(-100, 100, -100);

function initAnimation() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0xA0D9FE);
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

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

    obstacles = makeObstacles();
    scene.add(obstacles);

    car = makeCar();
    scene.add(car);

    points = makePoints()
    scene.add(points)

    makeCollisionHelpers();

    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(-1, 2.5, -2);
    scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.2);
    light2.position.set(0, 1, 1);
    scene.add(light2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const shadowLight = new THREE.DirectionalLight(0x0, 0.0);
    shadowLight.position.set(0, 20, 0)
    shadowLight.castShadow = true;
    scene.add(shadowLight);

    shadowLight.shadow.camera.right    =  50;
    shadowLight.shadow.camera.left     = -50;
    shadowLight.shadow.camera.top      =  50;
    shadowLight.shadow.camera.bottom   = -50;
}

function makeCar() {
    const car = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 4), 
        new THREE.MeshLambertMaterial({color: 0xd1d1d1})
    )

    const wheelGeometry = new THREE.CylinderGeometry(1, 1, 1, 8);
    wheelGeometry.rotateZ(Math.PI/2);
    wheelGeometry.computeFlatVertexNormals();

    const wheels = [];

    for (let x = -1; x <= 1; x+=2) {
        for (let y = -1; y <= 1; y+=2) {
            const wheel = new THREE.Mesh(
                wheelGeometry, 
                new THREE.MeshLambertMaterial({color: 0xd1d1d1, flatShading: true})
            );

            wheel.position.set(x*1.5, 1, y * 1.5);
            wheel.castShadow = true;
            car.add(wheel);
            wheels.push(wheel);
        }
    }

    body.position.y = 1.5;
    body.castShadow = true;

    car.add(body);

    car.castShadow = true;
    car.wheels = wheels;

    return car;
}

function makeGround() {
    const ground = new THREE.Group();

    for (let x = -2; x <= 2; x++) {
        for (let y = -2; y <= 2; y++) {
            const tile = new THREE.Mesh(
                new THREE.BoxGeometry(20-0.1, 1, 20-0.1), 
                new THREE.MeshLambertMaterial({color: 0x808080})
            );

            tile.position.set(x * 20, -1/2, y * 20);
            tile.receiveShadow = true;
            ground.add(tile);
        }
    }


    return ground;
}

function makePoints() {
    const points = new THREE.Group();

    const pointGeometry = new THREE.SphereGeometry(1, 16, 32);
    const pointMaterial = new THREE.MeshLambertMaterial({color: 0xd11d1d});

    for (let x = 0; x < 5; x++) {
        const point = new THREE.Mesh(
            pointGeometry, 
            pointMaterial
        );

        point.position.set(util.random(-2*20, 2*20), 1/2 + 1, util.random(-2*20, 2*20));
        point.castShadow = true;
        points.add(point)
    }


    return points;
}

function makeObstacles() {
    const obstacles = new THREE.Group();

    const obstacleGeometry = new THREE.ConeGeometry(5, 10, 4);
    obstacleGeometry.computeFlatVertexNormals();
    obstacleGeometry.rotateY(Math.PI/4);

    const obstacleMaterial = new THREE.MeshLambertMaterial({color: 0x3060c0});

    for (let x = 0; x < 5; x++) {
        const obstacle = new THREE.Mesh(
            obstacleGeometry, 
            obstacleMaterial
        );

        obstacle.position.set(util.random(-2*20, 2*20), 1/2 + 1, util.random(-2*20, 2*20));
        obstacles.add(obstacle)
    }


    return obstacles;
}

function makeCollisionHelpers() {
    for (const point of points.children) {
        collisionHelpers.push({
            bbox: new THREE.Box3().setFromObject(point),
            mesh: point,
            type: "point"
        })   
    }

    for (const obstacle of obstacles.children) {
        collisionHelpers.push({
            bbox: new THREE.Box3().setFromObject(obstacle),
            mesh: obstacle,
            type: "obstacle"
        })   
    }
}

function moveCar() {
    const direction = new THREE.Vector3();
    car.getWorldDirection(direction);

    const speed = 0.5;
    const rotationSpeed = 0.05;

    if (collisionObstacle) {
        const obstaclePosition = new THREE.Vector3();
        collisionObstacle.getWorldPosition(obstaclePosition)
        const diff = obstaclePosition.sub(car.position);
        diff.y = 0;
        
        const collisionForce = -0.1;

        car.position.add(diff.multiplyScalar(collisionForce));
    }

    if (keyPressed.up) {
        car.position.add(direction.multiplyScalar(speed));

        for (const wheel of car.wheels) {
            wheel.rotation.x += 0.2;
        }
    }

    if (keyPressed.down) {
        car.position.sub(direction.multiplyScalar(speed));

        for (const wheel of car.wheels) {
            wheel.rotation.x -= 0.2;
        }
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
    carBBox.min.y = 0;

    collisionObstacle = false;

    for (const collisionHelper of collisionHelpers) {
        if (collisionHelper.bbox.intersectsBox(carBBox)) {
            if (collisionHelper.type == "point") { 
                if (collisionHelper.mesh.visible) {
                    console.log("POINT");
                    collisionHelper.mesh.visible = false;
                    pointsTaken++;
                }
            } else if (collisionHelper.type == "obstacle") {
                collisionObstacle = collisionHelper.mesh;
            }
        }
    }

    if (pointsTaken == points.children.length && !hasWon) {
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