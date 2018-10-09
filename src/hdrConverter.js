import { insideWorker } from './insideWorker'
export const hdrConverter = (width, height, rgbBuffer = new Uint8Array()) => {
  const emmisive = 128;

  var blobURL = URL.createObjectURL(new Blob(['(', insideWorker.toString(), ')()'], { type: 'application/javascript' }));
  const worker = new Worker(blobURL);
  worker.postMessage({ rgbBuffer: rgbBuffer, width, height });

  worker.addEventListener('message', event => {
    if (event.data.progress) {
      console.log('dataProgress=',event.data.progress);
    } else {
      console.log('dataBack', event.data);
    }
  })
  
}