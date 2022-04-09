import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

// Texture
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("textures/particles/2.png");

// Geometry
const particleGeometry = new THREE.BufferGeometry();
const count = 20000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i=0; i<count*3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3),
);

particleGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colors, 3),
)

// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  // color: 0xff88cc,
  transparent: true,
  alphaMap: particleTexture,
  // alphaTest: 0.001
  // depthTest: false
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true
});

// Mesh
const particles = new THREE.Points(particleGeometry, particlesMaterial);
scene.add(particles);

// Light

// Camera
const camera = new THREE.PerspectiveCamera(75, size.width/size.height, 0.1, 100);
camera.position.set(0, 0, 2);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Animation
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  particles.rotation.y = elapsedTime * 0.2;
  // for (let i=0; i<count; i++) {
  //   const i3 = i*3;
  //   const x = particleGeometry.attributes.position.array[i3];
  //   particleGeometry.attributes.position.array[i3+1] = Math.sin(elapsedTime+x);
  // }
  // particleGeometry.attributes.position.needsUpdate = true;

  controls.update();
  
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
}

tick();