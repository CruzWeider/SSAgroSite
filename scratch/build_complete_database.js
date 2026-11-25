const fs = require('fs');

const html = fs.readFileSync('scratch/ssagro_2025.html', 'utf8');

const p1_start = 90534;
const p2_start = 509945;
const p2025_start = 789828;
const p_end = 1186246;

const sections = [
  { edition: 'SSAGRO 2026 - Parte 1', start: p1_start, end: p2_start, defaultDate: '2026-05-15' },
  { edition: 'SSAGRO 2026 - Parte 2', start: p2_start, end: p2025_start, defaultDate: '2026-10-10' },
  { edition: 'SSAGRO 2025', start: p2025_start, end: p_end, defaultDate: '2025-11-20' }
];

function cleanTitle(raw) {
  return raw
    .replace(/\\n/g, ' ')
    .replace(/\\/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^\[.*?\]\s*/, '')
    .trim();
}

function titleFromSlug(slug) {
  // Fix specific Portuguese contractions and accents
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
    'sustenta-o': 'Sustentação'
  };

  let str = slug;
  for (const [k, v] of Object.entries(map)) {
    str = str.replace(new RegExp(k, 'g'), v);
  }

  return str
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Map images based on category or topics
function getImageForTopic(title, cat) {
  const t = (title + ' ' + cat).toLowerCase();
  if (t.includes('clima') || t.includes('chuva') || t.includes('seca') || t.includes('temperatura') || t.includes('frio') || t.includes('el niño')) {
    return 'assets/blog-1.jpg';
  }
  if (t.includes('fertilizante') || t.includes('ureia') || t.includes('adubo') || t.includes('enxofre') || t.includes('map') || t.includes('potássio') || t.includes('npk')) {
    return 'assets/blog-2.jpg';
  }
  if (t.includes('manejo') || t.includes('tecnologia') || t.includes('drone') || t.includes('bioinsumo') || t.includes('biológico') || t.includes('defensivo') || t.includes('praga') || t.includes('semente')) {
    return 'assets/blog-3.jpg';
  }
  if (t.includes('milho') || t.includes('soja') || t.includes('chicago') || t.includes('barter') || t.includes('mercado') || t.includes('grãos') || t.includes('safrinha') || t.includes('preço')) {
    return 'assets/blog-4.jpg';
  }
  if (t.includes('tribut') || t.includes('crédito') || t.includes('cpr') || t.includes('fiagro') || t.includes('cra') || t.includes('nota fiscal') || t.includes('financeiro') || t.includes('gestão')) {
    return 'assets/blog-1794338506276-dashboard_Gestao_financeira.png';
  }
  if (t.includes('armazém') || t.includes('armazenag') || t.includes('silo')) {
    return 'assets/seg-armazenagem-graos.jpg';
  }
  if (t.includes('algodão') || t.includes('indústria') || t.includes('beneficiamento')) {
    return 'assets/seg-industria-insumos.jpg';
  }
  return 'assets/seg-distribuidora-insumos.jpg';
}

function detectCategory(title, slug) {
  const t = (title + ' ' + slug).toLowerCase();
  if (t.includes('clima') || t.includes('tempo') || t.includes('chuva') || t.includes('seca') || t.includes('temperatura') || t.includes('frio') || t.includes('calor') || t.includes('el niño') || t.includes('la niña')) {
    return 'Clima e Plantio';
  }
  if (t.includes('fertilizante') || t.includes('ureia') || t.includes('adubo') || t.includes('enxofre') || t.includes('nitrogenado') || t.includes('npk') || t.includes('fosfato')) {
    return 'Análises de Mercado';
  }
  if (t.includes('defensivo') || t.includes('biológico') || t.includes('bioestimulante') || t.includes('praga') || t.includes('daninha') || t.includes('tecnologia') || t.includes('drone') || t.includes('semente') || t.includes('manejo')) {
    return 'Inovações Tecnológicas';
  }
  if (t.includes('milho') || t.includes('soja') || t.includes('chicago') || t.includes('barter') || t.includes('mercado') || t.includes('cotação') || t.includes('safrinha') || t.includes('grãos') || t.includes('gergelim') || t.includes('algodão')) {
    return 'Mercado & Barter';
  }
  if (t.includes('crédito') || t.includes('tribut') || t.includes('cpr') || t.includes('cra') || t.includes('fiagro') || t.includes('gestão') || t.includes('nota fiscal') || t.includes('diesel') || t.includes('custo') || t.includes('contrato')) {
    return 'Tributário & Gestão';
  }
  return 'Análises de Mercado';
}

const allExtractedPosts = [];
let postIdCounter = 1;

sections.forEach(sec => {
  const slice = html.substring(sec.start, sec.end);
  const urlRegex = /https:\/\/ssagro\.com\.br\/blog-ss-agro-([^"',\s\\]+)/g;
  const urls = [...new Set([...slice.matchAll(urlRegex)].map(m => m[0]))];

  console.log(`Processing ${sec.edition}: found ${urls.length} URLs`);

  urls.forEach((url, idx) => {
    const slug = url.replace('https://ssagro.com.br/blog-ss-agro-', '');
    
    // Find text near URL
    let pos = slice.indexOf(url);
    let title = '';

    if (pos !== -1) {
      const windowStr = slice.substring(Math.max(0, pos - 2800), Math.min(slice.length, pos + 500));
      const texts = [...windowStr.matchAll(/"A":\["([^"]+)"\]/g)].map(m => cleanTitle(m[1]));
      
      const candidates = texts.filter(t => 
        t.length > 25 && 
        !t.startsWith('http') && 
        !t.includes('{') && 
        !t.includes('Copyright') &&
        t !== 'Saiba mais'
      );

      if (candidates.length > 0) {
        title = candidates[0];
      }
    }

    if (!title || title.length < 15) {
      title = titleFromSlug(slug);
    }

    // Build subtitle / lead
    const category = detectCategory(title, slug);
    const image = getImageForTopic(title, category);
    
    // Stagger dates within edition
    let dateStr = sec.defaultDate;
    const day = (1 + (idx * 3) % 27).toString().padStart(2, '0');
    if (sec.edition.includes('2026 - Parte 2')) {
      const month = (idx % 2 === 0) ? '10' : '09';
      dateStr = `2026-${month}-${day}`;
    } else if (sec.edition.includes('2026 - Parte 1')) {
      const month = (idx % 3 === 0) ? '06' : (idx % 3 === 1 ? '04' : '02');
      dateStr = `2026-${month}-${day}`;
    } else {
      const month = (idx % 3 === 0) ? '11' : (idx % 3 === 1 ? '08' : '04');
      dateStr = `2025-${month}-${day}`;
    }

    const views = 240 + Math.floor(Math.random() * 450);
    const readMinutes = 3 + Math.floor(Math.random() * 4);

    allExtractedPosts.push({
      id: `post-${postIdCounter++}`,
      slug: slug,
      title: title,
      subtitle: `Análise estratégica para distribuidores de insumos e produtores rurais sobre ${title.toLowerCase()}.`,
      category: category,
      edition: sec.edition,
      image: image,
      createdAt: dateStr,
      readTime: `${readMinutes} min de leitura`,
      author: 'Equipe de Inteligência SS Agro',
      published: true,
      featured: (postIdCounter === 2), // First post is featured
      views: views,
      viewsHistory: [
        Math.floor(views * 0.12),
        Math.floor(views * 0.15),
        Math.floor(views * 0.18),
        Math.floor(views * 0.14),
        Math.floor(views * 0.20),
        Math.floor(views * 0.21),
        Math.floor(views * 0.16)
      ],
      content: [
        `O acompanhamento contínuo dos fatores que influenciam o agronegócio é fundamental para tomadas de decisão ágeis e assertivas no campo e na revenda. Em relação a "${title}", especialistas destacam a relevância do planejamento antecipado e da assistência técnica no suporte ao produtor rural.`,
        `Para distribuidores e cooperativas, entender as nuances de "${title}" permite desenhar estratégias comerciais sólidas, estruturar operações financeiras inteligentes (como Barter e CPR) e garantir a competitividade do negócio na safra.`,
        `A SS Agro Sistemas de Gestão acompanha de perto cada movimento de mercado, fornecendo ferramentas de ERP e Inteligência de Dados para transformar desafios operacionais em rentabilidade e segurança para toda a cadeia produtiva.`
      ]
    });
  });
});

console.log(`\nTOTAL POSTS GENERATED: ${allExtractedPosts.length}`);
fs.writeFileSync('scratch/all_complete_ssagro_posts.json', JSON.stringify(allExtractedPosts, null, 2), 'utf8');
