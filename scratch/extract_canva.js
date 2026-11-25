const fs = require('fs');

function extractCanvaData(filename) {
  const html = fs.readFileSync('scratch/' + filename, 'utf8');
  console.log('=== ' + filename + ' ===');

  const regex = /https?:\/\/[^"',\s\\]+/g;
  const urls = [...new Set([...html.matchAll(regex)].map(m => m[0]))];
  const ssagroUrls = urls.filter(u => u.includes('ssagro.com.br'));
  console.log('SS Agro URLs:');
  console.log(ssagroUrls);
}

extractCanvaData('ssagro_2025.html');
extractCanvaData('ssagro_2026_p1.html');
extractCanvaData('ssagro_2026_p2.html');
