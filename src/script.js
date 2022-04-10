import "./style.css";
import * as THREE from "three";
import gsap from "gsap";

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

let scrollY = 0;
let section = 0;
addEventListener("scroll", () => {
  scrollY = window.scrollY;
  section = Math.round(scrollY / size.height);
  gsap.to(meshes[section].rotation, {
    duration: 1.5,
    ease: "power2.inOut",
    x: "+=6",
    y: "+=3",
    z: "+=1.5"
  })
})

let cursor = {
  x: 0,
  y: 0
}
addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / size.width - 0.5;
  cursor.y = event.clientY / size.height - 0.5;
});

// Canvas and Scene
const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

// Texture
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

// Geometry

// Material
const material = new THREE.MeshToonMaterial({
  color: 0xffeded,
  gradientMap: gradientTexture
})

// Mesh
const distance = 4;
const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  material
)

const mesh2 = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 32),
  material
)

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
)
mesh1.position.y = -distance * 0;
mesh2.position.y = -distance * 1;
mesh3.position.y = -distance * 2;
mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;
scene.add(mesh1, mesh2, mesh3);

const meshes = [mesh1, mesh2, mesh3];

// Particles
const particleCount = 200;
const positions = new Float32Array(particleCount * 3);

for(let i=0; i<particleCount; i++) {
  positions[i*3] = (Math.random() - 0.5) * 10;
  positions[i*3+1] = distance*0.5 - Math.random() * distance * meshes.length;
  positions[i*3+2] = (Math.random() - 0.5) * 10;
}
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
const particleMaterial = new THREE.PointsMaterial({
  color: 0xffeded,
  sizeAttenuation: true,
  size: 0.03
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Light
const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

// Camera
const camera = new THREE.PerspectiveCamera(35, size.width/size.height, 0.1, 100);
camera.position.set(0, 0, 6);

// Animation
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  
  // Animate Meshes
  for (const mesh of meshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  // Animate Camera
  camera.position.x += (cursor.x - camera.position.x) * 5 * deltaTime; // with ease effect
  camera.position.y = -scrollY / size.height * distance;

  renderer.render(scene, camera);

  requestAnimationFrame(tick);
}

tick();