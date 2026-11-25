const fs = require('fs');

function inspectCanvaPages(filename) {
  const html = fs.readFileSync('scratch/' + filename, 'utf8');

  // Let's find all text strings in the Canva JSON
  // Pattern: "A":["..."]
  const textMatches = [...html.matchAll(/"A":\["([^"]+)"\]/g)].map(m => m[1]);
  console.log(`=== ${filename} ===`);
  console.log('Total text nodes:', textMatches.length);

  // Filter text nodes with length > 20
  const longTexts = textMatches.filter(t => t.length > 20 && !t.startsWith('http') && !t.includes('{'));
  console.log('Sample long texts:');
  longTexts.slice(0, 20).forEach((t, i) => console.log(`${i+1}. ${t}`));
}

inspectCanvaPages('ssagro_2025.html');
