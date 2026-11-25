const fs = require('fs');

const f1 = fs.readFileSync('scratch/ssagro_2025.html', 'utf8');
const f2 = fs.readFileSync('scratch/ssagro_2026_p1.html', 'utf8');
const f3 = fs.readFileSync('scratch/ssagro_2026_p2.html', 'utf8');

console.log('f1 len:', f1.length);
console.log('f2 len:', f2.length);
console.log('f3 len:', f3.length);

// Compare first 1000 chars
console.log('f1 diff f2 at index:');
for (let i = 0; i < Math.min(f1.length, f2.length); i++) {
  if (f1[i] !== f2[i]) {
    console.log('Diff at index', i);
    console.log('f1:', f1.substring(i - 20, i + 80));
    console.log('f2:', f2.substring(i - 20, i + 80));
    break;
  }
}
