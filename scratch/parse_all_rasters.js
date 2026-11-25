const fs = require('fs');

function extractAllRasters(html) {
  const map = new Map();
  let pos = 0;
  while ((pos = html.indexOf('{"type":"RASTER"', pos)) !== -1) {
    // Find matching closing brace
    let depth = 0;
    let end = pos;
    for (let i = pos; i < Math.min(html.length, pos + 4000); i++) {
      if (html[i] === '{') depth++;
      else if (html[i] === '}') {
        depth--;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    const snippet = html.slice(pos, end);
    try {
      const obj = JSON.parse(snippet);
      if (obj.id && obj.files) {
        // pick file
        let chosen = obj.files[0]?.url;
        for (const f of obj.files) {
          if (f.width >= 600 && f.width <= 1600) {
            chosen = f.url;
            break;
          }
        }
        if (chosen) {
          map.set(obj.id, chosen);
        }
      }
    } catch (e) {}
    pos += 15;
  }
  return map;
}

const r1 = extractAllRasters(fs.readFileSync('scratch/ssagro_2025.html', 'utf-8'));
const r2 = extractAllRasters(fs.readFileSync('scratch/ssagro_2026_p1.html', 'utf-8'));
const r3 = extractAllRasters(fs.readFileSync('scratch/ssagro_2026_p2.html', 'utf-8'));

console.log('Rasters in 2025:', r1.size);
console.log('Rasters in 2026 p1:', r2.size);
console.log('Rasters in 2026 p2:', r3.size);
