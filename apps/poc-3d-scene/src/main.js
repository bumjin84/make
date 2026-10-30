import * as THREE from 'three';

const container = document.getElementById('canvas-container');

// 1. 씬, 카메라, 렌더러 설정
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020617);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// 모바일 고DPR 디스플레이 최적화 (배터리 및 발열 방지)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// 2. 조명 설정
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x38bdf8, 20, 100);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xa855f7, 20, 100);
pointLight2.position.set(-5, -5, -2);
scene.add(pointLight2);

// 3. 지오메트리 & 메쉬 생성
const geometries = {
  torusKnot: new THREE.TorusKnotGeometry(0.8, 0.28, 128, 32),
  icosahedron: new THREE.IcosahedronGeometry(1.2, 1),
  box: new THREE.BoxGeometry(1.5, 1.5, 1.5)
};

const material = new THREE.MeshStandardMaterial({
  color: 0x38bdf8,
  roughness: 0.2,
  metalness: 0.8,
  wireframe: false
});

let mesh = new THREE.Mesh(geometries.torusKnot, material);
scene.add(mesh);

// 4. 모바일 터치 및 마우스 드래그 회전 인터랙션
let isDragging = false;
let prevMousePos = { x: 0, y: 0 };

function onPointerDown(e) {
  isDragging = true;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  prevMousePos = { x: clientX, y: clientY };
}

function onPointerMove(e) {
  if (!isDragging) return;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const deltaX = clientX - prevMousePos.x;
  const deltaY = clientY - prevMousePos.y;

  mesh.rotation.y += deltaX * 0.008;
  mesh.rotation.x += deltaY * 0.008;

  prevMousePos = { x: clientX, y: clientY };
}

function onPointerUp() {
  isDragging = false;
}

window.addEventListener('mousedown', onPointerDown);
window.addEventListener('mousemove', onPointerMove);
window.addEventListener('mouseup', onPointerUp);

window.addEventListener('touchstart', onPointerDown, { passive: true });
window.addEventListener('touchmove', onPointerMove, { passive: true });
window.addEventListener('touchend', onPointerUp);

// 5. 윈도우 리사이즈 대응 (반응형 캔버스)
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// 6. UI 컨트롤러 연동
document.getElementById('geo-select').addEventListener('change', (e) => {
  scene.remove(mesh);
  mesh = new THREE.Mesh(geometries[e.target.value], material);
  scene.add(mesh);
});

document.getElementById('wireframe-toggle').addEventListener('change', (e) => {
  material.wireframe = e.target.checked;
});

// 7. 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);

  if (!isDragging) {
    mesh.rotation.x += 0.004;
    mesh.rotation.y += 0.007;
  }

  renderer.render(scene, camera);
}

animate();

