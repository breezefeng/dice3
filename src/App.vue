<script setup>
import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ref } from 'vue';

// 骰子个数，默认5个
const diceNum = ref(5);
// 初始化场景
const scene = new THREE.Scene();
// 初始化相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300);
// 设置相机位置
camera.position.set(0, 8, 0);
camera.updateProjectionMatrix();
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true,
});
// 设置渲染器大小
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//平面
const planeGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
const plane = new THREE.Mesh(planeGeometry, new THREE.MeshStandardMaterial({ color: 0x111111 }));
//接收阴影
plane.receiveShadow = true;
plane.position.y = -3;
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

//环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
//平行光
const directLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directLight);
// 聚光灯
const pointLight = new THREE.PointLight(0xffffff, 1);
scene.add(pointLight);

// 初始化物理世界
const world = new CANNON.World();
// 设置重力
world.gravity.set(0, -0.82, 0);

// 加载模型
const gltfLoader = new GLTFLoader();
gltfLoader.load('/dice.glb', gltf => {
  gltf.scene.position.set(0, -2.4, 0);
  gltf.scene.rotation.x = Math.PI;

  for (let i = 0; i < diceNum.value; i++) {
    const dice = gltf.scene.clone();
    dice.position.x = (i - 2) * 1.6
    scene.add(dice);
  }
});

const clock = new THREE.Clock();

// render函数
const render = () => {
  const delta = clock.getDelta();
  world.step(delta);

  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(render);
};

render();
</script>

<template></template>

<style>
* {
  margin: 0;
  padding: 0;
}

canvas {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}
</style>
