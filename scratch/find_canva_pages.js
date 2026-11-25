const fs = require('fs');

// In Canva, each page has a page ID in the document model.
// Let's inspect the sections in the HTML.
function findPages(filename) {
  const html = fs.readFileSync('scratch/' + filename, 'utf8');
  
  // Find URL path or canonical
  const canonical = html.match(/rel="canonical"\s+href="([^"]+)"/);
  console.log('File:', filename, 'Canonical:', canonical ? canonical[1] : 'none');
}

findPages('ssagro_2025.html');
findPages('ssagro_2026_p1.html');
findPages('ssagro_2026_p2.html');
