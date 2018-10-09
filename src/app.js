import * as THREE from 'three';
import { hdrConverter } from './hdrConverter';
const cWidth = 320, cHeight = 180;

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(70, 16 / 9, 0.1, 2000);
const camera = new THREE.OrthographicCamera(cWidth / -2, cWidth / 2, cHeight / 2, cHeight / -2, 1, 1000);
renderer.setSize(cWidth, cHeight);

document.body.appendChild(renderer.domElement);
const pixelSize = 10;
const box = new THREE.BoxGeometry(pixelSize, pixelSize, pixelSize);
const boxMesh = new THREE.Mesh(box);
boxMesh.position.z = -300;
const boxMeshLU = new THREE.Mesh(box);
boxMeshLU.position.set(-cWidth / 2, cHeight / 2, -300);

scene.add(boxMesh, boxMeshLU);
const renderTarget = new THREE.WebGLRenderTarget(cWidth, cHeight);

renderer.render(scene, camera);
renderer.render(scene, camera, renderTarget);
const pixelData = new Uint8Array(cWidth * cHeight * 4);
renderer.readRenderTargetPixels(renderTarget, 0, 0, cWidth, cHeight, pixelData);
console.log(renderTarget);
console.log(pixelData);

hdrConverter(cWidth, cHeight, pixelData);
