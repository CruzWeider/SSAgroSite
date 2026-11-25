const fs = require('fs');

const html = fs.readFileSync('scratch/ssagro_2025.html', 'utf8');

const p1_start = 90534;
const p2_start = 509945;
const p2025_start = 789828;
const p_end = 1186246;

const sections = [
  { name: 'SSAGRO 2026 - Parte 1', slice: html.substring(p1_start, p2_start) },
  { name: 'SSAGRO 2026 - Parte 2', slice: html.substring(p2_start, p2025_start) },
  { name: 'SSAGRO 2025', slice: html.substring(p2025_start, p_end) }
];

function extractFromSlice(slice, name) {
  console.log(`\n=================== ${name} ===================`);

  // Extract all links matching ssagro.com.br/blog-ss-agro-
  const urlRegex = /https:\/\/ssagro\.com\.br\/blog-ss-agro-([^"',\s\\]+)/g;
  const urls = [...new Set([...slice.matchAll(urlRegex)].map(m => m[0]))];
  console.log(`Found ${urls.length} article links:`);

  const articles = [];

  urls.forEach((url, i) => {
    const slug = url.replace('https://ssagro.com.br/blog-ss-agro-', '');
    
    // Find text near this URL
    let pos = slice.indexOf(url);
    let title = '';
    let category = '';

    if (pos !== -1) {
      const windowStr = slice.substring(Math.max(0, pos - 2500), Math.min(slice.length, pos + 500));
      const texts = [...windowStr.matchAll(/"A":\["([^"]+)"\]/g)].map(m => m[1].replace(/\\n/g, ' ').trim());
      
      // Filter texts
      const candidates = texts.filter(t => 
        t.length > 20 && 
        !t.startsWith('http') && 
        !t.includes('{') && 
        !t.includes('Copyright') &&
        t !== 'Saiba mais'
      );

      if (candidates.length > 0) {
        title = candidates[0];
      }
      if (candidates.length > 1) {
        category = candidates[1];
      }
    }

    if (!title) {
      title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    articles.push({ index: i + 1, title, category, slug, url });
    console.log(`${i+1}. [${category || 'Agro'}] ${title}`);
  });

  return articles;
}

const res1 = extractFromSlice(sections[0].slice, sections[0].name);
const res2 = extractFromSlice(sections[1].slice, sections[1].name);
const res3 = extractFromSlice(sections[2].slice, sections[2].name);

fs.writeFileSync('scratch/extracted_real_posts.json', JSON.stringify({
  p1: res1,
  p2: res2,
  p2025: res3
}, null, 2), 'utf8');
