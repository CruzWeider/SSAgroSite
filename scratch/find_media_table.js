const fs = require('fs');

const html = fs.readFileSync('scratch/ssagro_2025.html', 'utf-8');
const match = html.match(/window\['bootstrap'\]\s*=\s*JSON\.parse\('([\s\S]*?)'\);/);
const jsonStr = match[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
const data = JSON.parse(jsonStr);

function searchKey(obj, target, path = '') {
  if (!obj || typeof obj !== 'object') return null;
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const res = searchKey(obj[i], target, `${path}[${i}]`);
      if (res) return res;
    }
  } else {
    for (const [k, v] of Object.entries(obj)) {
      if (v === target) {
        return { path: `${path}.${k}`, obj };
      }
      if (typeof v === 'object') {
        const res = searchKey(v, target, `${path}.${k}`);
        if (res) return res;
      }
    }
  }
  return null;
}

const found = searchKey(data, 'MAHUPVBnoJ4');
console.log('Found media ID at:', found ? found.path : 'not found');
if (found) {
  console.log('Object at found:', JSON.stringify(found.obj).slice(0, 300));
}
