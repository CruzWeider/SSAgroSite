const fs = require('fs');

function getUrls(filename) {
  const html = fs.readFileSync('scratch/' + filename, 'utf8');
  const regex = /https?:\/\/ssagro\.com\.br\/blog-ss-agro-([^"',\s\\]+)/g;
  return [...new Set([...html.matchAll(regex)].map(m => m[0]))];
}

const u2025 = getUrls('ssagro_2025.html');
const u2026p1 = getUrls('ssagro_2026_p1.html');
const u2026p2 = getUrls('ssagro_2026_p2.html');

console.log('2025 count:', u2025.length);
console.log('2026 p1 count:', u2026p1.length);
console.log('2026 p2 count:', u2026p2.length);

// Check differences
const diff1 = u2026p1.filter(u => !u2025.includes(u));
const diff2 = u2026p2.filter(u => !u2026p1.includes(u));
console.log('2026 p1 unique from 2025:', diff1.length);
console.log('2026 p2 unique from 2026 p1:', diff2.length);
