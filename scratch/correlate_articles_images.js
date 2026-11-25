const fs = require('fs');

const html = fs.readFileSync('scratch/ssagro_2025.html', 'utf-8');

// Also extract RASTER table: id -> url
const rasterRegex = /\{"type":"RASTER","id":"([^"]+)","version":\d+,"files":(\[[^\]]+\])\}/g;
const mediaMap = new Map();
let rm;
while ((rm = rasterRegex.exec(html)) !== null) {
  try {
    const files = JSON.parse(rm[2]);
    let chosen = files[0]?.url;
    for (const f of files) {
      if (f.width >= 600 && f.width <= 1600) {
        chosen = f.url;
        break;
      }
    }
    if (chosen && !mediaMap.has(rm[1])) {
      mediaMap.set(rm[1], chosen);
    }
  } catch (e) {}
}
console.log('Total media IDs in raster table:', mediaMap.size);

// All URLs
const regex = /https?:\/\/ssagro\.com\.br\/blog-ss-agro-([^"',\s\\]+)/g;
const rawUrls = [...new Set([...html.matchAll(regex)].map(m => m[0]))];
console.log('Total blog URLs found:', rawUrls.length);

// For each URL, let's look at all occurrences in the HTML and see what media IDs or image paths are in a +/- 4000 char window
let foundImagesCount = 0;
const results = [];

for (const url of rawUrls) {
  let pos = 0;
  let associatedImage = null;
  
  while ((pos = html.indexOf(url, pos + 1)) !== -1) {
    // Check surrounding window
    const windowText = html.substring(Math.max(0, pos - 2000), Math.min(html.length, pos + 2000));
    
    // Look for mediaId pattern in windowText: "A":"M[A-Za-z0-9_-]{10,}"
    // e.g. "A":{"A?":"d","A":"MAHUPVBnoJ4","B":1}
    const mediaIdMatches = [...windowText.matchAll(/"A":"(MA[A-Za-z0-9_-]{9,})"/g)].map(m => m[1]);
    
    for (const mId of mediaIdMatches) {
      if (mediaMap.has(mId)) {
        associatedImage = mediaMap.get(mId);
        break;
      }
    }
    if (associatedImage) break;

    // Also look directly for _assets/media/ in window
    const directMedia = windowText.match(/_assets\/media\/[a-f0-9]+\.(?:jpg|jpeg|png|webp)/);
    if (directMedia) {
      associatedImage = directMedia[0];
      break;
    }
  }

  if (associatedImage) {
    foundImagesCount++;
  }
  results.push({
    url,
    slug: url.replace('https://ssagro.com.br/blog-ss-agro-', ''),
    image: associatedImage
  });
}

console.log(`Associadas imagens a ${foundImagesCount} de ${rawUrls.length} notícias!`);
console.log('Amostra das 10 primeiras:');
results.slice(0, 10).forEach(r => console.log(`${r.slug.slice(0, 40)} -> ${r.image}`));
