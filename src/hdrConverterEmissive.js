import { hadrEmmisiveWorker } from './workers/hdrEmissiveWorker'
export const hdrConverterEmmisive = (
  width,
  height,
  rgbeBuffer = new Uint8Array(),
) => {
  return new Promise((resolve, reject) => {
    var blobURL = URL.createObjectURL(new Blob(['(', hadrEmmisiveWorker.toString(), ')()'], { type: 'application/javascript' }));
    const worker = new Worker(blobURL);
    worker.postMessage({ rgbeBuffer, width, height });

    worker.addEventListener('message', event => {
      if (event.data.progress) {
        // possible implementation for bigger images
        console.log('dataProgress=', event.data.progress); 
      } else {
        console.log('dataBack', event.data);
        resolve(event.data.binary) //hdr binary
      }
    })
  })
}