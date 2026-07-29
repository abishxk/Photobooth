const fs = require('fs');

function readPNG(path) {
  const buf = fs.readFileSync(path);
  // very basic search for IHDR
  let idx = 0;
  while(idx < buf.length - 4) {
    if (buf[idx]==73 && buf[idx+1]==72 && buf[idx+2]==68 && buf[idx+3]==82) break;
    idx++;
  }
  const w = buf.readUInt32BE(idx+4);
  const h = buf.readUInt32BE(idx+8);
  return { w, h, buf }; // We actually need decoded pixels for template matching
}

console.log('Needs pngjs to decode pixels. Let me just install it.');
