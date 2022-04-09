import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PCFSoftShadowMap } from "three";

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

// Canvas and Scene
const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0x262837);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

// Helper
const axesHelper= new THREE.AxesHelper(15);
axesHelper.visible = false;
scene.add(axesHelper);

// Texture
const textureLoader = new THREE.TextureLoader();

const doorAlphaTexture = textureLoader.load("textures/door/alpha.jpg");
const doorAmbientTexture = textureLoader.load("textures/door/ambientOcclusion.jpg");
const doorColorTexture = textureLoader.load("textures/door/color.jpg");
const doorHeightTexture = textureLoader.load("textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("textures/door/metalness.jpg");
const doorNormalTexture = textureLoader.load("textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("textures/door/roughness.jpg");

const brickAmbientTexture = textureLoader.load("textures/bricks/ambientOcclusion.jpg");
const brickColorTexture = textureLoader.load("textures/bricks/color.jpg");
const brickNormalTexture = textureLoader.load("textures/bricks/normal.jpg");
const brickRoughnessTexture = textureLoader.load("textures/bricks/roughness.jpg");

const grassAmbientTexture = textureLoader.load("textures/grass/ambientOcclusion.jpg");
const grassColorTexture = textureLoader.load("textures/grass/color.jpg");
const grassNormalTexture = textureLoader.load("textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load("textures/grass/roughness.jpg");
grassAmbientTexture.repeat.set(8, 8);
grassColorTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);
grassAmbientTexture.wrapS = THREE.RepeatWrapping;
grassAmbientTexture.wrapT = THREE.RepeatWrapping;
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
// Floor Mesh
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientTexture,
    normalMap: grassNormalTexture,
    roughness: grassRoughnessTexture
  })
)
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.rotation.x = -Math.PI * 0.5;
floor.receiveShadow = true;
scene.add(floor);

// House Mesh
const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: brickColorTexture,
    aoMap: brickAmbientTexture,
    normalMap: brickNormalTexture,
    roughness: brickRoughnessTexture
  })
)
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 2.5/2;
walls.castShadow = true;
house.add(walls);

const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({
    color: 0xb35f45
  })
)
roof.position.y = 2.5+1/2;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture
  })
)
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.set(0, 2.2/2, 2+0.01);
house.add(door);

const bushMaterial = new THREE.MeshStandardMaterial({
  color: 0x89c854
})
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bush1 = new THREE.Mesh(
  bushGeometry,
  bushMaterial
)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(
  bushGeometry,
  bushMaterial
)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(
  bushGeometry,
  bushMaterial
)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(
  bushGeometry,
  bushMaterial
)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6);

bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;
house.add(bush1, bush2, bush3, bush4);

// Graves Mesh
const graves = new THREE.Group();
scene.add(graves);
const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  color: 0xb2b6b1
});
for (let i=0; i<50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.8/2-0.1, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.castShadow = true;
  graves.add(grave);
}

// Ghosts
const ghost1 = new THREE.PointLight(0xff00ff, 2, 3);
ghost1.castShadow = true;
ghost1.shadow.mapSize.set(256, 256);
ghost1.shadow.camera.far = 7;
const ghost2 = new THREE.PointLight(0x00ffff, 2, 3);
ghost2.castShadow = true;
ghost2.shadow.mapSize.set(256, 256);
ghost2.shadow.camera.far = 7;
const ghost3 = new THREE.PointLight(0xffff00, 2, 3);
ghost3.castShadow = true;
ghost3.shadow.mapSize.set(256, 256);
ghost3.shadow.camera.far = 7;
scene.add(ghost1, ghost2, ghost3);

// Light
const ambientLight= new THREE.AmbientLight(0xb9d5ff, 0.2);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.2);
moonLight.position.set(4, 5, -2);
moonLight.castShadow = true;
scene.add(moonLight);

const doorLight = new THREE.PointLight(0xff7d46, 1.7)
doorLight.position.set(0, 2.2, 2.7);
doorLight.castShadow = true;
scene.add(doorLight);

// Fog
const fog = new THREE.Fog(0x262837, 5, 15);
scene.fog = fog;

// Camera
const camera = new THREE.PerspectiveCamera(75, size.width/size.height, 0.1, 100);
camera.position.set(5, 8, 10);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Animation
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(elapsedTime * 3);

  const ghost2Angle = elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = elapsedTime * 0.18;
  ghost3.position.x = Math.cos(ghost3Angle) * (7+ Math.sin(elapsedTime * 0.32));
  ghost3.position.y = Math.sin(ghost3Angle) * (7+ Math.sin(elapsedTime * 0.5));
  ghost3.position.z = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2);

  controls.update();
  
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
}

tick();