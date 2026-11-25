const fs = require('fs');

const urls = [
  {
    key: 'elnino',
    url: 'https://ssagro.com.br/blog-ss-agro-el-ni-o-agressivo-no-horizonte-como-a-distribui-o-de-insumos-deve-orientar-a-janela-de-plantio'
  },
  {
    key: 'fertilizantes',
    url: 'https://ssagro.com.br/blog-ss-agro-nova-legisla-o-de-fertilizantes-nacionais-o-que-muda-para-o-estoque-e-as-margens-dos-distribuidores'
  },
  {
    key: 'manejo',
    url: 'https://ssagro.com.br/blog-ss-agro-manejo-fisiol-gico-e-prote-o-t-rmica-a-nova-fronteira-do-portf-lio-para-proteger-o-potencial-produtivo-da-safra'
  },
  {
    key: 'milho',
    url: 'https://ssagro.com.br/blog-ss-agro-consumo-interno-de-milho-aquecido-e-cautela-na-comercializa-o-o-impacto-nas-opera-es-de-barter-e-insumos-da-safrinha'
  }
];

async function extractArticle(item) {
  console.log(`\n=== Extraindo: ${item.key} ===`);
  const res = await fetch(item.url);
  console.log('Status:', res.status);
  const html = await res.text();
  fs.writeFileSync(`scratch/article_${item.key}.html`, html, 'utf-8');

  // Extrair window['bootstrap']
  const match = html.match(/window\['bootstrap'\]\s*=\s*JSON\.parse\('([\s\S]*?)'\);/);
  if (!match) {
    console.log('Sem bootstrap');
    return;
  }
  const jsonStr = match[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  const data = JSON.parse(jsonStr);

  // Extrair todos os blocos de texto
  const texts = [];
  function getTexts(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      obj.forEach(getTexts);
      return;
    }
    // No Canva, os textos costumam estar em A: ["..."]
    if (obj.A && Array.isArray(obj.A) && obj.A.every(x => typeof x === 'string')) {
      const full = obj.A.join(' ').trim();
      if (full.length > 20 && !full.includes('{') && !full.includes('Copyright')) {
        texts.push(full);
      }
    }
    for (const v of Object.values(obj)) {
      if (typeof v === 'object') getTexts(v);
    }
  }
  getTexts(data.page);
  console.log(`Encontrados ${texts.length} blocos de texto.`);
  texts.slice(0, 10).forEach((t, i) => console.log(`  [${i+1}] ${t.slice(0, 80)}...`));
}

async function run() {
  for (const item of urls) {
    await extractArticle(item);
  }
}
run();
