import * as THREE from 'three';
import { hdrConverterEmmisive } from './hdrConverterEmissive';
import { sphereMaterial } from './materials/sphereMaterial';
// const cWidth = 320, cHeight = 180;
const cWidth = 1280, cHeight = 720;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(70, 16 / 9, 0.1, 2000);
const camera = new THREE.OrthographicCamera(cWidth / -2, cWidth / 2, cHeight / 2, cHeight / -2, 1, 1000);
renderer.setSize(cWidth, cHeight);

document.body.appendChild(renderer.domElement);
const pixelSize = 50;
const sphereGeo = new THREE.SphereGeometry(300, 100, 100);
const shereMesh = new THREE.Mesh(sphereGeo, sphereMaterial);
shereMesh.position.z = -400;
const redMat = new THREE.MeshBasicMaterial({ color: 0xaa0a0a })
const blueMat = new THREE.MeshBasicMaterial({ color: 0x0808aa })
const box = new THREE.BoxGeometry(pixelSize, pixelSize, pixelSize);
const boxMesh = new THREE.Mesh(box);
boxMesh.position.set(cWidth / 4, 0, -300);
const boxMeshLU = new THREE.Mesh(box);
boxMeshLU.position.set(-cWidth / 4, 0, -300);

scene.add(boxMesh, boxMeshLU, shereMesh);
const renderTarget = new THREE.WebGLRenderTarget(cWidth, cHeight);

// renderer.render(scene, camera);
// renderer.render(scene, camera, renderTarget);
// const pixelData = new Uint8Array(cWidth * cHeight * 4);
// renderer.readRenderTargetPixels(renderTarget, 0, 0, cWidth, cHeight, pixelData);
render()
function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera);
}

const a = document.getElementById('download');
a.addEventListener('click', e => {
  renderer.render(scene, camera, renderTarget);
  const pixelData = new Uint8Array(cWidth * cHeight * 4);
  renderer.readRenderTargetPixels(renderTarget, 0, 0, cWidth, cHeight, pixelData);
  console.log('The pixel data!', pixelData);
  hdrConverterEmmisive(cWidth, cHeight, pixelData).then(binary => {
    const header = 'FORMAT=32-bit_rle_rgbe\n';
    const blankSpace = '\n';
    const Resolution = `-Y ${cHeight} +X ${cWidth}\n`;
    let text = header + blankSpace + Resolution;

    var blob = new Blob([text, binary], { type: "octet/stream" });
    var url = URL.createObjectURL(blob);
    a.href = url;
    a.download = 'shouldWork.hdr';
  })
})


// hdrConverter(cWidth, cHeight, pixelData).then(binary => {
//   const header = 'FORMAT=32-bit_rle_rgbe\n';
//   const blankSpace = '\n';
//   const Resolution = `-Y ${cHeight} +X ${cWidth}\n`;
//   let text = header + blankSpace + Resolution;
//   // console.log(binary)
//   const a = document.getElementById('download');
//   var blob = new Blob([text, binary], { type: "octet/stream" });
//   var url = URL.createObjectURL(blob);
//   a.href = url;
//   a.download = 'shouldWork.hdr';
// });
