export const insideWorker = () => {
  class ByteData {
    constructor(size) {
      this.binaryData = new Uint8Array(size);
      this._cIndex = 0;
      this.push = this.push.bind(this);
    }
    push(...bytes) {
      for (var i = 0; i < arguments.length; i++) {
        this.binaryData[this._cIndex] = arguments[i];
        this._cIndex++;
      }
    }
  }
  self.addEventListener('message', event => {
    const width = event.data.width;
    const height = event.data.height;
    const rgbBuffer = event.data.rgbBuffer;

    const topIndex = y => (width * height * 4) - (width * 4) - (width * y * 4);
    const getLine = (y = 0, offSet = 0) => {
      const array = [];
      let localVal = 0, localLength = 0;
      const lengthConstant = 128;
      for (var i = 0; i < width * 4; i += 4) {
        if (localLength === 0) {
          localVal = rgbBuffer[topIndex(y) + i + offSet];
          localLength++;
        } else if (localVal === rgbBuffer[topIndex(y) + i + offSet] && localLength < 127) {
          localLength++;
        } else {
          array.push({ value: localVal, length: localLength + lengthConstant });
          localVal = rgbBuffer[topIndex(y) + i + offSet];
          localLength = 1;
        }
      }
      array.push({ value: localVal, length: localLength + lengthConstant });
      return array;
    }
    const getEmmisiveLine = (emmisive = 128) => {
      const array = [];
      let localLength = 0;
      const lengthConstant = 128;
      for (var i = 0; i < width * 4; i += 4) {
        if (localLength < 127) {
          localLength++;
        } else {
          array.push({ value: emmisive, length: localLength + lengthConstant });
          localLength = 1;
        }
      }
      array.push({ value: emmisive, length: localLength + lengthConstant });
      return array;
    }

    const compressed = [];
    let fileSize = 0;
    for (var i = 0; i < height; i++) {
      const lineReds = getLine(i, 0);
      const lineGreens = getLine(i, 1);
      const lineBlues = getLine(i, 2);
      const lineEmissive = getEmmisiveLine();
      const lineInitiator = 4;
      fileSize += lineInitiator + lineReds.length * 2 + lineGreens.length * 2 + lineBlues.length * 2 + lineEmissive.length * 2;
      compressed.push([lineReds, lineGreens, lineBlues, lineEmissive]);
    }
    console.log(`Worker, hdr file size = ${(fileSize / 1024).toFixed(2)}kb`);
    const lineSize = new Uint8Array(new Uint16Array([width]).buffer);
    const byteData = new ByteData(fileSize);

    for (var i = 0; i < height; i++) {
      byteData.push(2, 2, lineSize[1], lineSize[0]);//line iniciators // no idea why but linesize is flipped
      for (var k = 0; k < 4; k++) {
        compressed[i][k].map(channel => { byteData.push(channel.length, channel.value); })
      }
      console.log('y =', i, 'byteIndex = ', byteData._cIndex);
    }
    // console.log('worker-compressed',compressed);
    self.postMessage({ binary: byteData.binaryData });
  })
}

