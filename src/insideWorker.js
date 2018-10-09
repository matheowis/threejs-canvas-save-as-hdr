export const insideWorker = () => {
  self.addEventListener('message', event => {
    const width = event.data.width;
    const height = event.data.height;
    const rgbBuffer = event.data.rgbBuffer;

    const topIndex = y => (width * height * 4) - (width * 4) - (width * y * 4);
    const getLine = (y = 0, offSet = 0) => {
      const array = [];
      let localVal = 0, localLength = 0;
      for (var i = 0; i < width * 4; i += 4) {
        if (localLength === 0) {
          localVal = rgbBuffer[topIndex(y) + i + offSet];
          localLength++;
        } else if (localVal === rgbBuffer[topIndex(y) + i + offSet] && localLength < 127) {
          localLength++;
        } else {
          array.push({ value: localVal, length: localLength });
          localVal = rgbBuffer[topIndex(y) + i + offSet];
          localLength = 1;
        }
      }
      array.push({ value: localVal, length: localLength });
      return array;
    }
    const getEmmisiveLine = (emmisive = 128) => {
      const array = [];
      localLength = 0;
      for (var i = 0; i < width * 4; i += 4) {
        if (localLength < 127) {
          localLength++;
        } else {
          array.push({ value: emmisive, length: localLength });
          localLength = 1;
        }
      }
      array.push({ value: emmisive, length: localLength });
      return array;
    }

    const compressed = [];
    for (var i = 0; i < height; i++) {
      compressed.push([getLine(i, 0), getLine(i, 1), getLine(i, 2), getEmmisiveLine()]);
    }
    self.postMessage({ compressed });
  })
}

