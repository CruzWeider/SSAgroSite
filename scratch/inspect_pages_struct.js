const fs = require('fs');

const html = fs.readFileSync('scratch/ssagro_2025.html', 'utf8');

// Canva website JSON has "pages" or "sheets" or sections:
// Let's find patterns like "title":"..." or "section" or page bounds
const pageIdMatches = [...html.matchAll(/"([0-9a-zA-Z_-]{10,25})":\{"width":/g)].map(m => m[1]);
console.log('Page-like IDs:', pageIdMatches);

// Let's search for "SSAGRO 2025" or "SSAGRO 2026" in the whole JSON
const matches2025 = [...html.matchAll(/SSAGRO[^\"]*/g)].map(m => m[0]);
console.log('SSAGRO occurrences:', [...new Set(matches2025)]);
