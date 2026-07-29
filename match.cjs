const fs = require('fs');
const PNG = require('pngjs').PNG;

console.log("Reading scenes...");
const scene = PNG.sync.read(fs.readFileSync('src/assets/tryscene.png'));
const booth = PNG.sync.read(fs.readFileSync('src/assets/trybooth.png')); // currently cropped to 970x1393! Wait, I cropped it!

// My previous script cropped trybooth.png to its exact bounds (970x1393).
// I will just use the cropped booth to find it in tryscene.png

let bestMatch = null;
let minDiff = Infinity;

// We expect the booth to be around x: 611, y: 47 based on the old canvas, but let's search a grid around it.
// Search x from 400 to 800, y from 0 to 200
for (let y = 0; y < 200; y+=2) {
  for (let x = 400; x < 800; x+=2) {
    let diff = 0;
    // sample 100 pixels to be fast
    for (let sy = 0; sy < booth.height; sy += 50) {
      for (let sx = 0; sx < booth.width; sx += 50) {
        let bIdx = (booth.width * sy + sx) << 2;
        if (booth.data[bIdx+3] < 128) continue; // skip transparent
        
        let scIdx = (scene.width * (y + sy) + (x + sx)) << 2;
        if (y+sy >= scene.height || x+sx >= scene.width) { diff += 999999; continue; }
        
        let r = scene.data[scIdx] - booth.data[bIdx];
        let g = scene.data[scIdx+1] - booth.data[bIdx+1];
        let b = scene.data[scIdx+2] - booth.data[bIdx+2];
        diff += Math.abs(r) + Math.abs(g) + Math.abs(b);
      }
    }
    if (diff < minDiff) {
      minDiff = diff;
      bestMatch = { x, y };
    }
  }
}

console.log("Best match rough:", bestMatch, "diff:", minDiff);

// refine search
let exactMatch = null;
let exactMinDiff = Infinity;
for (let y = bestMatch.y - 4; y <= bestMatch.y + 4; y++) {
  for (let x = bestMatch.x - 4; x <= bestMatch.x + 4; x++) {
    let diff = 0;
    for (let sy = 0; sy < booth.height; sy += 20) {
      for (let sx = 0; sx < booth.width; sx += 20) {
        let bIdx = (booth.width * sy + sx) << 2;
        if (booth.data[bIdx+3] < 128) continue;
        let scIdx = (scene.width * (y + sy) + (x + sx)) << 2;
        let r = scene.data[scIdx] - booth.data[bIdx];
        let g = scene.data[scIdx+1] - booth.data[bIdx+1];
        let b = scene.data[scIdx+2] - booth.data[bIdx+2];
        diff += Math.abs(r) + Math.abs(g) + Math.abs(b);
      }
    }
    if (diff < exactMinDiff) {
      exactMinDiff = diff;
      exactMatch = { x, y };
    }
  }
}

console.log("Exact match:", exactMatch, "diff:", exactMinDiff);
