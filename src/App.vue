<script setup>
import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ref } from 'vue';
import audioFile from './assets/audio.mp3';

const audio = new Audio(audioFile);

const ASPECT = window.innerWidth / window.innerHeight;
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
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// 平面
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const plane = new THREE.Mesh(planeGeometry, new THREE.MeshStandardMaterial({ color: 0x000000 }));
// 接收阴影
plane.receiveShadow = true;
plane.position.y = -3;
plane.rotation.x = -Math.PI / 2;
plane.scale.set();
scene.add(plane);

const cameraZ = 8;
const distance = cameraZ - plane.position.z;
const vFov = camera.fov * Math.PI / 180;
const scaleY = 2 * Math.tan(vFov / 2) * distance;
const scaleX = scaleY * camera.aspect;
plane.scale.set(scaleX, scaleY, 1);

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
// 平行光
const directLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directLight);
// 聚光灯
const pointLight = new THREE.PointLight(0xffffff, 1);
scene.add(pointLight);

// 初始化物理世界
const world = new CANNON.World();
// 设置重力
world.gravity.set(0, -20, 0);
// 让没有碰撞的物品休眠，不检测，提升性能
world.allowSleep = true;

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

// 墙面
let barrier = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Box(new CANNON.Vec3(1, 10, 18))
});
barrier.position.set(-8 * ASPECT, 0, 0);
world.addBody(barrier);

let wall = new THREE.Mesh(
  new THREE.BoxGeometry(1, 10, 18),
  new THREE.MeshPhongMaterial({
    color: '#330033',
    opacity: 0,
    transparent: true,
    side: THREE.DoubleSide
  })
);
wall.quaternion.set(
  barrier.quaternion.x,
  barrier.quaternion.y,
  barrier.quaternion.z,
  barrier.quaternion.w
);
wall.position.set(
  barrier.position.x,
  barrier.position.y,
  barrier.position.z
);
scene.add(wall);

barrier = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Box(new CANNON.Vec3(1, 10, 18))
});
barrier.position.set(8 * ASPECT, 0, 0);
world.addBody(barrier);

wall = new THREE.Mesh(
  new THREE.BoxGeometry(1, 10, 18),
  new THREE.MeshPhongMaterial({
    color: "#000033",
    opacity: 0,
    transparent: true,
    side: THREE.DoubleSide
  })
);
wall.quaternion.set(
  barrier.quaternion.x,
  barrier.quaternion.y,
  barrier.quaternion.z,
  barrier.quaternion.w
);
wall.position.set(
  barrier.position.x,
  barrier.position.y,
  barrier.position.z
);
scene.add(wall);

barrier = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Box(new CANNON.Vec3(18, 10, 1))
});
barrier.position.set(0, 0, -8 * ASPECT);
world.addBody(barrier);

wall = new THREE.Mesh(
  new THREE.BoxGeometry(18, 10, 1),
  new THREE.MeshPhongMaterial({
    color: "#000033",
    opacity: 0,
    transparent: true,
    side: THREE.DoubleSide
  })
);
wall.quaternion.set(
  barrier.quaternion.x,
  barrier.quaternion.y,
  barrier.quaternion.z,
  barrier.quaternion.w
);
wall.position.set(
  barrier.position.x,
  barrier.position.y,
  barrier.position.z
);
scene.add(wall);

barrier = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Box(new CANNON.Vec3(18, 10, 1))
});
barrier.position.set(0, 0, 8 * ASPECT);
world.addBody(barrier);

wall = new THREE.Mesh(
  new THREE.BoxGeometry(18, 10, 1),
  new THREE.MeshPhongMaterial({
    color: "#000033",
    opacity: 0,
    transparent: true,
    side: THREE.DoubleSide
  })
);
wall.quaternion.set(
  barrier.quaternion.x,
  barrier.quaternion.y,
  barrier.quaternion.z,
  barrier.quaternion.w
);
wall.position.set(
  barrier.position.x,
  barrier.position.y,
  barrier.position.z
);
scene.add(wall);

barrier = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Box(new CANNON.Vec3(18, 10, 1)),

});
barrier.position.set(0, 5, 0);
barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(barrier);

wall = new THREE.Mesh(
  new THREE.BoxGeometry(20, 16, 1),
  new THREE.MeshPhongMaterial({
    color: "#003300",
    opacity: 0,
    transparent: true,
    side: THREE.DoubleSide
  })
);
wall.quaternion.set(
  barrier.quaternion.x,
  barrier.quaternion.y,
  barrier.quaternion.z,
  barrier.quaternion.w
);
wall.position.set(
  barrier.position.x,
  barrier.position.y,
  barrier.position.z
);
scene.add(wall);

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
    //碰撞事件
    diceBody.addEventListener('collide', (e) => {
      // 与地面碰撞时才有碰撞声音
      if (e.body?.material?.name === 'floor') {
        // 获取碰撞强度
        const impactStrength = e.contact.getImpactVelocityAlongNormal();
        if (impactStrength > 5) {
          console.log('碰撞强度:', impactStrength);
          // 重新从零开始播放
          audio.currentTime = 0;
          // 设置音量根据强度来
          audio.volume = (impactStrength > 1 ? 1 : impactStrength) / 10;
          // 强度大于5播放
          audio.play();
        }
      }
    });
  }
});

// 材质混合，设置两种材质的碰撞参数
const defaultContactMaterial = new CANNON.ContactMaterial(diceMaterial, floorMaterail, {
  // 摩擦力
  friction: 0.3,
  // 弹性
  restitution: 0.5
});

// 将材料的关联设置添加到物理世界
world.addContactMaterial(defaultContactMaterial);
// 设置默认材质
world.defaultContactMaterial = defaultContactMaterial;

const clock = new THREE.Clock();

// render函数
const render = () => {
  const delta = clock.getDelta();
  world.step(1 / 60, delta);
  // 更新渲染引擎中的物体
  diceArr.forEach(item => {
    // 下落
    item.dice.position.copy(item.body.position);
    // 翻滚
    item.dice.quaternion.copy(item.body.quaternion);
  });
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(render);
};

render();

document.addEventListener('click', () => {
  diceArr.forEach(({ body }) => {
    body.sleep();
    body.applyImpulse(
      new CANNON.Vec3(Math.random() * 10, 12, Math.random() * 10),
      new CANNON.Vec3(Math.random() * 10, 12, Math.random() * 10)
    );
  });
});

// 尺寸变化
window.addEventListener('resize', () => {
  // 更新摄像头比率
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像头矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器尺寸
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 更新渲染器比率
  renderer.setPixelRatio(window.devicePixelRatio);
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
