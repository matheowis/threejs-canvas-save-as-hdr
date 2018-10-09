const hadrEmmisiveWorker =()=>{
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
    const emmisiveBuffer = event.data.emmisiveBuffer;

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
    const getLineEmmisive = (y = 0) => {
      const array = [];
      let localVal = 0, localLength = 0;
      const lengthConstant = 128;
      for (var i = 0; i < width * 4; i += 4) {
        if (localLength === 0) {
          localVal = emmisiveBuffer[topIndex(y) + i];
          localLength++;
        } else if (localVal === emmisiveBuffer[topIndex(y) + i] && localLength < 127) {
          localLength++;
        } else {
          array.push({ value: localVal, length: localLength + lengthConstant });
          localVal = emmisiveBuffer[topIndex(y) + i];
          localLength = 1;
        }
      }
      array.push({ value: localVal, length: localLength + lengthConstant });
      return array;
    }

    const compressed = [];
    let fileSize = 0;
    for (var i = 0; i < height; i++) {
      const lineReds = getLine(i, 0);
      const lineGreens = getLine(i, 1);
      const lineBlues = getLine(i, 2);
      const lineEmissive = getLineEmmisive(i);
      const lineInitiator = 4;
      fileSize += lineInitiator + lineReds.length * 2 + lineGreens.length * 2 + lineBlues.length * 2 + lineEmissive.length * 2;
      compressed.push([lineReds, lineGreens, lineBlues, lineEmissive]);
    }
  });
}