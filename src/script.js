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

const mouse = new THREE.Vector2();
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX / size.width * 2 - 1;
  mouse.y = -(event.clientY / size.height) * 2 + 1;
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

// Geometry

// Material

// Mesh
const object1 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({
    color: 0x0000ff,
  })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({
    color: 0x0000ff,
  })
);

const object3 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({
    color: 0x0000ff,
  })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

const objects = [object1, object2, object3];

// Raycaster
const raycaster = new THREE.Raycaster()

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

  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  for (const object of objects) {
    object.material.color.set(0x0000ff);
  }

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects);
  for(const intersect of intersects) {
    intersect.object.material.color.set(0x00ff00);
  }

  controls.update();
  
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
}

tick();