const fs = require('fs');
const PNG = require('pngjs').PNG;

const buf = fs.readFileSync('src/assets/trybooth.png');
const src = PNG.sync.read(buf);

let minX = src.width, minY = src.height, maxX = 0, maxY = 0;
for (let y = 0; y < src.height; y++) {
  for (let x = 0; x < src.width; x++) {
    let idx = (src.width * y + x) << 2;
    if (src.data[idx + 3] > 0) { // non-transparent
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
}

const width = maxX - minX + 1;
const height = maxY - minY + 1;
console.log(`Cropping to ${width}x${height} at x:${minX} y:${minY}`);

const dst = new PNG({ width, height });
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    let srcIdx = (src.width * (y + minY) + (x + minX)) << 2;
    let dstIdx = (width * y + x) << 2;
    dst.data[dstIdx] = src.data[srcIdx];
    dst.data[dstIdx + 1] = src.data[srcIdx + 1];
    dst.data[dstIdx + 2] = src.data[srcIdx + 2];
    dst.data[dstIdx + 3] = src.data[srcIdx + 3];
  }
}

fs.writeFileSync('src/assets/trybooth.png', PNG.sync.write(dst));
console.log('Successfully cropped trybooth.png');
