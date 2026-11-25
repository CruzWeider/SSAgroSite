const fs = require('fs');

const posts = JSON.parse(fs.readFileSync('data/blog.json', 'utf8'));

const map = {
  'el-ni-o': 'El Niño',
  'gest-o': 'Gestão',
  'distribui-o': 'Distribuição',
  'comercializa-o': 'Comercialização',
  'opera-es': 'Operações',
  'agr-colas': 'Agrícolas',
  'movimenta-o': 'Movimentação',
  'bilion-ria': 'Bilionária',
  'm-dio': 'Médio',
  'pre-os': 'Preços',
  'clim-tico': 'Climático',
  'geopol-tica': 'Geopolítica',
  'in-cio': 'Início',
  'log-stica': 'Logística',
  'mant-m': 'Mantém',
  'press-o': 'Pressão',
  'c-mbio': 'Câmbio',
  'avan-o': 'Avanço',
  'rea-o': 'Reação',
  'petr-leo': 'Petróleo',
  'lentid-o': 'Lentidão',
  'efici-ncia': 'Eficiência',
  'biossolu-o': 'Biossolução',
  'implac-veis': 'Implacáveis',
  'gr-o': 'Grão',
  'combust-vel': 'Combustível',
  'amea-a': 'Ameaça',
  'estrat-gica': 'Estratégica',
  'milh-es': 'Milhões',
  'sustent-vel': 'Sustentável',
  'pol-tica': 'Política',
  'econ-mica': 'Econômica',
  'otimismo': 'Otimismo',
  'inova-o': 'Inovação',
  'ci-ncia': 'Ciência',
  'tr-s': 'Trás',
  'resist-ncia': 'Resistência',
  'tecnol-gico': 'Tecnológico',
  'ndice': 'Índice',
  'algodoeiro': 'Algodoeiro',
  'pulg-o': 'Pulgão',
  'at-': 'Até',
  'rela-o': 'Relação',
  'cr-tico': 'Crítico',
  'for-a': 'Força',
  'ind-stria': 'Indústria',
  'explos-o': 'Explosão',
  'ureia': 'Ureia',
  'at-pico': 'Atípico',
  'aten-o': 'Atenção',
  't-rmico': 'Térmico',
  'revolu-o': 'Revolução',
  'nanotecnol-gica': 'Nanotecnológica',
  'gera-o': 'Geração',
  'desperd-cio': 'Desperdício',
  'estrat-gias': 'Estratégias',
  'mitiga-o': 'Mitigação',
  'redesenh-o': 'Redesenham',
  'desburocratiza-o': 'Desburocratização',
  'portf-lio': 'Portfólio',
  'retra-da': 'Retraída',
  'fen-meno': 'Fenômeno',
  'exigir-': 'Exigirá',
  'h-bridos': 'Híbridos',
  'aduba-o': 'Adubação',
  'li-es': 'Lições',
  'est-o': 'Estão',
  'libera-o': 'Liberação',
  'proje-o': 'Projeção',
  'sequ-ncia': 'Sequência',
  'fertiliza-o': 'Fertilização',
  'intelig-ncia': 'Inteligência',
  'declara-es': 'Declarações',
  'goi-nia': 'Goiânia',
  'emiss-o': 'Emissão',
  'deixar-': 'Deixará',
  'previs-o': 'Previsão',
  'regi-es': 'Regiões',
  'esperan-a': 'Esperança',
  'aplica-es': 'Aplicações',
  'concorr-ncia': 'Concorrência',
  'rea': 'Área',
  'd-lar': 'Dólar',
  'pe-a': 'Peça',
  'exporta-o': 'Exportação',
  'sustenta-o': 'Sustentação',
  'tribut-ria': 'Tributária',
  'ben-ficos': 'Benéficos',
  'biol-gico': 'Biológico',
  'am-rica': 'América',
  'neg-cios': 'Negócios',
  'f-sico': 'Físico',
  ' paran-': ' Paraná',
  'goi-s': 'Goiás',
  'p-s': 'Pós',
  'ubirat-': 'Ubiratã',
  'favor-vel': 'Favorável',
  'gr-os': 'Grãos'
};

function titleFromSlug(slug) {
  let str = slug;
  for (const [k, v] of Object.entries(map)) {
    str = str.replace(new RegExp(k, 'g'), v);
  }
  return str
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

posts.forEach(p => {
  // If title has a slash (category-like) or is shorter than 20 chars
  if (p.title.includes('/') || p.title.length < 20) {
    p.title = titleFromSlug(p.slug);
  }
});

fs.writeFileSync('data/blog.json', JSON.stringify(posts, null, 2), 'utf8');

// Also update blog-data.js
let blogDataCode = fs.readFileSync('blog-data.js', 'utf8');
const startIndex = blogDataCode.indexOf('const DEFAULT_BLOG_POSTS = [');
const endIndex = blogDataCode.indexOf('function slugifyText(text) {');

if (startIndex !== -1 && endIndex !== -1) {
  const newDeclar = 'const DEFAULT_BLOG_POSTS = ' + JSON.stringify(posts, null, 2) + ';\n\n';
  blogDataCode = blogDataCode.substring(0, startIndex) + newDeclar + blogDataCode.substring(endIndex);
  fs.writeFileSync('blog-data.js', blogDataCode, 'utf8');
  console.log('Fixed refined titles across all 152 posts!');
}
