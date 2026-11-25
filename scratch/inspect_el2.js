const fs = require('fs');

const html = fs.readFileSync('scratch/ssagro_2025.html', 'utf-8');
const match = html.match(/window\['bootstrap'\]\s*=\s*JSON\.parse\('([\s\S]*?)'\);/);
const jsonStr = match[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
const data = JSON.parse(jsonStr);

const el2 = data.page.A.A[0].t[1].E[2];
console.log('--- el2 keys and values ---');
for (const [k, v] of Object.entries(el2)) {
  console.log(`${k}:`, typeof v === 'object' ? JSON.stringify(v).slice(0, 100) : v);
}
