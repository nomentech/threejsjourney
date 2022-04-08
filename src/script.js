import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { TextureLoader } from "three";
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

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

// Texture
const textureLoader = new TextureLoader();
const matcapTexture = textureLoader.load("textures/matcaps/1.png");

// Fonts
const fontLoader = new FontLoader();
fontLoader.load(
  "fonts/helvetiker_regular.typeface.json", 
  (font) => {
    const textGeometry = new TextGeometry(
    "Hello Three.js", 
    {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 3
    });
    // textGeometry.computeBoundingBox();
    // textGeometry.translate(
    //   -(textGeometry.boundingBox.max.x - 0.02)*0.5,
    //   -(textGeometry.boundingBox.max.y - 0.02)*0.5,
    //   -(textGeometry.boundingBox.max.z - 0.03)*0.5,
    // )
    textGeometry.center();
    const material = new THREE.MeshMatcapMaterial();
    material.matcap = matcapTexture;
    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);

    const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 10, 20);
    for(let i=0; i<100; i++) {
      const donutMesh = new THREE.Mesh(donutGeometry, material);
      donutMesh.position.x = (Math.random()-0.5)*10;
      donutMesh.position.y = (Math.random()-0.5)*10;
      donutMesh.position.z = (Math.random()-0.5)*10;
      
      donutMesh.rotation.x = Math.random() * Math.PI;
      donutMesh.rotation.y = Math.random() * Math.PI;

      const scale = Math.random();
      donutMesh.scale.set(scale, scale, scale);

      scene.add(donutMesh);
    }
  }
);

// Camera
const camera = new THREE.PerspectiveCamera(75, size.width/size.height, 0.1, 100);
camera.position.z = 3;
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Animation
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
}

tick();