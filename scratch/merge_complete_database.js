const fs = require('fs');

// 1. Carregar os 4 artigos originais completos
const orig4 = [
  {
    id: 'post-1',
    slug: 'el-nino-agressivo-janela-plantio',
    title: 'El Niño Agressivo no Horizonte: Como a Distribuição de Insumos Deve Orientar a Janela de Plantio',
    subtitle: 'A previsibilidade climática ruiu, e a assistência técnica dos distribuidores será a principal ferramenta de blindagem do produtor contra extremos climáticos na safra.',
    category: 'Clima e Plantio',
    edition: 'SSAGRO 2026 - Parte 2',
    image: 'assets/blog-elnino.jpg',
    createdAt: '2026-10-15',
    readTime: '4 min de leitura',
    author: 'Equipe de Inteligência Agronômica SS Agro',
    published: true,
    featured: true,
    views: 492,
    viewsHistory: [58, 64, 71, 68, 79, 84, 68],
    content: [
      'O monitoramento meteorológico global emitiu um dos alertas mais enfáticos dos últimos ciclos: as projeções climáticas atualizadas indicam que o fenômeno El Niño superou 90% de probabilidade de atingir uma intensidade severa, com fortes indicativos de permanência até o primeiro semestre do próximo ano. Essa configuração altera de forma drástica a dinâmica de chuvas no território brasileiro, projetando precipitações excessivas e concentradas na Região Sul, ao mesmo tempo em que eleva substancialmente o risco de estiagens prolongadas, ondas de calor e chuvas irregulares no Centro-Oeste, Norte e Matopiba.',
      'Para o setor de distribuição de insumos agrícolas, esse panorama não representa apenas um dado meteorológico, mas sim uma mudança completa de estratégia comercial e consultiva junto aos agricultores. O ciclo de plantio de grãos exige estabilidade de umidade no solo para a germinação uniforme e o estabelecimento inicial do estande de plantas. Com a ameaça de veranicos precoces no Cerrado e encharcamento no Sul, o calendário de semeadura não poderá ser conduzido por métodos empíricos tradicionais.',
      'Nesse contexto, os distribuidores assumem o papel indispensável de orientadores técnicos de campo. A recomendação precisa se concentrar na diversificação de cultivares, combinando ciclos precoces, médios e tardios para diluir o risco climático da lavoura ao longo das semanas. O produtor precisará de lotes de sementes com vigor excepcional para suportar eventuais períodos de estresse súbito logo após a deposição no sulco.',
      'Além da genética vegetal, a nutrição e o condicionamento de solo ganham status emergencial. Solos com bom perfil radicular suportam com muito mais resiliência os dias de estiagem extrema. O fornecimento de condicionadores de solo, remineralizadores, fontes de cálcio e boro em profundidade, além do aporte preventivo de bioestimulantes à base de aminoácidos e extratos de algas, passam a ser os principais defensores fisiológicos das lavouras.',
      'Outro ponto nevrálgico envolve a logística de entrega dos distribuidores. Regiões com excesso de chuva podem enfrentar estradas vicinais intransitáveis e janelas operacionais de aplicação extremamente estreitas, exigindo que os defensivos e adubos de cobertura já estejam estocados nos galpões das fazendas bem antes da entrada do maquinário. A agilidade nas decisões e entregas será a linha divisória entre a sanidade vegetal e o prejuízo operacional.',
      'Diante do cenário desenhado, as revendas e revendedores não devem se posicionar como simples entregadores de produtos, mas sim como verdadeiros parceiros de gestão de risco. A integração entre dados climáticos, recomendação de tecnologias que atenuam estresse abiótico e alinhamento de cronograma operacional será o divisor de águas para garantir que as lavouras atravessem a força do El Niño com rentabilidade e alta produtividade.'
    ]
  },
  {
    id: 'post-2',
    slug: 'nova-legislacao-fertilizantes-nacionais',
    title: 'Nova Legislação de Fertilizantes Nacionais: O Que Muda para o Estoque e as Margens dos Distribuidores',
    subtitle: 'A nova política de incentivo à indústria nacional de fertilizantes e bioinsumos redefine a formação de estoques e descentraliza as margens comerciais na distribuição.',
    category: 'Análises de Mercado',
    edition: 'SSAGRO 2026 - Parte 2',
    image: 'assets/blog-fertilizantes.jpg',
    createdAt: '2026-10-12',
    readTime: '5 min de leitura',
    author: 'Consultoria Tributária & Mercado SS Agro',
    published: true,
    featured: false,
    views: 358,
    viewsHistory: [42, 48, 55, 50, 61, 58, 44],
    content: [
      'A sanção do novo marco regulatório do Plano Nacional de Fertilizantes (PNF) representa um divisor de águas na arquitetura tributária e mercadológica do agronegócio nacional. Historicamente dependente de mais de 85% de matérias-primas importadas para atender a adubação de suas safras, o Brasil agora passa a contar com um conjunto articulado de incentivos fiscais, desonerações de PIS/Cofins na cadeia fabril e linhas de crédito subsidiadas para plantas industriais de NPK, micronutrientes e biofertilizantes em território nacional.',
      'Para os distribuidores de insumos agrícolas, as consequências são amplas e imediatas. Em primeiro lugar, há uma transformação direta na estratégia de formação de estoques. Com a perspectiva de um abastecimento interno mais constante e menor exposição ao risco de fretes internacionais e flutuações cambiais, o distribuidor ganha previsibilidade na hora de firmar pedidos com as indústrias para abastecer a pré-safra.',
      'No entanto, a transição exigirá extremo rigor fiscal e de conformidade. A nova regulamentação condiciona benefícios fiscais ao cumprimento de rígidos requisitos de rastreabilidade do produto, desde a síntese da matéria-prima até a emissão da Nota Fiscal Eletrônica de venda direta ao produtor. Revendas com sistemas legados ou controle manual de lotes correm sério risco de autuações ou de perder a competitividade tributária perante concorrentes digitalizados.',
      'Outro impacto determinante reside na pressão sobre as margens comerciais. Com o avanço das indústrias nacionais de fertilizantes especiais e organominerais, a diferenciação no balcão não se dará apenas pelo volume ou pelo preço da tonelada da fórmula básica. O distribuidor que souber compor pacotes tecnológicos associando adubação mineral inteligente com bioinsumos de liberação gradual capturará maior valor agregado por hectare cultivado.',
      'Em suma, a nova legislação de fertilizantes premia a gestão moderna. Ter visibilidade em tempo real do custo médio ponderado do estoque, da carga tributária estadual incidente em cada operação de interestadualidade e da rentabilidade real por cliente será a bússola para navegar neste novo e promissor ciclo do agronegócio.'
    ]
  },
  {
    id: 'post-3',
    slug: 'manejo-fisiologico-protecao-termica',
    title: 'Manejo Fisiológico e Proteção Térmica: A Nova Fronteira do Portfólio para Proteger o Potencial Produtivo da Safra',
    subtitle: 'Como as novas formulações de protetores solares foliares e bioestimulantes à base de aminoácidos estão evitando o abortamento floral e elevando a produtividade.',
    category: 'Inovações Tecnológicas',
    edition: 'SSAGRO 2026 - Parte 2',
    image: 'assets/blog-manejo.jpg',
    createdAt: '2026-10-08',
    readTime: '4 min de leitura',
    author: 'Pesquisa & Desenvolvimento SS Agro',
    published: true,
    featured: false,
    views: 297,
    viewsHistory: [35, 40, 48, 42, 52, 47, 33],
    content: [
      'A elevação frequente das temperaturas médias durante as fases críticas de florescimento e enchimento de grãos tem se consolidado como um dos maiores gargalos da produtividade agrícola brasileira. Quando o termômetro ultrapassa os 34 °C em momentos em que a planta está definindo o número de vagens ou espiguetas, a respiração celular se acelera em detrimento da fotossíntese líquida, provocando o fechamento estomático e o temido abortamento reprodutivo.',
      'Para mitigar essas perdas silenciosas, o mercado de insumos testemunha uma verdadeira corrida por soluções de manejo fisiológico e proteção térmica. Trata-se de uma categoria que vai muito além dos fertilizantes foliares convencionais, envolvendo protetores solares agrícolas à base de partículas minerais micronizadas (como caulinita processada) associados a precursores de prolina, glicina-betaína e bioestimulantes hormonais.',
      'Essas substâncias atuam como um escudo biológico: reduzem a temperatura foliar da copa em até 3 °C a 4 °C sob radiação extrema e mantêm o metabolismo celular ativo mesmo sob estresse hídrico moderado. Nas lavouras de soja e milho safrinha onde essa tecnologia foi aplicada preventivamente antes dos períodos críticos, ensaios a campo registraram retenção floral significativamente superior e incremento produtivo de 4 a 8 sacas por hectare.',
      'Para a distribuição de insumos, o manejo fisiológico representa uma excelente oportunidade de diversificação de portfólio e aumento de margem. No entanto, o sucesso comercial depende intrinsecamente da capacitação agronômica do time de campo. O momento da recomendação (timing de aplicação) e a tecnologia de aplicação (tamanho de gota e cobertura) são determinantes para a resposta biológica.',
      'A tecnologia é indispensável, mas a capacitação técnica para orientar o agricultor é o que verdadeiramente constrói fidelização duradoura e consolida o distribuidor como autoridade agronômica de referência regional.'
    ]
  },
  {
    id: 'post-4',
    slug: 'consumo-interno-milho-aquecido-barter',
    title: 'Consumo Interno de Milho Aquecido e Cautela na Comercialização: O Impacto nas Operações de Barter e Insumos da Safrinha',
    subtitle: 'Com as indústrias de etanol de milho e rações demandando mais grão no Centro-Oeste, produtores seguram vendas e forçam revendas a recalibrar os contratos de troca.',
    category: 'Mercado & Barter',
    edition: 'SSAGRO 2026 - Parte 2',
    image: 'assets/blog-milho.jpg',
    createdAt: '2026-10-04',
    readTime: '5 min de leitura',
    author: 'Especialistas em Grãos & Barter SS Agro',
    published: true,
    featured: false,
    views: 418,
    viewsHistory: [52, 60, 68, 59, 74, 69, 36],
    content: [
      'A consolidação de gigantescas usinas de etanol de milho em polos estratégicos de Goiás, Mato Grosso e Mato Grosso do Sul transformou estruturalmente a dinâmica de comercialização do cereal no Brasil Central. O grão que antes tinha como destino quase exclusivo os terminais portuários de Santos ou Paranaguá agora encontra compradores vorazes a poucos quilômetros das fazendas, sustentando os prêmios locais e alterando a sazonalidade histórica de preços.',
      'Com esse cenário de demanda firme e estoques de passagem mais ajustados, o produtor rural adota uma postura de maior cautela na fixação antecipada da sua produção. Esse comportamento reflete diretamente no ritmo das operações de Barter (troca de insumos por grãos futuros), que tradicionalmente financiam a maior parte dos fertilizantes, sementes e defensivos da safrinha.',
      'Diante da relutância dos agricultores em travar contratos antecipados com bases conservadoras, os distribuidores de insumos enfrentam o desafio de equilibrar a meta de vendas com a gestão de risco de crédito e mercado. Fechar operações a descoberto sem o devido hedge ou sem a emissão de CPRs financeiras devidamente registradas representa um risco inaceitável no agronegócio contemporâneo.',
      'As revendas de maior sucesso estão investindo fortemente em estruturas profissionais de mesa de originação e barter digital. Utilizando ferramentas que integram a cotação de insumos com a curva futura do milho na B3 e na CME (Chicago), essas empresas conseguem desenhar estruturas flexíveis de troca — incluindo opções de participação na alta (contratos com piso garantido) —, destravando as decisões de compra dos clientes.',
      'O novo mercado do milho exige que os distribuidores operem com sofisticação financeira aliada à excelência agronômica. Quem dominar essa sinergia liderará a comercialização de insumos nas safrinhas dos próximos anos.'
    ]
  }
];

// 2. Carregar as 152 matérias do acervo Canva e adicionar imagens correspondentes
const currentPosts = JSON.parse(fs.readFileSync('data/blog.json', 'utf-8'));

function assignSmartImage(p) {
  const cat = (p.category || '').toLowerCase();
  const title = (p.title || '').toLowerCase();

  // Se já tiver uma das 4 imagens oficiais exatas, manter
  if (p.image === 'assets/blog-elnino.jpg' || p.image === 'assets/blog-fertilizantes.jpg' || p.image === 'assets/blog-manejo.jpg' || p.image === 'assets/blog-milho.jpg') {
    return p.image;
  }

  // Se fala de fertilizantes / adubo / químico / bioinsumo / indústria
  if (title.includes('fertilizante') || title.includes('adubo') || title.includes('nitrogênio') || title.includes('fósforo') || title.includes('potássio') || title.includes('ureia') || cat.includes('indústria') || cat.includes('política')) {
    return 'assets/blog-fertilizantes.jpg';
  }

  // Se fala de milho / grãos / barter / mercado / cotação / preço / chicago / exportação / venda
  if (title.includes('milho') || title.includes('chicago') || title.includes('preço') || title.includes('cotação') || title.includes('barter') || title.includes('mercado') || cat.includes('barter') || cat.includes('mercado')) {
    return 'assets/blog-milho.jpg';
  }

  // Se fala de manejo / defensivo / inseticida / fungicida / tecnologia / semente / bioestimulante / praga / lagarta / percevejo
  if (title.includes('manejo') || title.includes('defensivo') || title.includes('inseticida') || title.includes('fungicida') || title.includes('lagarta') || title.includes('percevejo') || title.includes('semente') || title.includes('biológico') || cat.includes('tecnologia') || cat.includes('inovação')) {
    return 'assets/blog-manejo.jpg';
  }

  // Se fala de clima / chuva / seca / calor / el niño / geada / plantio / solo
  if (title.includes('clima') || title.includes('chuva') || title.includes('seca') || title.includes('calor') || title.includes('el niño') || title.includes('plantio') || title.includes('solo') || cat.includes('clima') || cat.includes('plantio')) {
    return 'assets/blog-elnino.jpg';
  }

  // Se fala de gestão / tributário / fiscal / crédito / financiamento / cra / lca
  if (title.includes('tribut') || title.includes('gestão') || title.includes('crédito') || title.includes('financi') || title.includes('cra') || title.includes('fiscal') || cat.includes('tributário') || cat.includes('gestão')) {
    return 'assets/dashboard-gestao-financeira.png';
  }

  // Armazenagem e silos
  if (title.includes('armaz') || title.includes('silo') || cat.includes('armaz')) {
    return 'assets/seg-armazenagem-graos.jpg';
  }

  return 'assets/blog-elnino.jpg';
}

// 3. Montar lista consolidada: os 4 artigos originais no topo (como o usuário mostrou no print), seguidos pelos demais artigos
const combined = [...orig4];
const seenSlugs = new Set(orig4.map(p => p.slug));

for (const p of currentPosts) {
  // Evitar duplicar os 4 principais
  if (p.slug.includes('el-nino') || p.slug.includes('fertilizantes-nacionais') || p.slug.includes('manejo-fisiologico') || p.slug.includes('consumo-interno-milho')) {
    continue;
  }
  if (!seenSlugs.has(p.slug)) {
    seenSlugs.add(p.slug);
    p.image = assignSmartImage(p);
    combined.push(p);
  }
}

console.log('Total combinado de matérias:', combined.length);
console.log('Top 4 matérias:');
combined.slice(0, 4).forEach((p, idx) => console.log(`  ${idx+1}. [${p.edition}] ${p.title} => Img: ${p.image} | Destaque: ${p.featured}`));

// 4. Salvar data/blog.json
fs.writeFileSync('data/blog.json', JSON.stringify(combined, null, 2), 'utf-8');
console.log('data/blog.json salvo com sucesso!');

// 5. Atualizar blog-data.js com os DEFAULT_BLOG_POSTS
const blogDataCode = `/**
 * ============================================================================
 * SS AGRO - CAMADA DE DADOS E INTEGRAÇÃO DO BLOG (blog-data.js)
 * ============================================================================
 * Acervo completo sincronizado com o blog oficial SS Agro (2025 e 2026).
 * Suporte a listagem, filtros por edição, pesquisa, views em tempo real e fallback.
 */

const SSAGRO_STORAGE_KEY = 'ssagro_blog_posts_v21';

const DEFAULT_BLOG_POSTS = ${JSON.stringify(combined, null, 2)};

function getLocalPosts() {
  try {
    const raw = localStorage.getItem(SSAGRO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}
  return DEFAULT_BLOG_POSTS;
}

function setLocalPosts(posts) {
  try {
    localStorage.setItem(SSAGRO_STORAGE_KEY, JSON.stringify(posts));
  } catch (_) {}
}

function slugifyText(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDateBR(dateStr) {
  if (!dateStr) return '';
  const parts = String(dateStr).split('T')[0].split('-');
  if (parts.length !== 3) return dateStr;
  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];
  const ano = parts[0];
  const mesIdx = parseInt(parts[1], 10) - 1;
  const dia = parts[2];
  return \`\${dia} de \${meses[mesIdx] || parts[1]}, \${ano}\`;
}

const SSAgroBlog = {
  formatDateBR,
  slugifyText,

  async getPosts() {
    try {
      const res = await fetch('/api/posts', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setLocalPosts(data);
          return data;
        }
      }
    } catch (_) {}
    return getLocalPosts();
  },

  async getPublishedPosts() {
    const all = await this.getPosts();
    return all.filter((p) => p.published !== false);
  },

  async getPostByKey(key) {
    const all = await this.getPosts();
    if (!key) return all[0] || null;
    return (
      all.find((p) => p.slug === key || p.id === key) ||
      all.find((p) => p.published !== false) ||
      all[0] ||
      null
    );
  },

  async recordView(key) {
    try {
      const res = await fetch(\`/api/posts/\${encodeURIComponent(key)}/view\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const result = await res.json();
        if (result && result.post) {
          const all = getLocalPosts();
          const idx = all.findIndex((p) => p.id === result.post.id || p.slug === result.post.slug);
          if (idx !== -1) {
            all[idx] = result.post;
            setLocalPosts(all);
          }
          return result.post;
        }
      }
    } catch (_) {}

    const all = getLocalPosts();
    const post = all.find((p) => p.slug === key || p.id === key);
    if (post) {
      post.views = (parseInt(post.views, 10) || 0) + 1;
      if (!Array.isArray(post.viewsHistory) || post.viewsHistory.length === 0) {
        post.viewsHistory = [10, 12, 14, 15, 18, 20, post.views];
      } else {
        post.viewsHistory[post.viewsHistory.length - 1] += 1;
      }
      setLocalPosts(all);
      return post;
    }
    return null;
  },

  async savePost(postData) {
    const all = await this.getPosts();
    const isExisting = postData.id && all.some((p) => p.id === postData.id);

    if (!postData.slug) {
      postData.slug = slugifyText(postData.title) || \`noticia-\${Date.now()}\`;
    }

    if (isExisting) {
      try {
        const res = await fetch(\`/api/posts/\${encodeURIComponent(postData.id)}\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        });
        if (res.ok) {
          const data = await res.json();
          await this.getPosts();
          return data.post;
        }
      } catch (_) {}

      const idx = all.findIndex((p) => p.id === postData.id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...postData };
        setLocalPosts(all);
        return all[idx];
      }
    } else {
      const newPost = {
        id: \`post-\${Date.now()}\`,
        createdAt: new Date().toISOString().slice(0, 10),
        readTime: '4 min de leitura',
        author: 'Equipe SS Agro',
        published: true,
        featured: false,
        views: 0,
        viewsHistory: [0, 0, 0, 0, 0, 0, 0],
        ...postData
      };

      try {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost)
        });
        if (res.ok) {
          const data = await res.json();
          await this.getPosts();
          return data.post;
        }
      } catch (_) {}

      all.unshift(newPost);
      setLocalPosts(all);
      return newPost;
    }
  },

  async deletePost(id) {
    try {
      const res = await fetch(\`/api/posts/\${encodeURIComponent(id)}\`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await this.getPosts();
        return true;
      }
    } catch (_) {}

    const all = getLocalPosts().filter((p) => p.id !== id && p.slug !== id);
    setLocalPosts(all);
    return true;
  },

  async uploadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              dataUrl
            })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              resolve(data.url);
              return;
            }
          }
        } catch (_) {}
        resolve(dataUrl);
      };
      reader.onerror = () => reject(new Error('Erro ao ler imagem'));
      reader.readAsDataURL(file);
    });
  },

  async resetToDefaults() {
    const defaults = JSON.parse(JSON.stringify(DEFAULT_BLOG_POSTS));
    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaults)
      });
    } catch (_) {}
    setLocalPosts(defaults);
    return defaults;
  }
};

window.SSAgroBlog = SSAgroBlog;
`;

fs.writeFileSync('blog-data.js', blogDataCode, 'utf-8');
console.log('blog-data.js salvo com sucesso!');
