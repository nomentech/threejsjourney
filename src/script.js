import * as THREE from "three";
import { BoxGeometry, MeshBasicMaterial } from "three";

const width = 400;
const height = 300;
const scene = new THREE.Scene();

const group = new THREE.Group();
group.position.y = -1;
group.rotation.x = 1;
group.scale.z = 2;
scene.add(group);

const cube1 = new THREE.Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshBasicMaterial({ color: 0xff0000})
)
group.add(cube1);

const cube2 = new THREE.Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshBasicMaterial({ color: 0x00ff00})
)
cube2.position.x = -2;
group.add(cube2);

const cube3 = new THREE.Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshBasicMaterial({ color: 0x0000ff})
)
cube3.position.x = 2;
group.add(cube3);

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
camera.position.z = 3;

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(width, height);

renderer.render(scene, camera);