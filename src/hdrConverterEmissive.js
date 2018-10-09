import { hdrWorker } from './workers/hdrWorker'
export const hdrConverterEmmisive = (
  width,
  height,
  rgbBuffer = new Uint8Array(),
  emmisiveBuffer = new Uint8Array()
) => {
  return new Promise((resolve,reject) => {
    var blobURL = URL.createObjectURL(new Blob(['(', hdrWorker.toString(), ')()'], { type: 'application/javascript' }));
    const worker = new Worker(blobURL);
    worker.postMessage({ rgbBuffer: rgbBuffer, width, height });
  
    worker.addEventListener('message', event => {
      if (event.data.progress) {
        console.log('dataProgress=',event.data.progress);
      } else {
        console.log('dataBack', event.data);
        resolve(event.data.binary)
      }
    })
  })
}