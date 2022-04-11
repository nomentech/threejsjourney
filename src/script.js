import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CANNON from "cannon";

const size = {
  width: innerWidth,
  height: innerHeight
}

addEventListener("resize", () => {
  size.width = innerWidth;
  size.height = innerHeight;

  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
})

// dat.gui
const gui = new dat.GUI();
const parameters = {};
parameters.createSphere = () => {
  createSphere(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3
  })
}
parameters.createBox = () => {
  createBox(
    Math.random(), 
    Math.random(),
    Math.random(),
    {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3
    }
  )
}
parameters.reset = () => {
  for (const object of objectsToUpdate) {
    object.body.removeEventListener("collide", playHitSound);
    world.removeBody(object.body);
    scene.remove(object.mesh);
  }
}
gui.add(parameters, "createSphere");
gui.add(parameters, "createBox");
gui.add(parameters, "reset");

// Play sounds
const hitSound = new Audio("sounds/hit.mp3");
const playHitSound = (collision) => {
  if (collision.contact.getImpactVelocityAlongNormal() > 1.5) {
    hitSound.volume =  Math.random();
    hitSound.currentTime = 0;
    hitSound.play();
  }
}

// Physics
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

const defaultMaterial = new CANNON.Material("default");

const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7
  }
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0,
  shape: floorShape,
});
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0), 
  Math.PI*0.5
);
world.addBody(floorBody);

// Canvas and Scene
const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Texture
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  "textures/environmentMaps/4/px.png",
  "textures/environmentMaps/4/nx.png",
  "textures/environmentMaps/4/py.png",
  "textures/environmentMaps/4/ny.png",
  "textures/environmentMaps/4/pz.png",
  "textures/environmentMaps/4/nz.png",
])

// Floor Mesh
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: 0x777777,
    metalness: 0.3,
    roughness: 0.4,
    envMap: envMapTexture,
    envMapIntensity: 0.5
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
cameraHelper.visible = false;
scene.add(cameraHelper);

// Camera
const camera = new THREE.PerspectiveCamera(75, size.width/size.height, 0.1, 100);
camera.position.set(-3, 3, 3);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Create Objects
const objectsToUpdate = [];
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: envMapTexture,
  envMapIntensity: 0.5
});
const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: envMapTexture,
  envMapIntensity: 0.5
});
const createSphere = (radius, position) => {
  // Mesh
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius)
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon.js
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
  })
  body.position.copy(position);
  body.addEventListener("collide", playHitSound);
  world.addBody(body);

  objectsToUpdate.push({
    mesh,
    body,
  })
}

const createBox = (width, height, depth, position) => {
  // Mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth)
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon.js
  const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2));
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
  })
  body.position.copy(position);
  body.addEventListener("collide", playHitSound);
  world.addBody(body);

  objectsToUpdate.push({
    mesh,
    body,
  })
}

createSphere(0.5, {x: 0, y: 3, z: 0});
createBox(1, 1, 1, {x: 2, y: 3, z: 0 });

// Animation
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update physics world
  // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);

  world.step(1/60, deltaTime, 3);

  // Update three.js
  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }
  
  // Controls
  controls.update();

  renderer.render(scene, camera);

  requestAnimationFrame(tick);
}

tick();