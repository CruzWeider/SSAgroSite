const fs = require('fs');

const keys = ['elnino', 'fertilizantes', 'manejo', 'milho'];

for (const k of keys) {
  const html = fs.readFileSync(`scratch/article_${k}.html`, 'utf-8');
  const match = html.match(/window\['bootstrap'\]\s*=\s*JSON\.parse\('([\s\S]*?)'\);/);
  const jsonStr = match[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  const data = JSON.parse(jsonStr);

  const texts = [];
  function getTexts(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      obj.forEach(getTexts);
      return;
    }
    if (obj.A && Array.isArray(obj.A) && obj.A.every(x => typeof x === 'string')) {
      const full = obj.A.join(' ').trim();
      if (full.length > 50 && !full.includes('{') && !full.includes('Copyright') && !full.includes('RUA 12') && !full.includes('Rua Marajó')) {
        texts.push(full);
      }
    }
    for (const v of Object.values(obj)) {
      if (typeof v === 'object') getTexts(v);
    }
  }
  getTexts(data.page);

  console.log(`\n================== ${k.toUpperCase()} ==================`);
  texts.forEach((t, i) => {
    console.log(`--- Parágrafo/Seção ${i+1} (${t.length} chars) ---`);
    console.log(t);
  });
}
