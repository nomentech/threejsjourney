import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const cursor = {
  x: 0,
  y: 0,
}

addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / size.width - 0.5;
  cursor.y = event.clientY / size.height - 0.5;
});

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

addEventListener("dblclick", () => {
  if(!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
})

const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

const geometry = new THREE.BufferGeometry()
const count = 500;
const positionArray = new Float32Array(count*3*3);
for (let i=0; i< count*3*3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 4;
}
const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
geometry.setAttribute("position", positionAttribute);

const material = new THREE.MeshBasicMaterial({ 
  color: 0x0000ff,
  wireframe: true
})

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

const camera = new THREE.PerspectiveCamera(75, size.width/size.height, 0.1, 100);
camera.position.z = 3;
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

const tick = () => {
  controls.update();
  
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
}

tick();