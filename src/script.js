import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const cursor = {
  x: 0,
  y: 0,
}

addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / width - 0.5;
  cursor.y = event.clientY / height - 0.5;
});

const canvas = document.querySelector(".webgl");

const width = 400;
const height = 300;
const scene = new THREE.Scene();

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff})
);
scene.add(mesh);

// const aspectRatio = width / height;
// const camera = new THREE.OrthographicCamera(-1*aspectRatio,1*aspectRatio,1,-1,0.1,100);
const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 100);
camera.position.z = 3;
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(width, height);

// const clock = new THREE.Clock();
const tick = () => {
  // const elapsedTime = clock.getElapsedTime();
  // mesh.rotation.y = elapsedTime;

  // custom controls
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
  // camera.position.y = -cursor.y * 5;
  // camera.lookAt(mesh.position);

  controls.update();
  
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
}

tick();