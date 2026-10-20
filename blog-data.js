/**
 * ============================================================================
 * SS AGRO - CAMADA DE DADOS E INTEGRAÇÃO DO BLOG (blog-data.js)
 * ============================================================================
 * Explicação simples para programador júnior:
 * Este arquivo centraliza todas as operações do Blog:
 * 1. Busca as notícias da API local (/api/posts) que salva em data/blog.json.
 * 2. Também sincroniza com o localStorage do navegador como backup automático.
 * 3. Contabiliza +1 leitura sempre que alguém abre uma matéria em artigo.html.
 * 4. Permite ao Painel Gerencial (admin.html) criar, editar, ocultar e excluir
 *    notícias e acompanhar o gráfico de leituras em tempo real.
 */

const SSAGRO_STORAGE_KEY = 'ssagro_blog_posts_v1';

const DEFAULT_BLOG_POSTS = [
  {
    id: 'post-1',
    slug: 'el-nino-agressivo-janela-plantio',
    title:
      'El Niño Agressivo no Horizonte: Como a Distribuição de Insumos Deve Orientar a Janela de Plantio',
    subtitle:
      'A previsibilidade climática ruiu, e a assistência técnica dos distribuidores será a principal ferramenta de blindagem do produtor contra extremos climáticos na safra.',
    category: 'Clima e Plantio',
    image: 'assets/blog-1.jpg',
    createdAt: '2026-10-15',
    readTime: '4 min de leitura',
    author: 'Equipe de Inteligência Agronômica SS Agro',
    published: true,
    featured: true,
    views: 482,
    viewsHistory: [58, 64, 71, 68, 79, 84, 58],
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
    title:
      'Nova Legislação de Fertilizantes Nacionais: O Que Muda para o Estoque e as Margens dos Distribuidores',
    subtitle:
      'A nova política de incentivo à indústria nacional de fertilizantes e bioinsumos redefine a formação de estoques e descentraliza as margens comerciais na distribuição.',
    category: 'Análises de Mercado',
    image: 'assets/blog-2.jpg',
    createdAt: '2026-10-12',
    readTime: '5 min de leitura',
    author: 'Consultoria Tributária & Mercado SS Agro',
    published: true,
    featured: false,
    views: 356,
    viewsHistory: [42, 48, 51, 55, 49, 61, 50],
    content: [
      'A sanção e regulamentação da nova legislação federal que estabelece um programa abrangente para fortalecer e ampliar a capacidade de produção nacional de fertilizantes marca um ponto de virada histórico para o agronegócio do país. O plano contempla incentivos tributários, linhas de financiamento para modernização de fábricas locais e desonerações direcionadas não apenas aos macronutrientes minerais clássicos, mas também a fertilizantes sintéticos, de origem orgânica e ao setor em franca expansão de bioinsumos.',
      'Essa medida incide diretamente sobre um dos calcanhares de Aquiles da agricultura tropical: a extrema vulnerabilidade às cotações internacionais e às oscilações logísticas marítimas de adubos nitrogenados, fosfatados e potássicos. Tradicionalmente dependente de mais de 80% de importação, o mercado nacional assiste agora ao desenho de uma cadeia de suprimentos mais próxima, ágil e competitiva.',
      'Para os distribuidores de insumos agrícolas, as consequências são amplas e imediatas. Em primeiro lugar, há uma transformação direta na estratégia de formação de estoques. Com a perspectiva de um abastecimento interno mais constante e menor exposição ao risco de fretes internacionais e flutuações cambiais, o distribuidor ganha previsibilidade na hora de firmar pedidos com as indústrias para abastecer a pré-safra.',
      'Além disso, a inclusão prioritária de adubos de fontes orgânicas, organominerais e bioinsumos dentro do programa abre uma janela de ouro para expansão de portfólio de alto valor agregado. Esses produtos, cada vez mais integrados ao manejo biológico e à saúde do solo, oferecem margens comerciais superiores para a revenda quando comparados aos fertilizantes minerais de commodities pura, cuja concorrência é acirrada e balizada em centavos de dólar.',
      'O relacionamento do distribuidor com o produtor rural também é fortalecido. Sabendo da existência de incentivos à produção fabril local, o agricultor exigirá do canal de distribuição soluções que combinem eficiência nutricional a preços mais equilibrados. Caberá à equipe comercial demonstrar a viabilidade técnica de blends nacionais, fertilizantes de liberação lenta e inoculantes que otimem a absorção de nutrientes no momento exato do plantio.',
      'Em última análise, a descentralização do fornecimento de fertilizantes reforça o papel do distribuidor como agente logístico e regulador de mercado regional. Aqueles que souberem estruturar parcerias antecipadas com novas indústrias nacionais e introduzirem tecnologias sustentáveis em sua prateleira sairão na frente, garantindo rentabilidade sustentada e protegendo o abastecimento das lavouras em seus polos de atuação.'
    ]
  },
  {
    id: 'post-3',
    slug: 'manejo-fisiologico-protecao-termica',
    title:
      'Manejo Fisiológico e Proteção Térmica: A Nova Fronteira do Portfólio para Proteger o Potencial Produtivo da Safra',
    subtitle:
      'Em um cenário de extremos térmicos, a proteção contra radiação e estresse fisiológico torna-se um insumo tão prioritário quanto a adubação de base.',
    category: 'Inovações Tecnológicas',
    image: 'assets/blog-3.jpg',
    createdAt: '2026-10-08',
    readTime: '4 min de leitura',
    author: 'Pesquisa & Desenvolvimento SS Agro',
    published: true,
    featured: false,
    views: 294,
    viewsHistory: [35, 39, 44, 41, 46, 48, 41],
    content: [
      'A agricultura de alta produtividade chegou a um ponto de inflexão em que as práticas convencionais de nutrição de solo e controle sanitário não são mais suficientes para garantir tetos produtivos elevados. Com ondas de calor mais frequentes, altos índices de radiação ultravioleta e períodos de estiagem intermitentes, o estresse térmico e hídrico tornou-se um dos principais fatores invisíveis de perda de rendimento, provocando abortamento floral, queima foliar (escaldadura) e interrupção prematura da fotossíntese.',
      'Para enfrentar essa realidade que castiga lavouras de soja, milho, algodão e HF, a indústria especializada vem expandindo soluções de vitalidade de ponta a ponta. O conceito envolve proteger a cultura desde o pré-plantio e emergência radicular até os estágios críticos de floração e enchimento de grãos, utilizando uma combinação de protetores de radiação solar, indutores de resistência e bioestimulantes de nutrição foliar avançada.',
      'Para o distribuidor de insumos agrícolas, essa abordagem não é mero detalhe técnico; trata-se da principal alavanca para construir pacotes tecnológicos diferenciados no balcão de vendas. Enquanto os químicos tradicionais muitas vezes sofrem com comoditização e compressão de margens, o portfólio de especialidades fisiológicas e protetores solares agrícolas oferece diferenciação competitiva e alta rentabilidade para a revenda.',
      'A introdução de barreiras minerais e tecnologias que reduzem a temperatura superficial das folhas em até 3°C a 5°C permite que a planta continue metabolizando e acumulando fotoassimilados mesmo em dias em que os termômetros superam os 35°C. Isso evita que a lavoura feche seus estômatos precocemente, preservando a taxa de transposição hídrica e a conversão de energia em vagens e espigas.',
      'Além da eficácia biológica, os distribuidores precisam evidenciar aos clientes a compatibilidade operacional dessas tecnologias. Os produtos modernos são formulados para permitir associação segura em tanque com fungicidas e inseticidas, sem entupir bicos ou quebrar emulsões, otimizando o custo operacional de cada entrada de pulverizador na fazenda.',
      'O desafio do distribuidor durante o ciclo de plantio é antecipar a demanda. Esperar que o estresse térmico se instale visualmente na lavoura para depois vender a solução reduz drasticamente o potencial de recuperação da planta. O posicionamento de venda consultiva deve focar na prevenção e no planejamento integrado, colocando o distribuidor como o arquiteto da blindagem fisiológica da lavoura.'
    ]
  },
  {
    id: 'post-4',
    slug: 'consumo-interno-milho-barter-safrinha',
    title:
      'Consumo Interno de Milho Aquecido e Cautela na Comercialização: O Impacto nas Operações de Barter e Insumos da Safrinha',
    subtitle:
      'A forte sustentação do consumo interno de milho cria a oportunidade ideal para o distribuidor estruturar operações de barter seguras e acelerar as vendas da safrinha.',
    category: 'Mercado & Barter',
    image: 'assets/blog-4.jpg',
    createdAt: '2026-10-04',
    readTime: '5 min de leitura',
    author: 'Especialistas em Grãos & Barter SS Agro',
    published: true,
    featured: false,
    views: 418,
    viewsHistory: [50, 56, 62, 59, 65, 68, 58],
    content: [
      'O mercado brasileiro de milho vivencia uma conjuntura singular no cenário de comercialização de grãos. A demanda doméstica pelo cereal permanece extremamente aquecida e robusta, impulsionada pelo crescimento contínuo da indústria de etanol à base de milho e pela firme demanda das cadeias de proteína animal (avicultura e suinocultura). No entanto, analistas de mercado apontam que os produtores continuam cautelosos e com ritmo de comercialização mais lento do que a média histórica, retendo lotes na expectativa de patamares de preços mais remuneradores.',
      'Essa postura de compasso de espera do agricultor repercute diretamente nos balcões das revendas de insumos agrícolas. Quando o produtor desacelera a venda dos seus grãos da safra disponível ou da futura, ele posterga simultaneamente a contratação e o fechamento dos pacotes de sementes, híbridos de milho, adubação de cobertura nitrogenada e defensivos necessários para a próxima safrinha.',
      'É exatamente nesse ponto que a inteligência financeira e de crédito do distribuidor precisa entrar em campo. Em vez de aguardar passivamente a decisão do cliente, o momento é ideal para desenhar e oferecer operações de barter flexíveis e bem estruturadas. Com o consumo interno sólido oferecendo um piso de suporte contra quedas desordenadas de preço, o risco da troca grão-insumo torna-se muito mais administrável.',
      'A estruturação de CPRs (Cédulas de Produto Rural) físicas ou financeiras atreladas a travas de preço pode destravar negociações que estavam congeladas. O distribuidor que possui parceria com tradings, usinas de etanol de milho regionais e cooperativas de proteína animal consegue intermediar a garantia de entrega da produção do cliente, convertendo o milho retido em adubo e híbridos de alta tecnologia colocados na fazenda.',
      'Ademais, garantir a encomenda de sementes de milho com antecedência é crucial para assegurar a janela ideal de plantio após a colheita da soja. Quem planta a safrinha fora do período ideal corre riscos climáticos drásticos com o fim das chuvas no outono. O atraso na compra pode resultar na falta de híbridos de ciclo superprecoce mais adaptados e demandados.',
      'Portanto, o canal de distribuição que conseguir alinhar assistência agronômica de ponta com engenharia financeira de proteção de preços (hedge e barter) conseguirá não apenas fechar negócios em um mercado travado, mas também blindar a carteira de recebíveis, convertendo a demanda interna de milho em solidez econômica para seus negócios.'
    ]
  }
];

function slugifyText(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function formatDateBR(isoDate) {
  if (!isoDate) return 'Outubro de 2026';
  const parts = String(isoDate).split('-');
  if (parts.length !== 3) return isoDate;
  const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez'
  ];
  const m = parseInt(parts[1], 10) - 1;
  return `${parts[2]} de ${months[m] || 'Out'}, ${parts[0]}`;
}

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
  return JSON.parse(JSON.stringify(DEFAULT_BLOG_POSTS));
}

function setLocalPosts(posts) {
  try {
    localStorage.setItem(SSAGRO_STORAGE_KEY, JSON.stringify(posts));
  } catch (_) {}
}

const SSAgroBlog = {
  slugify: slugifyText,
  formatDateBR,

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
    } catch (_) {
      // Fallback para localStorage caso aberto sem servidor
    }
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
      const res = await fetch(`/api/posts/${encodeURIComponent(key)}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const result = await res.json();
        if (result && result.post) {
          const all = getLocalPosts();
          const idx = all.findIndex(
            (p) => p.id === result.post.id || p.slug === result.post.slug
          );
          if (idx !== -1) {
            all[idx] = result.post;
            setLocalPosts(all);
          }
          return result.post;
        }
      }
    } catch (_) {}

    // Fallback no localStorage
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
      postData.slug = slugifyText(postData.title) || `noticia-${Date.now()}`;
    }

    if (isExisting) {
      try {
        const res = await fetch(`/api/posts/${encodeURIComponent(postData.id)}`, {
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
        id: `post-${Date.now()}`,
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
      const res = await fetch(`/api/posts/${encodeURIComponent(id)}`, {
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
