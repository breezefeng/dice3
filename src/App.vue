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
world.gravity.set(0, -9.82, 0);

// 世界里面的地板
const floorShape = new CANNON.Plane();
// 材质
const floorMaterail = new CANNON.Material('floor');
const floorBody = new CANNON.Body();
// 质量为0，保持物体不动
floorBody.mass = 0;
floorBody.addShape(floorShape);
floorBody.material = floorMaterail;
floorBody.position.set(0, -3, 0);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(floorBody);

// 加载模型
const diceArr = [];
const gltfLoader = new GLTFLoader();
// 骰子的材质
const diceMaterial = new CANNON.Material('cube');
gltfLoader.load('/dice.glb', gltf => {
  gltf.scene.position.set(0, -2.4, 0);
  gltf.scene.rotation.x = Math.PI;

  for (let i = 0; i < diceNum.value; i++) {
    const dice = gltf.scene.clone();
    dice.position.x = (i - 2) * 1.6
    scene.add(dice);
    // 世界里的骰子
    const diceShape = new CANNON.Box(new CANNON.Vec3(0.59, 0.59, 0.59));
    const diceBody = new CANNON.Body({
      shape: diceShape,
      material: diceMaterial,
      position: new CANNON.Vec3((i - 2) * 1.6, -2.4, 0),
      mass: 1
    });
    diceBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI);
    world.addBody(diceBody);
    diceArr.push({ dice, body: diceBody });
  }
});

// 材质混合，设置两种材质的碰撞参数
const defaultContactMaterial = new CANNON.ContactMaterial(diceMaterial, floorMaterail, {
  // 摩擦力
  friction: 0.1,
  // 弹性
  restitution: 0.7
});

// 将材料的关联设置添加到物理世界
world.addContactMaterial(defaultContactMaterial);
// 设置默认材质
world.defaultContactMaterial = defaultContactMaterial;

const clock = new THREE.Clock();

// render函数
const render = () => {
  const delta = clock.getDelta();
  world.step(delta);
  //更新渲染引擎中的物体
  diceArr.forEach(item => {
    //下落
    item.dice.position.copy(item.body.position);
    //翻滚
    item.dice.quaternion.copy(item.body.quaternion);
  });
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(render);
};

render();

document.addEventListener('click', () => {
  console.log(diceArr);
  diceArr.forEach(({ body }) => {
    body.applyLocalForce(new CANNON.Vec3(0, 0, 60), new CANNON.Vec3(5, 5, 5));
  });
});
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
