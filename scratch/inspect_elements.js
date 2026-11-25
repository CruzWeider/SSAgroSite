const fs = require('fs');

const html = fs.readFileSync('scratch/ssagro_2025.html', 'utf-8');
const match = html.match(/window\['bootstrap'\]\s*=\s*JSON\.parse\('([\s\S]*?)'\);/);
const jsonStr = match[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
const data = JSON.parse(jsonStr);

console.log('t length:', data.page.A.A[0].t.length);
data.page.A.A[0].t.forEach((item, idx) => {
  console.log(`t[${idx}] keys:`, Object.keys(item), 'E length:', item.E ? item.E.length : 0);
});

// Let's inspect item.E in t[1]
const elements = data.page.A.A[0].t[1].E;
console.log('Total elements in t[1]:', elements.length);
for (let i = 0; i < Math.min(elements.length, 10); i++) {
  const el = elements[i];
  console.log(`\n--- Element ${i} ---`);
  console.log('el keys:', Object.keys(el));
  console.log('A?:', el['A?'], 'type:', el.type);
  if (el.G) console.log('G (link?):', el.G);
  // print any image references or media IDs
  const str = JSON.stringify(el);
  const mediaRefs = str.match(/_assets\/[^"]+/g) || [];
  if (mediaRefs.length > 0) console.log('mediaRefs:', mediaRefs);
  // print text if any
  const texts = str.match(/text|title|name/gi) || [];
  console.log('json snippet:', str.slice(0, 150));
}
