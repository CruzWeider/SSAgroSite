const fs = require('fs');

const html = fs.readFileSync('scratch/ssagro_2025.html', 'utf8');

// Find all text matches
const textMatches = [...html.matchAll(/"A":\["([^"]+)"\]/g)].map(m => m[1].replace(/\\n/g, ' ').trim());

// Filter titles
const titles = [...new Set(textMatches.filter(t => 
  t.length > 25 && 
  !t.startsWith('http') && 
  !t.includes('{') && 
  !t.includes('Copyright') && 
  !t.includes('www.') &&
  !t.includes('Todos os direitos') &&
  !t.includes('Fale com')
))];

console.log('Total titles found:', titles.length);
titles.forEach((t, i) => console.log(`${i+1}. ${t}`));
