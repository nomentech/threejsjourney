import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Mesh, MeshDepthMaterial, MeshLambertMaterial, MeshMatcapMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshStandardMaterial, MeshToonMaterial } from "three";
import { GUI } from "dat.gui";

const gui = new GUI();
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

const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

//Textures
const textureLoader = new THREE.TextureLoader();
const alphaTexture = textureLoader.load("textures/door/alpha.jpg");
const ambientOcclusionTexture = textureLoader.load("textures/door/ambientOcclusion.jpg");
const colorTexture = textureLoader.load("textures/door/color.jpg");
const heightTexture = textureLoader.load("textures/door/height.jpg");
const metalnessTexture = textureLoader.load("textures/door/metalness.jpg");
const normalTexture = textureLoader.load("textures/door/normal.jpg");
const roughnessTexture = textureLoader.load("textures/door/roughness.jpg");

const matcapTexture = textureLoader.load("textures/matcaps/1.png");
const gradientTexture = textureLoader.load("textures/gradients/5.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader
  .setPath("textures/environmentMaps/0/")
  .load([
    "px.jpg",
    "nx.jpg",
    "py.jpg",
    "ny.jpg",
    "pz.jpg",
    "nz.jpg"
  ])
// Objects
// const material = new THREE.MeshBasicMaterial();
// material.map = colorTexture;
// material.color.set(0x0000ff);
// material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = alphaTexture;
// material.side = THREE.DoubleSide;

// const material = new MeshNormalMaterial();
// material.flatShading = true;

// const material = new MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new MeshDepthMaterial();

// const material = new MeshLambertMaterial();

// const material = new MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x00ff00);

// const material = new MeshToonMaterial();
// material.gradientMap = gradientTexture;

// const material = new MeshStandardMaterial();
// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.metalness = 0.45;
// material.roughness = 0.65;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.0;
// material.normalMap = normalTexture;
// material.normalScale.set(5, 5);
// material.transparent = true;
// material.alphaMap = alphaTexture;

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = envMapTexture;

gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);
gui.add(material, "aoMapIntensity").min(0).max(10).step(0.01);
gui.add(material, "displacementScale").min(0).max(10).step(0.01);

const sphere = new Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  material
)
sphere.position.x = -1.5;

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1, 100, 100),
  material
)
plane.geometry.setAttribute(
  "uv2", 
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2) 
);

const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(0.3, 0.2, 16, 32),
  material
)
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

// Light
const ambientLight= new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(ambientLight, pointLight);

// Camera
const camera = new THREE.PerspectiveCamera(75, size.width/size.height, 0.1, 100);
camera.position.z = 3;
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

// Animation
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  sphere.rotation.y = elapsedTime * 0.1;
  plane.rotation.y = elapsedTime * 0.1;
  torus.rotation.y = elapsedTime * 0.1;
  sphere.rotation.x = elapsedTime * 0.15;
  plane.rotation.x = elapsedTime * 0.15;
  torus.rotation.x = elapsedTime * 0.15;

  controls.update();
  
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
}

tick();