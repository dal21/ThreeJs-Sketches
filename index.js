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

// Create star canvas and texture
const starCanvas = createStarCanvas(2048, 1024);
const starTexture = new THREE.CanvasTexture(starCanvas);
starTexture.mapping = THREE.EquirectangularReflectionMapping;
scene.background = starTexture;
scene.environment = starTexture;

function createStarCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    // Fill the background with black
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    // Draw stars
    const starCount = 300;
    for (let i = 0; i < starCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 0.5;
        const brightness = Math.random();
        context.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2, true);
        context.fill();
    }

    return canvas;
}

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
let mixer1; // First mixer
loader.load('./FMAR_TV_TEST_10.gltf', function (gltf) {
    gltf.scene.scale.multiplyScalar(10 / 1);
    gltf.scene.position.x = 0;
    gltf.scene.position.z = 0;
    scene.add(gltf.scene);
 // Animation mixer to handle animations
 const mixer = new THREE.AnimationMixer(gltf.scene);
    
   // Animation mixer to handle animations
   mixer1 = new THREE.AnimationMixer(gltf.scene);
    
   // Play all animations
   gltf.animations.forEach((clip) => {
       mixer1.clipAction(clip).play();
   });
});


renderer.shadowMap.enabled = true;
scene.traverse((node) => {
    if (node.isMesh) {
        node.receiveShadow = true;
    }
});

// Load the GLTF model
const loader6 = new GLTFLoader();
let mixer2; // Second mixer
loader6.load('./Vase.gltf', function (gltf) {
    gltf.scene.scale.multiplyScalar(3 / 1);
    gltf.scene.position.set(-0.5, 0, 0.5);  // Set initial position
    scene.add(gltf.scene);
     // Animation mixer to handle animations
     mixer2 = new THREE.AnimationMixer(gltf.scene);
    
     // Play animation by name
     const clip = THREE.AnimationClip.findByName(gltf.animations, 'Animation');
     if (clip) {
         mixer2.clipAction(clip).play();
     }
 });
 

renderer.shadowMap.enabled = true;
scene.traverse((node) => {
    if (node.isMesh) {
        node.receiveShadow = true;
    }
});    



// Texture animation setup for the second plane
const manager2 = new THREE.LoadingManager();
const textureLoader2 = new THREE.TextureLoader(manager2);
const textures2 = [];
const numImages2 = 35;

for (let i = 0; i < numImages2; i++) {
    textures2.push(textureLoader2.load(`./PaperSpin_${i}.png`));
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
const clock = new THREE.Clock();

manager2.onLoad = function() {
    console.log('All textures loaded');

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        // Update instance positions, lights, and light spheres
        for (let i = 0; i < count2; i++) {
            const { x, y, z } = positions[i];
            const bobbing = Math.sin(elapsedTime * 2 + i) * 0.1;

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




        // Add noise distortion to the spotlight's intensity
        spotLight.intensity = intensity + (Math.random() - 0.5) * 0.5;

        // Slow down position jitter
        const jitterAmount = 0.0005;
        spotLight.position.x += (Math.random() - 0.5) * jitterAmount;
        spotLight.position.y += (Math.random() - 0.5) * jitterAmount;
        spotLight.position.z += (Math.random() - 0.5) * jitterAmount;

        // Update the animation frame for textures2
        const now = Date.now();
        const elapsedTimeFrame = now - lastFrameTime;

        if (elapsedTimeFrame >= frameDuration) {
            lastFrameTime = now;

            if (currentFrame2 < numImages2) {
                animationMaterial2.map = textures2[currentFrame2];
                animationMaterial2.emissiveMap = textures2[currentFrame2];
                animationMaterial2.needsUpdate = true;
                currentFrame2++;
            } else if (delayCounter2 > 0) {
                delayCounter2--;
            } else {
                currentFrame2 = 0;
                delayCounter2 = delayDuration;
            }
        }

        // Update models on the curve
        models.forEach((model, index) => {
            const totalAnimationTime = 10;
            const progress = (elapsedTime + index * (totalAnimationTime / instanceCount)) % totalAnimationTime;
            const normalizedProgress = progress / totalAnimationTime;
            const point = curve3.getPoint(normalizedProgress);
            model.position.copy(point);

            // Smooth rotation or any other effect
            model.rotation.y += 0.01;
        });

        // Update the first mixer if it exists
        if (mixer1) {
            mixer1.update(delta);
        }

        // Update the second mixer if it exists
        if (mixer2) {
            mixer2.update(delta);
        }

        // Update controls
        controls.update();

        // Render the scene
        renderer.render(scene, camera);}

    animate();

};

// Log the scene and camera to verify they are set up correctly
console.log('Scene:', scene);
console.log('Camera:', camera);