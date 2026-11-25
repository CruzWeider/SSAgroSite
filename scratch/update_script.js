const fs = require('fs');

let content = fs.readFileSync('script.js', 'utf8');

const startTarget = "  const blogGrid = document.getElementById('blogGrid');";
const endTarget = "        // Render inicial\r\n        renderFilteredPosts();";
const endTargetLF = "        // Render inicial\n        renderFilteredPosts();";

let startIndex = content.indexOf(startTarget);
let endIndex = content.indexOf(endTarget);
let endLen = endTarget.length;

if (endIndex === -1) {
  endIndex = content.indexOf(endTargetLF);
  endLen = endTargetLF.length;
}

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find start or end target:', { startIndex, endIndex });
  process.exit(1);
}

const replacement = `  const blogGrid = document.getElementById('blogGrid');
  const blogEditionsNav = document.getElementById('blogEditionsNav');
  const siteBlogSearchInput = document.getElementById('siteBlogSearchInput');
  const siteBlogSearchClear = document.getElementById('siteBlogSearchClear');
  const blogCategoryFilters = document.getElementById('blogCategoryFilters');
  const blogResultsCount = document.getElementById('blogResultsCount');
  const blogLoadMoreWrap = document.getElementById('blogLoadMoreWrap');
  const blogLoadMoreBtn = document.getElementById('blogLoadMoreBtn');
  const blogLoadMoreBadge = document.getElementById('blogLoadMoreBadge');

  if (blogGrid && window.SSAgroBlog) {
    window.SSAgroBlog.getPublishedPosts()
      .then((allPublishedPosts) => {
        if (!Array.isArray(allPublishedPosts) || allPublishedPosts.length === 0) {
          blogGrid.innerHTML = \`
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: rgba(19, 49, 77, 0.5); border-radius: 18px; border: 1px solid rgba(93, 224, 230, 0.2);">
              <p style="color: var(--ss-gray-muted); margin-bottom: 0;">Nenhuma notícia publicada no momento.</p>
            </div>
          \`;
          return;
        }

        // Ordena com Destaque no topo, depois as mais recentes pela data
        const sortedPosts = [...allPublishedPosts].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

        let selectedEdition = 'all';
        let selectedCategory = 'all';
        let searchQuery = '';
        let visibleLimit = 4; // Mostra 4 inicialmente, expandindo de 4 em 4

        // Função para atualizar os botões de categoria com base na edição selecionada
        function updateCategoryPills() {
          if (!blogCategoryFilters) return;

          // Matérias que atendem à edição atual
          const editionMatchedPosts = sortedPosts.filter((post) => {
            if (selectedEdition === 'all') return true;
            if (selectedEdition === 'SSAGRO 2026 - Parte 2') {
              return post.edition === 'SSAGRO 2026 - Parte 2' || post.createdAt?.startsWith('2026-09') || post.createdAt?.startsWith('2026-10');
            }
            if (selectedEdition === 'SSAGRO 2026 - Parte 1') {
              return post.edition === 'SSAGRO 2026 - Parte 1' || (post.createdAt?.startsWith('2026') && !post.createdAt?.startsWith('2026-09') && !post.createdAt?.startsWith('2026-10'));
            }
            if (selectedEdition === 'SSAGRO 2025') {
              return post.edition === 'SSAGRO 2025' || post.createdAt?.startsWith('2025');
            }
            return post.edition === selectedEdition;
          });

          // Extrai categorias únicas e contagens
          const catCounts = {};
          editionMatchedPosts.forEach((p) => {
            if (p.category) {
              catCounts[p.category] = (catCounts[p.category] || 0) + 1;
            }
          });

          const categories = Object.keys(catCounts);

          blogCategoryFilters.innerHTML = \`
            <button type="button" class="blog-pill-btn \${selectedCategory === 'all' ? 'active' : ''}" data-filter-cat="all">
              <span>✓ Todas (\${editionMatchedPosts.length})</span>
            </button>
            \${categories
              .map(
                (cat) => \`
              <button type="button" class="blog-pill-btn \${selectedCategory === cat ? 'active' : ''}" data-filter-cat="\${cat}">
                <span>\${cat} (\${catCounts[cat]})</span>
              </button>
            \`
              )
              .join('')}
          \`;
        }

        function renderFilteredPosts() {
          const query = searchQuery.trim().toLowerCase();

          // Atualiza botão de limpar busca
          if (siteBlogSearchClear) {
            siteBlogSearchClear.style.display = query ? 'inline-flex' : 'none';
          }

          const filtered = sortedPosts.filter((post) => {
            // Filtro por Edição Histórica (SSAGRO 2026 P2, P1 ou 2025)
            let matchEdition = true;
            if (selectedEdition !== 'all') {
              if (selectedEdition === 'SSAGRO 2026 - Parte 2') {
                matchEdition = post.edition === 'SSAGRO 2026 - Parte 2' || post.createdAt?.startsWith('2026-09') || post.createdAt?.startsWith('2026-10');
              } else if (selectedEdition === 'SSAGRO 2026 - Parte 1') {
                matchEdition = post.edition === 'SSAGRO 2026 - Parte 1' || (post.createdAt?.startsWith('2026') && !post.createdAt?.startsWith('2026-09') && !post.createdAt?.startsWith('2026-10'));
              } else if (selectedEdition === 'SSAGRO 2025') {
                matchEdition = post.edition === 'SSAGRO 2025' || post.createdAt?.startsWith('2025');
              } else {
                matchEdition = post.edition === selectedEdition;
              }
            }

            // Filtro por Categoria
            const matchCat =
              selectedCategory === 'all' || post.category === selectedCategory;

            // Busca textual inteligente (título, subtítulo, autor, categoria, edição e conteúdo)
            const fullText = \`\${post.title || ''} \${post.subtitle || ''} \${post.author || ''} \${
              post.category || ''
            } \${post.edition || ''} \${
              Array.isArray(post.content) ? post.content.join(' ') : post.content || ''
            }\`.toLowerCase();
            const matchSearch = !query || fullText.includes(query);

            return matchEdition && matchCat && matchSearch;
          });

          // Mostra a contagem de resultados
          if (blogResultsCount) {
            if (query || selectedEdition !== 'all' || selectedCategory !== 'all') {
              blogResultsCount.style.display = 'block';
              const showingCount = Math.min(filtered.length, query ? filtered.length : visibleLimit);
              blogResultsCount.innerHTML = \`Mostrando <strong>\${showingCount}</strong> de <strong>\${filtered.length}</strong> notícia(s) encontrada(s)\${
                query ? \` para "<em>\${searchQuery}</em>"\` : ''
              }.\`;
            } else {
              blogResultsCount.style.display = 'block';
              const showingCount = Math.min(filtered.length, visibleLimit);
              blogResultsCount.innerHTML = \`Exibindo <strong>\${showingCount}</strong> de <strong>\${filtered.length}</strong> matérias do acervo.\`;
            }
          }

          if (filtered.length === 0) {
            blogGrid.innerHTML = \`
              <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: rgba(19, 49, 77, 0.4); border-radius: 18px; border: 1px dashed rgba(93, 224, 230, 0.3);">
                <span style="font-size: 2.2rem; display: block; margin-bottom: 10px;">🔍</span>
                <p style="color: var(--ss-white); font-weight: 700; font-size: 1.05rem; margin-bottom: 6px;">Nenhuma notícia encontrada</p>
                <p style="color: var(--ss-gray-muted); font-size: 0.9rem; margin-bottom: 16px;">Tente pesquisar por outro termo ou selecione "Todas as Matérias".</p>
                <button type="button" class="btn btn--outline btn--sm" id="blogResetFiltersBtn" style="border-radius: var(--radius-pill);">
                  Restaurar Filtros de Busca
                </button>
              </div>
            \`;
            const resetBtn = document.getElementById('blogResetFiltersBtn');
            if (resetBtn) {
              resetBtn.addEventListener('click', () => {
                selectedEdition = 'all';
                selectedCategory = 'all';
                searchQuery = '';
                visibleLimit = 4;
                if (siteBlogSearchInput) siteBlogSearchInput.value = '';
                if (blogEditionsNav) {
                  blogEditionsNav.querySelectorAll('.blog-edition-tab').forEach((b) => b.classList.remove('active'));
                  const first = blogEditionsNav.querySelector('[data-edition="all"]');
                  if (first) first.classList.add('active');
                }
                updateCategoryPills();
                renderFilteredPosts();
              });
            }
            if (blogLoadMoreWrap) blogLoadMoreWrap.style.display = 'none';
            return;
          }

          // Se estiver pesquisando por texto, exibe todos os resultados para comodidade;
          // Se estiver navegando normalmente, pagina com o botão "Ver mais notícias"
          const slicePosts = query ? filtered : filtered.slice(0, visibleLimit);

          blogGrid.innerHTML = slicePosts
            .map((post, idx) => {
              const delayClass = \`delay-\${(idx % 4) + 1}\`;
              const safeTitle = String(post.title || '').replace(/"/g, '&quot;');
              const safeCat = String(post.category || 'Artigo').replace(/"/g, '&quot;');
              const viewsCount = Number(post.views || 0).toLocaleString('pt-BR');
              const isFeatured = Boolean(post.featured);
              const readTime =
                post.readTime ||
                window.SSAgroBlog.estimateReadTime(post.content, post.title, post.subtitle);
              const postDate =
                post.createdAt || post.publishedAt || new Date().toISOString().slice(0, 10);
              const editionLabel = post.edition
                ? post.edition.replace('SSAGRO ', '')
                : postDate.startsWith('2025')
                ? '2025'
                : '2026';

              return \`
                <a
                  href="artigo.html?slug=\${encodeURIComponent(post.slug)}"
                  class="blog-card spotlight-card reveal is-visible \${
                    isFeatured ? 'blog-card--featured' : ''
                  } \${delayClass}"
                >
                  <div class="blog-card__img">
                    <img src="\${post.image || 'assets/blog-1.jpg'}" alt="\${safeTitle}" loading="lazy" />
                    <span class="blog-card__tag">\${safeCat}</span>
                    <span style="position: absolute; bottom: 12px; left: 14px; background: rgba(9, 25, 40, 0.85); border: 1px solid rgba(93, 224, 230, 0.35); color: var(--ss-white); font-size: 0.72rem; font-weight: 700; padding: 3px 9px; border-radius: 12px; backdrop-filter: blur(8px);">
                      \${editionLabel}
                    </span>
                    \${isFeatured ? '<span class="blog-card__featured-tag">⭐ Destaque</span>' : ''}
                  </div>
                  <div class="blog-card__body">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 0.76rem; color: var(--ss-gray-muted); margin-bottom: 8px;">
                      <span>📅 \${window.SSAgroBlog.formatDateBR(postDate)}</span>
                      <span style="color: var(--ss-cyan); font-weight: 600;">⏱️ \${readTime}</span>
                    </div>
                    <h3 class="blog-card__title">\${post.title}</h3>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; font-size: 0.82rem;">
                      <span style="color: var(--ss-gray-muted);">👁️ \${viewsCount} leituras</span>
                      <div class="blog-card__more" style="margin-top: 0;">
                        Ler artigo completo <span>→</span>
                      </div>
                    </div>
                  </div>
                </a>
              \`;
            })
            .join('');

          // Ativa o efeito Spotlight nos cards
          blogGrid.querySelectorAll('.spotlight-card').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
              const rect = card.getBoundingClientRect();
              card.style.setProperty('--mouse-x', \`\${e.clientX - rect.left}px\`);
              card.style.setProperty('--mouse-y', \`\${e.clientY - rect.top}px\`);
            });
          });

          // Controle do botão "Ver mais notícias" (Fiel ao print do usuário)
          if (blogLoadMoreWrap) {
            if (!query && filtered.length > visibleLimit) {
              blogLoadMoreWrap.style.display = 'block';
              const remaining = filtered.length - visibleLimit;
              blogLoadMoreWrap.innerHTML = \`
                <button type="button" class="blog-load-more-pill" id="blogLoadMoreBtn">
                  <span>Ver mais notícias</span>
                  <span class="blog-load-more-badge" id="blogLoadMoreBadge">\${remaining} restantes ↓</span>
                </button>
              \`;
              const newBtn = document.getElementById('blogLoadMoreBtn');
              if (newBtn) {
                newBtn.addEventListener('click', () => {
                  visibleLimit += 4;
                  renderFilteredPosts();
                });
              }
            } else if (!query && filtered.length > 4 && visibleLimit >= filtered.length) {
              blogLoadMoreWrap.style.display = 'block';
              blogLoadMoreWrap.innerHTML = \`
                <div class="blog-all-loaded-msg">
                  <span>✓ Todas as \${filtered.length} notícias deste acervo foram exibidas.</span>
                </div>
              \`;
            } else {
              blogLoadMoreWrap.style.display = 'none';
            }
          }
        }

        // Listener das Abas de Edições (Site Antigo SS Agro destacado com setas vermelhas)
        if (blogEditionsNav) {
          blogEditionsNav.addEventListener('click', (e) => {
            const tab = e.target.closest('.blog-edition-tab');
            if (!tab) return;
            blogEditionsNav.querySelectorAll('.blog-edition-tab').forEach((b) => b.classList.remove('active'));
            tab.classList.add('active');
            selectedEdition = tab.getAttribute('data-edition') || 'all';
            selectedCategory = 'all'; // Reseta categoria para ver todas daquela edição
            visibleLimit = 4; // Reseta limite de exibição
            updateCategoryPills();
            renderFilteredPosts();
          });
        }

        // Listener do campo de pesquisa em tempo real
        if (siteBlogSearchInput) {
          siteBlogSearchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderFilteredPosts();
          });
        }

        // Listener do botão de limpar busca
        if (siteBlogSearchClear) {
          siteBlogSearchClear.addEventListener('click', () => {
            searchQuery = '';
            if (siteBlogSearchInput) {
              siteBlogSearchInput.value = '';
              siteBlogSearchInput.focus();
            }
            renderFilteredPosts();
          });
        }

        // Listener dos botões de categoria
        if (blogCategoryFilters) {
          blogCategoryFilters.addEventListener('click', (e) => {
            const btn = e.target.closest('.blog-pill-btn');
            if (!btn) return;
            blogCategoryFilters
              .querySelectorAll('.blog-pill-btn')
              .forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCategory = btn.getAttribute('data-filter-cat') || 'all';
            visibleLimit = 4;
            renderFilteredPosts();
          });
        }

        // Inicialização
        updateCategoryPills();
        renderFilteredPosts();`;

content = content.substring(0, startIndex) + replacement + content.substring(endIndex + endLen);
fs.writeFileSync('script.js', content, 'utf8');
console.log('script.js successfully updated!');
