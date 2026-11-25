const fs = require('fs');

const html = fs.readFileSync('scratch/ssagro_2025.html', 'utf-8');
const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
console.log('Script 4 starts with:');
const s4 = scripts[4];
console.log(s4.slice(0, 500));
console.log('\n--- Searching for image patterns in script 4 ---');

// Check for media, image, cdn, hash, etc.
const matches = s4.match(/["'](?:https?:\/\/|\/|data:)[^"']+\.(?:png|jpg|jpeg|webp|svg)[^"']*/gi) || [];
console.log('Direct image string matches:', matches.length);
if (matches.length > 0) {
  console.log(matches.slice(0, 10));
}

// Check for Canva media keys or IDs
const canvaIds = s4.match(/[A-Za-z0-9_-]{20,}/g) || [];
console.log('Long tokens (possible media IDs):', canvaIds.length);

// Let's search for keywords around images
const indices = [];
let pos = 0;
while ((pos = s4.indexOf('image', pos + 1)) !== -1 && indices.length < 5) {
  indices.push(pos);
}
for (const idx of indices) {
  console.log('\nAround pos ' + idx + ':');
  console.log(s4.slice(Math.max(0, idx - 100), Math.min(s4.length, idx + 200)));
}
