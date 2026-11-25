const fs = require('fs');

const html = fs.readFileSync('scratch/ssagro_2025.html', 'utf-8');
const id = 'MAHUPVBnoJ4';

let count = 0;
let pos = 0;
while ((pos = html.indexOf(id, pos + 1)) !== -1) {
  count++;
  console.log(`Match ${count} at pos ${pos}:`);
  console.log(html.slice(Math.max(0, pos - 150), Math.min(html.length, pos + 300)));
}
console.log('Total matches:', count);
