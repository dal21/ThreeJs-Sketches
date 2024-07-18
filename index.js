import * as THREE from "three";
import { OrbitControls } from './controls/OrbitControls.js';
import { GLTFLoader } from './loaders/GLTFLoader.js';
import { RGBELoader } from './loaders/RGBELoader.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
const w = window.innerWidth;
const h = window.innerHeight;
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 20;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = true;
controls.enableZoom = true;
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.2;
controls.screenSpacePanning = false;
controls.minDistance = 0.1;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI / 2;


// Load the HDRI environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('../stars_4k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularRefractionMapping;
    scene.background = texture;
    scene.environment = texture;
}, undefined, (error) => {
    console.error('Error loading HDRI:', error);
});

// Directional light (simulating sunlight)
const dirLight = new THREE.DirectionalLight(0xffFA7F08, 0.8);
dirLight.position.set(-5, 5, -5);
dirLight.castShadow = true;
scene.add(dirLight);

// Shadow configuration for the directional light
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.near = 0.01;
dirLight.shadow.camera.far = 20;
dirLight.shadow.bias = -0.001;

// New Directional Light
const dirLight2 = new THREE.DirectionalLight(0xFFE4B5, 0.3);
dirLight2.position.set(5, 0, 5);
dirLight2.castShadow = true;
scene.add(dirLight2);

// Shadow configuration for the second directional light
dirLight2.shadow.mapSize.width = 2048;
dirLight2.shadow.mapSize.height = 2048;
dirLight2.shadow.camera.top = 10;
dirLight2.shadow.camera.bottom = -10;
dirLight2.shadow.camera.left = -10;
dirLight2.shadow.camera.right = 10;
dirLight2.shadow.camera.near = 0.01;
dirLight2.shadow.camera.far = 20;
dirLight2.shadow.bias = -0.001;

// Add a SpotLight
const intensity = 5;
const decay = 2.5;
const distance = 10;
const angle = 0.9;
const penumbra = 1;
const spotLight = new THREE.SpotLight(0xff22BABB, intensity, distance, angle, penumbra);
spotLight.position.set(-0.1, -0.15, 0.15);
spotLight.castShadow = true;

const target = new THREE.Object3D();
target.position.set(0.1, -2, 2);
scene.add(target);

spotLight.target = target;

// Optional: Set shadow properties
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
spotLight.shadow.camera.near = 0.1;
spotLight.shadow.camera.far = 50;

scene.add(spotLight);

// Audio listener
const listener = new THREE.AudioListener();
camera.add(listener);

// Create a video element
const video = document.createElement('video');
video.src = './Field Music - Orion From The Street (Official Video).mp4';
video.muted = false;
video.play();

 // Flag to check if the video has started
 var videoStarted = false;

 // Function to start video
 function startVideo() {
     if (!videoStarted) {
         video.play().then(() => {
             videoStarted = true;
             console.log('Video started');

        video.loop = true;
         }).catch((error) => {
             console.error('Error trying to play video:', error);
         });
     }
 }

 // Listen for control events to start the video
 controls.addEventListener('start', startVideo);

// Create a video texture
const videoTexture = new THREE.VideoTexture(video);

// Create a plane geometry for the video
const videoGeometry = new THREE.PlaneGeometry(0.35, 0.25);
const videoMaterial = new THREE.MeshStandardMaterial({
    map: videoTexture,
    emissive: 0xffffff,
    emissiveMap: videoTexture,
    emissiveIntensity: 1
});
const videoPlane = new THREE.Mesh(videoGeometry, videoMaterial);
videoPlane.position.set(-0.165, -0.130, 0.0445);
videoPlane.rotation.set(0, 0.2000, 0);
scene.add(videoPlane);

// Load the GLTF model
const loader = new GLTFLoader();
loader.load('../FMAR_TV_TEST_10.gltf', function (gltf) {
    gltf.scene.scale.multiplyScalar(10 / 1);
    gltf.scene.position.x = 0;
    gltf.scene.position.z = 0;
    scene.add(gltf.scene);
});

renderer.shadowMap.enabled = true;
scene.traverse((node) => {
    if (node.isMesh) {
        node.receiveShadow = true;
    }
});

// Texture animation setup for the first plane
const manager1 = new THREE.LoadingManager();
const textureLoader1 = new THREE.TextureLoader(manager1);
const textures1 = [];
const numImages1 = 88;

for (let i = 0; i < numImages1; i++) {
    textures1.push(textureLoader1.load(`../ImageSequence/Star1/Starshape/Starshape_${i}.png`));
}

const animationGeometry1 = new THREE.PlaneGeometry(1, 1);
const animationMaterial1 = new THREE.MeshStandardMaterial({
    map: textures1[0],
    transparent: true,
    emissive: 0xffffff,  // Set the emissive color to white
    emissiveMap: textures1[0],  // Use the same texture for emissive map
    emissiveIntensity: 1.5  // Adjust the intensity of the emissive effect
});
const animatedMesh1 = new THREE.Mesh(animationGeometry1, animationMaterial1);
animatedMesh1.position.set(-0.6, 0.5, 0.25);
animatedMesh1.rotation.set(0, 1.5, 0);
animatedMesh1.scale.set(0.5, 0.5, 0.5);
scene.add(animatedMesh1);

const animationGeometry5 = new THREE.PlaneGeometry(1, 1);

const animatedMesh5 = new THREE.Mesh(animationGeometry1, animationMaterial1);
animatedMesh5.position.set(0.35, -0.1, -0.1);
animatedMesh5.rotation.set(0, 0, 0);
animatedMesh5.scale.set(0.5, 0.5, 0.5);
scene.add(animatedMesh5);

// Texture animation setup for the second plane
const manager2 = new THREE.LoadingManager();
const textureLoader2 = new THREE.TextureLoader(manager2);
const textures2 = [];
const numImages2 = 146;

for (let i = 0; i < numImages2; i++) {
    textures2.push(textureLoader2.load(`../ImageSequence/Star1/PaperFolding/PaperSpin_${i}.png`));
}

const animationGeometry2 = new THREE.PlaneGeometry(1, 1);
const animationMaterial2 = new THREE.MeshStandardMaterial({
    map: textures2[0],
    transparent: true,
    emissive: 0xffffff,  // Set the emissive color to white
    emissiveMap: textures2[0],  // Use the same texture for emissive map
    emissiveIntensity: 1  // Adjust the intensity of the emissive effect
});
const animatedMesh2 = new THREE.Mesh(animationGeometry2, animationMaterial2);
animatedMesh2.position.set(-0.2, 0.26, -0.15);
animatedMesh2.rotation.set(0, 0.25, 0);
animatedMesh2.scale.set(0.5, 0.5, 0.5);
scene.add(animatedMesh2);

// Animation management for both planes
const frameRate = 12;
const frameDuration = 1000 / frameRate;
const delayDuration = 0;  // Number of frames to delay the restart of the animation
const delayDuration2 = 48;  // Number of frames to delay the restart of the animation
let lastFrameTime = Date.now();
let currentFrame1 = 0;
let currentFrame2 = 0;
let delayCounter1 = delayDuration;
let delayCounter2 = delayDuration2;


const pointLight = new THREE.PointLight(0xffffff, 1);
            pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Sphere geometry and emissive material
        const geometry3 = new THREE.SphereGeometry(0.025, 8, 8);
        const material3 = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1 });

        // Number of instances
        const count2 = 10;
        const instancedMesh = new THREE.InstancedMesh(geometry3, material3, count2);
        scene.add(instancedMesh);

        // Light representation geometry and material
        const lightGeometry = new THREE.SphereGeometry(0.01, 8, 8);
        const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        // Animation variables
        const clock = new THREE.Clock();
        const positions = [];
        const lights = [];  // Array to hold point lights
        const lightSpheres = [];  // Array to hold light representation spheres

 
// Initialize instance positions
for (let i = 0; i < count2; i++) {
    const x = (Math.random() - 0.25) * 1.3;
    const y = (Math.random() - 0.25) * 1.3;
    const z = (Math.random() - 0.25) * 0.25;
    positions.push({ x, y, z });

    // Create and position point light
    const pointLightInstance = new THREE.PointLight(0xff0000, 0.25, 0.25);
    pointLightInstance.position.set(x, y, z);
    scene.add(pointLightInstance);
    lights.push(pointLightInstance); // Add to lights array

    // Create and position light representation sphere
    const lightSphere = new THREE.Mesh(lightGeometry, lightMaterial);
    lightSphere.position.set(x, y, z);
    scene.add(lightSphere);
    lightSpheres.push(lightSphere);
}
// Translation vector
const translation = new THREE.Vector3(-0.52, -0.2, -0.55); // Adjust this vector to move the position of all spheres


// Initialize the curve for animation
const points = [
    new THREE.Vector3(0.1, -0.3, 0.8),
    new THREE.Vector3(0.2, -0.3, 0.7),
    new THREE.Vector3(0.2, -0.3, 0.6),
    new THREE.Vector3(0.1, -0.33, 0.5),
    new THREE.Vector3(0.0, -0.35, 0.4),
    new THREE.Vector3(-0.1, -0.35, 0.4),
    new THREE.Vector3(-0.2, -0.35, 0.5),
    new THREE.Vector3(-0.2, -0.33, 0.6),
    new THREE.Vector3(-0.1, -0.3, 0.7),
    new THREE.Vector3(0, -0.3, 0.8),
];

const curve3 = new THREE.CatmullRomCurve3(points, true);

const loader3 = new GLTFLoader();
const models = []; // Declare the models array
const instanceCount = 3; // Number of instances

loader3.load('./VHS.gltf', (gltf) => {
    for (let i = 0; i < instanceCount; i++) {
        const model1 = gltf.scene.clone(); // Clone the model for each instance
        model1.position.set(i * 0.5, 0, 0); // Spread out instances
        scene.add(model1);
        models.push(model1); // Add the model to the models array

    }
});

const progress = new Array(instanceCount).fill(0); // Progress for each instance


manager1.onLoad = manager2.onLoad = function() {
    console.log('All textures loaded');

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

         // Update instance positions, lights, and light spheres
         for (let i = 0; i < count2; i++) {
            const { x, y, z } = positions[i];
            const bobbing = Math.sin(time * 2 + i) * 0.1;

            const matrix = new THREE.Matrix4();
            // Apply translation vector
            matrix.setPosition(x + translation.x, y + bobbing + translation.y, z + translation.z);
            instancedMesh.setMatrixAt(i, matrix);

            // Update light position with translation
            lights[i].position.set(x + translation.x, y + bobbing + translation.y, z + translation.z);

            // Update light sphere position with translation
            lightSpheres[i].position.set(x + translation.x, y + bobbing + translation.y, z + translation.z);
        }
        instancedMesh.instanceMatrix.needsUpdate = true;


        // Update controls
        controls.update();

        // Add noise distortion to the spotlight's intensity
        spotLight.intensity = intensity + (Math.random() - 0.5) * 0.5;

        // Slow down position jitter
        const jitterAmount = 0.0005;
        spotLight.position.x += (Math.random() - 0.3) * jitterAmount;
        spotLight.position.y += (Math.random() - 0.3) * jitterAmount;
        spotLight.position.z += (Math.random() - 0.3) * jitterAmount;

        const now = Date.now();
        const elapsedTime = now - lastFrameTime;

        if (elapsedTime >= frameDuration) {
            lastFrameTime = now;

            // Update the first animation
            if (currentFrame1 < numImages1) {
                animationMaterial1.map = textures1[currentFrame1];
                animationMaterial1.emissiveMap = textures1[currentFrame1]; // Update emissiveMap as well
                animationMaterial1.needsUpdate = true;
                currentFrame1++;
            } else if (delayCounter1 > 0) {
                delayCounter1--;
            } else {
                currentFrame1 = 0;
                delayCounter1 = delayDuration;
            }

            if (currentFrame2 < numImages2) {
                animationMaterial2.map = textures2[currentFrame2];
                animationMaterial2.emissiveMap = textures2[currentFrame2]; // Update emissiveMap as well
                animationMaterial2.needsUpdate = true;
                currentFrame2++;
            
            } else if (delayCounter2 > 0) {
                delayCounter2--;
            } else {
                currentFrame2 = 0;
                delayCounter2 = delayDuration;
            }
        }


        models.forEach((model, index) => {
            const totalAnimationTime = 10;
            const progress = (time + index * (totalAnimationTime / instanceCount)) % totalAnimationTime;
            const normalizedProgress = progress / totalAnimationTime;
            const point = curve3.getPoint(normalizedProgress);
            model.position.copy(point);
    
            // Smooth rotation or any other effect
            model.rotation.y += 0.01;
    });
    
    // Render the scene
    renderer.render(scene, camera);
}

    animate();
};

// Log the scene and camera to verify they are set up correctly
console.log('Scene:', scene);
console.log('Camera:', camera);