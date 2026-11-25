const fs = require('fs');

const html = fs.readFileSync('scratch/ssagro_2025.html', 'utf8');

// In Canva, let's find all URLs that look like https://ssagro.com.br/blog-ss-agro-...
const regex = /https?:\/\/ssagro\.com\.br\/blog-ss-agro-([^"',\s\\]+)/g;
const rawUrls = [...new Set([...html.matchAll(regex)].map(m => m[0]))];

console.log('Total URLs found in Canva document:', rawUrls.length);

// For each URL, let's extract the slug and reconstruct the title from the slug or find nearby text
const articles = [];

rawUrls.forEach((url, idx) => {
  const slug = url.replace('https://ssagro.com.br/blog-ss-agro-', '');
  
  // Find where this URL appears in the HTML
  let pos = html.indexOf(url);
  let title = '';
  let category = '';
  
  // In Canva, the text box containing the title is usually placed nearby
  // Let's search in a window of 2500 characters around this position
  if (pos !== -1) {
    const windowText = html.substring(Math.max(0, pos - 3000), Math.min(html.length, pos + 1000));
    // Find all "A":["..."] in this window
    const texts = [...windowText.matchAll(/"A":\["([^"]+)"\]/g)].map(m => m[1].replace(/\\n/g, ' ').trim());
    
    // The title is usually a long text > 25 chars
    const candidateTitles = texts.filter(t => t.length > 25 && !t.startsWith('http') && !t.includes('{') && !t.includes('Copyright'));
    if (candidateTitles.length > 0) {
      // Pick the title closest to the slug words
      title = candidateTitles[0];
    }
  }
  
  // Fallback: title from slug
  if (!title) {
    title = slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  articles.push({
    index: idx + 1,
    url,
    slug,
    title
  });
});

console.log('Sample extracted articles:');
articles.slice(0, 30).forEach(a => console.log(`${a.index}. [${a.slug}] ${a.title}`));
fs.writeFileSync('scratch/all_canva_articles.json', JSON.stringify(articles, null, 2), 'utf8');
