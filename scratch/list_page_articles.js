const fs = require('fs');

function parsePage(filename, label) {
  const html = fs.readFileSync('scratch/' + filename, 'utf8');

  // Let's find all text blocks and links in this Canva document
  // In Canva sites, text is stored in JSON structures like:
  // "C":{"A":["..."]}
  // Let's find all URLs that look like https://ssagro.com.br/blog-ss-agro-...
  const regex = /https?:\/\/ssagro\.com\.br\/blog-ss-agro-([^"',\s\\]+)/g;
  const matches = [...new Set([...html.matchAll(regex)].map(m => m[0]))];
  console.log(`=== ${label} (${matches.length} articles) ===`);
  matches.forEach((u, i) => console.log(`${i+1}. ${u}`));
}

parsePage('ssagro_2025.html', 'SSAGRO 2025');
parsePage('ssagro_2026_p1.html', 'SSAGRO 2026 - Parte 1');
parsePage('ssagro_2026_p2.html', 'SSAGRO 2026 - Parte 2');
