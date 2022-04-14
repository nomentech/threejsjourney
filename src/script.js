import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";

const gui = new dat.GUI({ closed: true });

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
  canvas: canvas,
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

// Texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("textures/flag-tw.jpg");

// Geometry
const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);
const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);
for(let i=0; i<count; i++) {
  randoms[i] = Math.random();
}
geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

// Material 
const material = new THREE.RawShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("orange") },
    uTexture: { value: texture}
  }
})
gui.add(material.uniforms.uFrequency.value, "x").min(0).max(20).step(0.01).name("frequencyX");
gui.add(material.uniforms.uFrequency.value, "y").min(0).max(20).step(0.01).name("frequencyY");

// Mesh
const mesh = new THREE.Mesh(
  geometry,
  material
)
mesh.scale.y = 2/3;
scene.add(mesh);

// Light

// Camera
const camera = new THREE.PerspectiveCamera(75, size.width/size.height, 0.1, 100);
camera.position.set(0.5, -1, 2);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Animation
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  material.uniforms.uTime.value = elapsedTime;

  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
}

tick();