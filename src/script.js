import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const gui = new dat.GUI();
const parameters = {
  color: 0xb3b3b3,
  spin: () => {
    mesh.rotation.y += 10;
  }
};

const cursor = {
  x: 0,
  y: 0,
};

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

const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshBasicMaterial({ 
  color: parameters.color,
  wireframe: false
})

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// debug
gui
  .addColor(parameters, "color")
  .onChange(() => {
    material.color.set(parameters.color);
  })

gui
  .add(mesh.position, "y")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("elavation");

gui
  .add(parameters, "spin");
  
gui
  .add(mesh, "visible");

gui
  .add(material, "wireframe");

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