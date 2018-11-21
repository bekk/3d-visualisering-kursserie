const THREE = require('three');
const fs = require('fs');
const vertexShaderCode = fs.readFileSync(__dirname + '/vertexshader.glsl', 'utf8');
const fragmentShaderCode = fs.readFileSync(__dirname + '/fragmentshader.glsl', 'utf8');
const util = require('./util.js');

let camera, renderer, scene, cameraContainer, img, ctx, canvas;

const keyPressed = {left: 0, right: 0, up: 0, down: 0};

const uniforms = {
    textureMap: {type: "t", value: THREE.ImageUtils.loadTexture('flightsimulator/img/texture.png')},
    heightMap: {type: "t", value: THREE.ImageUtils.loadTexture('flightsimulator/img/heightmap.png')},
};

function initAnimation() {
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xA0D9FE);
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    const ratio = renderer.getContext().drawingBufferWidth / renderer.getContext().drawingBufferHeight;

    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(50, ratio, 0.1, 1000000);
    cameraContainer = new THREE.Group();
    cameraContainer.position.set(0, 3000, 15000);
    cameraContainer.add(camera);
    scene.add(cameraContainer);

    document.body.appendChild(renderer.domElement);

    const mapScale = 43000;

    const geometry = new THREE.PlaneBufferGeometry(1.251*mapScale, 0.901*mapScale, 512, 512);
    geometry.rotateX(-Math.PI/2)

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShaderCode,
        fragmentShader: fragmentShaderCode,
        transparent: true,
    });

    const plane = new THREE.Mesh(geometry, material);

    scene.add(plane);

    for (let i = 0; i < 20; i++) { 
        const cloud = makeCloud();

        cloud.position.set(
            util.random(-20000, 20000), 
            util.random(4000, 5000), 
            util.random(-20000, 20000)
        );

        cloud.scale.multiplyScalar(util.random(20, 30));

        scene.add(cloud);
    }

    util.addKeyListeners(keyPressed);
}

function makeCloud() {
    const cloud = new THREE.Group();
    
    for (let i = 0; i < 5; i++) {
        const puff = new THREE.Mesh(
            new THREE.SphereGeometry(50, 40, 20),
            new THREE.MeshBasicMaterial()
        );

        puff.scale.y = 0.25;

        puff.position.set(Math.random()*80, Math.random()*20, Math.random()*80);

        cloud.add(puff);
    }

    return cloud;
}

function initHeightMapPixels() {
    canvas = document.createElement("canvas");
    img = new Image();
    img.src = "flightsimulator/img/heightmap.png";

    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
}

function sampleHeightMap(x, y) {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(x, y, 1, 1).data
}

function moveCamera() {
    const moveSpeed = 15;
    const rotateSpeed = 0.01;

    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    cameraContainer.position.add(direction.multiplyScalar(moveSpeed));

    cameraContainer.rotation.y += keyPressed.left * rotateSpeed;
    cameraContainer.rotation.y -= keyPressed.right * rotateSpeed;

    camera.rotation.x += keyPressed.down * rotateSpeed;
    camera.rotation.x -= keyPressed.up * rotateSpeed;
}

function animate() {
    requestAnimationFrame(animate);

    moveCamera();

    console.log(sampleHeightMap(430, 480));

    renderer.render(scene, camera);
}

initAnimation();
initHeightMapPixels();
animate();