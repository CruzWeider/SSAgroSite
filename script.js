/**
 * ============================================================================
 * SS AGRO - SCRIPTS DE INTERATIVIDADE, ROLAGEM (SCROLL) E EFEITOS DE MOUSE
 * ============================================================================
 * Este arquivo foi organizado de forma simples e didática para que qualquer
 * desenvolvedor entenda facilmente como cada efeito funciona.
 */

document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------------------------------------------
   * 1. BARRA DE PROGRESSO DE ROLAGEM E CABEÇALHO INTELIGENTE (SCROLL)
   * -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // Atualiza a largura da barra de progresso no topo
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // Adiciona o efeito de vidro mais escuro no menu quando rolar mais de 40px
    if (navbar) {
      if (scrollTop > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Destaca no menu superior a seção que está visível no momento (Scroll Spy)
    let currentSectionId = '';
    sections.forEach((sec) => {
      const sectionTop = sec.offsetTop - 160;
      const sectionHeight = sec.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute('href') === `#${currentSectionId}`;
      link.classList.toggle('active', isCurrent);
      if (isCurrent) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --------------------------------------------------------------------------
   * 2. MENU MOBILE (ABRIR / FECHAR NO CELULAR + ACESSIBILIDADE TECLADO)
   * -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinksContainer = document.getElementById('navLinks');

  if (mobileToggle && navLinksContainer) {
    const setMobileMenuState = (isOpen) => {
      navLinksContainer.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileToggle.setAttribute(
        'aria-label',
        isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
      );
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    };

    mobileToggle.addEventListener('click', () => {
      const isOpen = !navLinksContainer.classList.contains('open');
      setMobileMenuState(isOpen);
    });

    // Fecha o menu automaticamente ao clicar em qualquer link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        setMobileMenuState(false);
      });
    });

    // Fecha o menu ao pressionar a tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinksContainer.classList.contains('open')) {
        setMobileMenuState(false);
        mobileToggle.focus();
      }
    });
  }

  /* --------------------------------------------------------------------------
   * 3. ANIMAÇÃO DE ENTRADA NA ROLAGEM (SCROLL REVEAL COM INTERSECTION OBSERVER)
   * -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* --------------------------------------------------------------------------
   * 4. CONTADORES ANIMADOS (ESTATÍSTICAS QUE CONTAM QUANDO APARECEM NA TELA)
   * -------------------------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-counter]');
  let countersStarted = false;

  function animateCounters() {
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-counter'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      const startVal = parseInt(counter.getAttribute('data-start') || '0', 10);
      const duration = 1600; // duração de 1.6 segundos
      const startTime = performance.now();

      function updateCounter(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Fórmula de desaceleração suave (easeOutQuart)
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(startVal + (target - startVal) * easeOut);

        counter.textContent = `${current}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = `${target}${suffix}`;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const statsSection = document.querySelector('.stats-strip');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  }

  /* --------------------------------------------------------------------------
   * 5. EFEITO SPOTLIGHT (LUZ CIANO QUE SEGUE O PONTEIRO DO MOUSE NOS CARDS)
   * -------------------------------------------------------------------------- */
  const spotlightCards = document.querySelectorAll('.spotlight-card');

  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* --------------------------------------------------------------------------
   * 6. EFEITO 3D TILT SUAVE AO PASSAR O MOUSE (INCLINAÇÃO 3D INTERATIVA)
   * -------------------------------------------------------------------------- */
  const tiltElements = document.querySelectorAll('.tilt-card');

  tiltElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      // Desativa em telas pequenas (celulares)
      if (window.innerWidth < 900) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calcula rotação máxima de 4 graus para ficar elegante e sutil
      const rotateX = ((y - centerY) / centerY) * -3.5;
      const rotateY = ((x - centerX) / centerX) * 3.5;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  /* --------------------------------------------------------------------------
   * 7. ABAS INTERATIVAS DA SEÇÃO "NOSSAS SOLUÇÕES" (DESKTOP / BI / MOBILE)
   * -------------------------------------------------------------------------- */
  const tabButtons = document.querySelectorAll('.solution-tab-btn');
  const solutionPanels = document.querySelectorAll('.solution-panel');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      solutionPanels.forEach((panel) => panel.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const activePanel = document.getElementById(`panel-${targetTab}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
   * 8. FILTRO POR CATEGORIA DOS 16 MÓDULOS DO SS-AGRO ERP
   * -------------------------------------------------------------------------- */
  const filterChips = document.querySelectorAll('.filter-chip');
  const moduleCards = document.querySelectorAll('.module-card');

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const category = chip.getAttribute('data-filter');

      filterChips.forEach((c) => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-pressed', 'true');

      moduleCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.classList.remove('hidden');
          card.removeAttribute('aria-hidden');
          card.style.animation = 'fadeSlideIn 0.35s ease forwards';
        } else {
          card.classList.add('hidden');
          card.setAttribute('aria-hidden', 'true');
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
   * 9. PARALLAX SUAVE NAS LUZES DE FUNDO AO MOVER O MOUSE
   * -------------------------------------------------------------------------- */
  const orbCyan = document.querySelector('.ambient-orb--cyan');
  const orbRoyal = document.querySelector('.ambient-orb--royal');

  window.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX / window.innerWidth - 0.5) * 40;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 40;

    if (orbCyan) {
      orbCyan.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    if (orbRoyal) {
      orbRoyal.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
    }
  });

  /* --------------------------------------------------------------------------
   * 10. BANNER DE VÍDEO HIGGSFIELD COM PLAYLIST CONTÍNUA AUTOMÁTICA
   * -------------------------------------------------------------------------- */
  const heroVideos = [
    document.getElementById('heroVideo1'),
    document.getElementById('heroVideo2'),
    document.getElementById('heroVideo3'),
  ].filter(Boolean);

  if (heroVideos.length >= 2) {
    let currentVideoIdx = 0;
    let isTransitioning = false;

    function safePlay(vid) {
      if (!vid) return;
      vid.muted = true;
      try {
        vid.currentTime = 0;
      } catch (_) {}
      const p = vid.play();
      if (p !== undefined) {
        p.catch(() => {
          vid.muted = true;
          vid.play().catch(() => {});
        });
      }
    }

    function transitionToVideo(nextIdx) {
      if (isTransitioning || nextIdx === currentVideoIdx || !heroVideos[nextIdx]) return;
      isTransitioning = true;

      const prevVideo = heroVideos[currentVideoIdx];
      const nextVideo = heroVideos[nextIdx];

      safePlay(nextVideo);
      nextVideo.classList.add('active');
      if (prevVideo) prevVideo.classList.remove('active');

      currentVideoIdx = nextIdx;

      setTimeout(() => {
        if (prevVideo) {
          prevVideo.pause();
          try {
            prevVideo.currentTime = 0;
          } catch (_) {}
        }
        isTransitioning = false;
      }, 1200);
    }

    function transitionToNextVideo() {
      const nextIdx = (currentVideoIdx + 1) % heroVideos.length;
      transitionToVideo(nextIdx);
    }

    function checkVideoProgress() {
      if (isTransitioning) return;
      const activeVid = heroVideos[currentVideoIdx];
      if (!activeVid) return;

      if (activeVid.ended) {
        transitionToNextVideo();
        return;
      }

      if (
        activeVid.duration &&
        isFinite(activeVid.duration) &&
        activeVid.currentTime >= activeVid.duration - 0.55
      ) {
        transitionToNextVideo();
      }
    }

    heroVideos.forEach((vid) => {
      vid.addEventListener('ended', transitionToNextVideo);
      vid.addEventListener('timeupdate', checkVideoProgress);
    });

    setInterval(checkVideoProgress, 200);
    safePlay(heroVideos[0]);

    window.addEventListener(
      'scroll',
      () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY < window.innerHeight * 1.2) {
          const scale = 1.04 + (currentScrollY / window.innerHeight) * 0.06;
          const translateY = (currentScrollY * 0.16).toFixed(1);
          heroVideos.forEach((vid) => {
            vid.style.transform = `scale(${scale.toFixed(3)}) translateY(${translateY}px)`;
          });
        }
      },
      { passive: true }
    );
  }

  /* --------------------------------------------------------------------------
   * 10.1 RODAPÉ INTELIGENTE DO CONSOLE HERO (RECOMENDAÇÃO + CTA PERSONALIZADO)
   * -------------------------------------------------------------------------- */
  const smartPills = document.querySelectorAll('.hero-console__tab, .hero-smart-pill');
  const smartActionPanel = document.getElementById('heroSmartActionPanel');
  const smartTitle = document.getElementById('heroSmartTitle');
  const smartDesc = document.getElementById('heroSmartDesc');
  const smartCta = document.getElementById('heroSmartCta');
  const smartCtaText = document.getElementById('heroSmartCtaText');
  const heroPhoneDock = document.getElementById('heroPhoneDock');

  const smartProfiles = {
    insumos: {
      title: 'Controle de Lotes, Receituário Agronômico e Barter',
      desc: 'Compras, estoque físico e futuro, validade de sementes/defensivos, NF-e e comissões.',
      ctaText: 'Proposta p/ Insumos',
      whatsappUrl:
        'https://wa.me/5564984360638?text=Ol%C3%A1!%20Tenho%20uma%20Distribuidora%20de%20Insumos%20e%20quero%20conhecer%20o%20SS-Agro%20ERP.',
    },
    graos: {
      title: 'Pesagem de Balança, Romaneios, Contratos e Silos',
      desc: 'Entrada e saída de safra, descontos de umidade/impureza, tarifas e saldos de produtores.',
      ctaText: 'Proposta p/ Armazéns',
      whatsappUrl:
        'https://wa.me/5564984360638?text=Ol%C3%A1!%20Opero%20com%20Armazenagem%20e%20Origina%C3%A7%C3%A3o%20de%20Gr%C3%A3os%20e%20quero%20conhecer%20o%20SS-Agro%20ERP.',
    },
    mobile: {
      title: 'Pedidos no Campo, Limite de Crédito e Estoque Real',
      desc: 'App para celular e tablet 100% sincronizado ao ERP com consulta imediata de estoque e metas.',
      ctaText: 'Ver App Mobile',
      whatsappUrl:
        'https://wa.me/5564984360638?text=Ol%C3%A1!%20Quero%20conhecer%20o%20App%20For%C3%A7a%20de%20Vendas%20Mobile%20integrado%20ao%20SS-Agro%20ERP.',
    },
  };

  if (smartPills.length > 0) {
    smartPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const key = pill.getAttribute('data-profile');
        const data = key ? smartProfiles[key] : null;
        if (!data) return;

        smartPills.forEach((p) => {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');
        if (smartActionPanel && pill.id) {
          smartActionPanel.setAttribute('aria-labelledby', pill.id);
        }

        if (smartTitle) smartTitle.textContent = data.title;
        if (smartDesc) smartDesc.textContent = data.desc;
        if (smartCta) smartCta.setAttribute('href', data.whatsappUrl);
        if (smartCtaText) smartCtaText.textContent = data.ctaText;
        if (heroPhoneDock) {
          heroPhoneDock.classList.toggle('is-highlighted', key === 'mobile');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
   * 11. SISTEMA DINÂMICO DO BLOG SS AGRO (BUSCA, FILTROS E HISTÓRICO DE NOTÍCIAS)
   * --------------------------------------------------------------------------
   * Explicação simples para programador júnior:
   * - Busca as matérias da API (/api/posts) ou do banco local.
   * - Gera filtros dinâmicos por categoria com base nas matérias publicadas.
   * - Permite pesquisa em tempo real por palavra-chave no título e conteúdo.
   * - Exibe os 4 artigos iniciais e expande os artigos históricos com o botão
   *   "Ver mais notícias antigas".
   * -------------------------------------------------------------------------- */
  const blogGrid = document.getElementById('blogGrid');
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
          blogGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: rgba(19, 49, 77, 0.5); border-radius: 18px; border: 1px solid rgba(93, 224, 230, 0.2);">
              <p style="color: var(--ss-gray-muted); margin-bottom: 0;">Nenhuma notícia publicada no momento.</p>
            </div>
          `;
          return;
        }

        // Ordena com Destaque no topo, depois as mais recentes pela data
        const sortedPosts = [...allPublishedPosts].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

        let selectedCategory = 'all';
        let searchQuery = '';

        // Função para atualizar os botões de categoria
        function updateCategoryPills() {
          if (!blogCategoryFilters) return;

          const catCounts = {};
          sortedPosts.forEach((p) => {
            if (p.category) {
              catCounts[p.category] = (catCounts[p.category] || 0) + 1;
            }
          });

          const categories = Object.keys(catCounts);

          blogCategoryFilters.innerHTML = `
            <button type="button" class="blog-pill-btn ${selectedCategory === 'all' ? 'active' : ''}" data-filter-cat="all">
              <span>✓ Todas (${sortedPosts.length})</span>
            </button>
            ${categories
              .map(
                (cat) => `
              <button type="button" class="blog-pill-btn ${selectedCategory === cat ? 'active' : ''}" data-filter-cat="${cat}">
                <span>${cat} (${catCounts[cat]})</span>
              </button>
            `
              )
              .join('')}
          `;
        }

        function renderFilteredPosts() {
          const query = searchQuery.trim().toLowerCase();

          // Atualiza botão de limpar busca
          if (siteBlogSearchClear) {
            siteBlogSearchClear.style.display = query ? 'inline-flex' : 'none';
          }

          const filtered = sortedPosts.filter((post) => {
            // Filtro por Categoria
            const matchCat =
              selectedCategory === 'all' || post.category === selectedCategory;

            // Busca textual inteligente (título, subtítulo, autor, categoria e conteúdo)
            const fullText = `${post.title || ''} ${post.subtitle || ''} ${post.author || ''} ${
              post.category || ''
            } ${
              Array.isArray(post.content) ? post.content.join(' ') : post.content || ''
            }`.toLowerCase();
            const matchSearch = !query || fullText.includes(query);

            return matchCat && matchSearch;
          });

          // Mostra a contagem de resultados quando pesquisa ou filtra
          if (blogResultsCount) {
            if (query || selectedCategory !== 'all') {
              blogResultsCount.style.display = 'block';
              blogResultsCount.innerHTML = `Mostrando <strong>${filtered.length}</strong> notícia(s) encontrada(s)${
                query ? ` para "<em>${searchQuery}</em>"` : ''
              }.`;
            } else {
              blogResultsCount.style.display = 'none';
            }
          }

          if (filtered.length === 0) {
            blogGrid.innerHTML = `
              <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: rgba(19, 49, 77, 0.4); border-radius: 18px; border: 1px dashed rgba(93, 224, 230, 0.3);">
                <span style="font-size: 2.2rem; display: block; margin-bottom: 10px;">🔍</span>
                <p style="color: var(--ss-white); font-weight: 700; font-size: 1.05rem; margin-bottom: 6px;">Nenhuma notícia encontrada</p>
                <p style="color: var(--ss-gray-muted); font-size: 0.9rem; margin-bottom: 16px;">Tente pesquisar por outro termo ou selecione "Todas as Matérias".</p>
                <button type="button" class="btn btn--outline btn--sm" id="blogResetFiltersBtn" style="border-radius: var(--radius-pill);">
                  Restaurar Filtros de Busca
                </button>
              </div>
            `;
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
              const delayClass = `delay-${(idx % 4) + 1}`;
              const safeTitle = String(post.title || '').replace(/"/g, '&quot;');
              const safeCat = String(post.category || 'Artigo').replace(/"/g, '&quot;');
              const viewsCount = Number(post.views || 0).toLocaleString('pt-BR');
              const isFeatured = Boolean(post.featured);
              const readTime =
                post.readTime ||
                window.SSAgroBlog.estimateReadTime(post.content, post.title, post.subtitle);
              const postDate =
                post.createdAt || post.publishedAt || new Date().toISOString().slice(0, 10);

              return `
                <a
                  href="artigo.html?slug=${encodeURIComponent(post.slug)}"
                  class="blog-card spotlight-card reveal is-visible ${
                    isFeatured ? 'blog-card--featured' : ''
                  } ${delayClass}"
                >
                  <div class="blog-card__img">
                    <img src="${post.image || 'assets/blog-1.jpg'}" alt="${safeTitle}" loading="lazy" />
                    <span class="blog-card__tag">${safeCat}</span>
                    ${isFeatured ? '<span class="blog-card__featured-tag">⭐ Destaque</span>' : ''}
                  </div>
                  <div class="blog-card__body">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 0.76rem; color: var(--ss-gray-muted); margin-bottom: 8px;">
                      <span>📅 ${window.SSAgroBlog.formatDateBR(postDate)}</span>
                      <span style="color: var(--ss-cyan); font-weight: 600;">⏱️ ${readTime}</span>
                    </div>
                    <h3 class="blog-card__title">${post.title}</h3>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; font-size: 0.82rem;">
                      <span style="color: var(--ss-gray-muted);">👁️ ${viewsCount} leituras</span>
                      <div class="blog-card__more" style="margin-top: 0;">
                        Ler artigo completo <span>→</span>
                      </div>
                    </div>
                  </div>
                </a>
              `;
            })
            .join('');

          // Ativa o efeito Spotlight nos cards
          blogGrid.querySelectorAll('.spotlight-card').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
              const rect = card.getBoundingClientRect();
              card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
              card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });
          });

          // Controle do botão interativo "Ver mais notícias" / "Ver menos notícias (Recolher)"
          // Permite que as notícias APAREÇAM ao expandir e DESAPAREÇAM ao recolher
          if (blogLoadMoreWrap) {
            if (!query && filtered.length > 4) {
              blogLoadMoreWrap.style.display = 'block';

              if (visibleLimit < filtered.length) {
                // Estado: Existem notícias antigas para APARECER (expandir de 4 em 4)
                const remaining = filtered.length - visibleLimit;
                blogLoadMoreWrap.innerHTML = `
                  <button type="button" class="blog-load-more-pill" id="blogLoadMoreBtn" title="Clique para exibir mais notícias antigas">
                    <span>Ver mais notícias</span>
                    <span class="blog-load-more-badge" id="blogLoadMoreBadge">${remaining} restantes ↓</span>
                  </button>
                `;
                const moreBtn = document.getElementById('blogLoadMoreBtn');
                if (moreBtn) {
                  moreBtn.addEventListener('click', () => {
                    visibleLimit += 4;
                    renderFilteredPosts();
                  });
                }
              } else {
                // Estado: Todas as notícias foram exibidas -> Botão para DESAPARECER (recolher de volta para 4)
                blogLoadMoreWrap.innerHTML = `
                  <button type="button" class="blog-load-more-pill blog-load-more-pill--collapse" id="blogLoadMoreBtn" title="Clique para recolher e esconder as notícias antigas">
                    <span>Ver menos notícias (Recolher)</span>
                    <span class="blog-load-more-badge" id="blogLoadMoreBadge">↑</span>
                  </button>
                `;
                const collapseBtn = document.getElementById('blogLoadMoreBtn');
                if (collapseBtn) {
                  collapseBtn.addEventListener('click', () => {
                    visibleLimit = 4;
                    renderFilteredPosts();
                    const blogSection = document.getElementById('blog');
                    if (blogSection) {
                      blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  });
                }
              }
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
        renderFilteredPosts();
      })
      .catch((err) => {
        console.warn('Usando cards estáticos de fallback no blog:', err);
      });
  }

  /* --------------------------------------------------------------------------
   * 12. SIMULADOR INTERATIVO DO APP SS AGRO FORÇA DE VENDAS (F.V.)
   * -------------------------------------------------------------------------- */
  const fvFeatureTabs = Array.from(document.querySelectorAll('#fvFeatureTabs .fv-ftab'));
  const fvAppScreens = Array.from(document.querySelectorAll('#fvPhoneViewport .fv-app-screen'));
  const fvGotoButtons = Array.from(document.querySelectorAll('#fvPhoneViewport [data-goto]'));
  const fvPeriodRadios = Array.from(document.querySelectorAll('input[name="fvPeriod"]'));

  if (fvFeatureTabs.length > 0 && fvAppScreens.length > 0) {
    let fvAutoCycle = null;
    const screenOrder = ['home', 'estoque', 'pedidos', 'dashboards', 'login'];
    let currentScreenIdx = 0;

    const activateFvScreen = (screenName) => {
      const idx = screenOrder.indexOf(screenName);
      if (idx !== -1) {
        currentScreenIdx = idx;
      }

      fvFeatureTabs.forEach((tab) => {
        const isMatch = tab.getAttribute('data-screen') === screenName;
        tab.classList.toggle('active', isMatch);
        tab.setAttribute('aria-selected', String(isMatch));
      });

      fvAppScreens.forEach((screen) => {
        const isMatch = screen.id === `fvScreen-${screenName}`;
        screen.classList.toggle('active', isMatch);
      });
    };

    const startFvSimulatorCycle = () => {
      stopFvSimulatorCycle();
      fvAutoCycle = setInterval(() => {
        currentScreenIdx = (currentScreenIdx + 1) % screenOrder.length;
        activateFvScreen(screenOrder[currentScreenIdx]);
      }, 6500);
    };

    const stopFvSimulatorCycle = () => {
      if (fvAutoCycle) {
        clearInterval(fvAutoCycle);
        fvAutoCycle = null;
      }
    };

    fvFeatureTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetScreen = tab.getAttribute('data-screen');
        if (targetScreen) {
          activateFvScreen(targetScreen);
          startFvSimulatorCycle();
        }
      });
    });

    fvGotoButtons.forEach((btn) => {
      const triggerGoto = () => {
        const targetScreen = btn.getAttribute('data-goto');
        if (targetScreen) {
          activateFvScreen(targetScreen);
          startFvSimulatorCycle();
        }
      };
      btn.addEventListener('click', triggerGoto);
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerGoto();
        }
      });
    });

    // Interatividade dos filtros de período (Semana, Mês, Trimestre, Anos) na Tela Inicial do App
    const baseKpis = {
      vendido: 63218885.32,
      faturado: 54348594.73,
      aberto: 4494349.29,
      devolvido: 2365859.52,
    };

    const formatCurrencyBR = (val) =>
      val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    fvPeriodRadios.forEach((radio) => {
      radio.addEventListener('change', () => {
        const mult = parseFloat(radio.getAttribute('data-mult') || '1');
        document.querySelectorAll('.fv-app-radio').forEach((lbl) => lbl.classList.remove('active'));
        const parentLbl = radio.closest('.fv-app-radio');
        if (parentLbl) parentLbl.classList.add('active');

        const elVendido = document.getElementById('fvKpiVendido');
        const elFaturado = document.getElementById('fvKpiFaturado');
        const elAberto = document.getElementById('fvKpiAberto');
        const elDevolvido = document.getElementById('fvKpiDevolvido');

        if (elVendido) elVendido.innerHTML = `<em>R$</em> ${formatCurrencyBR(baseKpis.vendido * mult)}`;
        if (elFaturado) elFaturado.innerHTML = `<em>R$</em> ${formatCurrencyBR(baseKpis.faturado * mult)}`;
        if (elAberto) elAberto.innerHTML = `<em>R$</em> ${formatCurrencyBR(baseKpis.aberto * mult)}`;
        if (elDevolvido) elDevolvido.innerHTML = `<em>R$</em> ${formatCurrencyBR(baseKpis.devolvido * mult)}`;
        stopFvSimulatorCycle();
      });
    });

    const stageContainer = document.querySelector('.fv-interactive-stage');
    if (stageContainer) {
      stageContainer.addEventListener('mouseenter', stopFvSimulatorCycle);
      stageContainer.addEventListener('mouseleave', startFvSimulatorCycle);
      stageContainer.addEventListener('focusin', stopFvSimulatorCycle);
      stageContainer.addEventListener('focusout', startFvSimulatorCycle);
    }

    startFvSimulatorCycle();
  }

  /* --------------------------------------------------------------------------
   * 13. ACESSIBILIDADE TECLADO WAI-ARIA PARA TODAS AS ABAS ([role="tablist"])
   * -------------------------------------------------------------------------- */
  const tabLists = document.querySelectorAll('[role="tablist"]');
  tabLists.forEach((tabList) => {
    const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
    if (tabs.length === 0) return;

    tabList.addEventListener('keydown', (e) => {
      const currentIndex = tabs.indexOf(document.activeElement);
      if (currentIndex === -1) return;

      let nextIndex = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex !== -1) {
        e.preventDefault();
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      }
    });
  });

  /* --------------------------------------------------------------------------
   * 14. FORMULÁRIO DE DEMONSTRAÇÃO & CONTATO COMERCIAL (LGPD & ALTA CONVERSÃO)
   * -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const feedbackEl = document.getElementById('contactFormFeedback');
  const phoneInput = document.getElementById('formWhatsapp');

  // Máscara dinâmica de telefone brasileiro (DDD + 8 ou 9 dígitos)
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);

      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (v.length > 0) {
        v = v.replace(/^(\d*)$/, '($1');
      }
      e.target.value = v;
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = document.getElementById('formNome')?.value.trim();
      const whatsapp = document.getElementById('formWhatsapp')?.value.trim();
      const email = document.getElementById('formEmail')?.value.trim();
      const empresa = document.getElementById('formEmpresa')?.value.trim();
      const segmento = document.getElementById('formSegmento')?.value || 'Distribuidora de Insumos';
      const mensagem = document.getElementById('formMensagem')?.value.trim() || 'Sem observações adicionais.';
      const lgpdChecked = document.getElementById('formLgpd')?.checked;
      const submitBtn = document.getElementById('formSubmitBtn');

      if (!nome || !whatsapp || !email || !empresa) {
        if (feedbackEl) {
          feedbackEl.className = 'form-feedback error';
          feedbackEl.innerHTML = '⚠️ Por favor, preencha todos os campos obrigatórios (*).';
          feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      if (!lgpdChecked) {
        if (feedbackEl) {
          feedbackEl.className = 'form-feedback error';
          feedbackEl.innerHTML = '⚠️ É necessário aceitar a Política de Privacidade para prosseguir.';
          feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      // Desabilita botão com estado de carregamento
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processando Solicitação...</span>';
      }

      const payload = { nome, whatsapp, email, empresa, segmento, mensagem, origem: 'Formulário do Site' };

      // Tenta gravar na API do servidor local/produção (silencioso em caso de falha de conexão)
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        // Sem impacto caso o servidor seja estático
      }

      // Mensagem estruturada para o WhatsApp Oficial SS Agro
      const text = 
`Olá, Equipe SS Agro!
Gostaria de solicitar uma demonstração do sistema.

📌 *DADOS DO CONTATO:*
• *Nome:* ${nome}
• *Empresa:* ${empresa}
• *Segmento:* ${segmento}
• *WhatsApp:* ${whatsapp}
• *E-mail:* ${email}
${mensagem !== 'Sem observações adicionais.' ? `• *Mensagem:* ${mensagem}` : ''}

Solicitação enviada através do site www.ssagro.com.br.`;

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/5564984360638?text=${encodedText}`;

      if (feedbackEl) {
        feedbackEl.className = 'form-feedback success';
        feedbackEl.innerHTML = '✓ <strong>Solicitação registrada com sucesso!</strong> Redirecionando para o WhatsApp oficial da SS Agro em instantes...';
      }

      contactForm.reset();

      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Enviar Solicitação de Demonstração</span><span class="btn__icon" aria-hidden="true">→</span>';
        }
      }, 1200);
    });
  }

  /* --------------------------------------------------------------------------
   * 15. BANNER DE CONSENTIMENTO DE COOKIES (LGPD - LEI Nº 13.709/2018)
   * -------------------------------------------------------------------------- */
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAcceptBtn = document.getElementById('cookieAcceptBtn');

  if (cookieBanner && cookieAcceptBtn) {
    const hasConsent = localStorage.getItem('ssagro_cookie_consent');
    if (!hasConsent) {
      setTimeout(() => {
        cookieBanner.classList.remove('hidden');
      }, 1500);
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('ssagro_cookie_consent', 'accepted_' + new Date().toISOString());
      cookieBanner.classList.add('hidden');
    });
  }

  /* --------------------------------------------------------------------------
   * 16. BOTÃO FLUTUANTE DE VOLTAR AO TOPO (SCROLL TO TOP)
   * -------------------------------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 380) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      },
      { passive: true }
    );

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  document.querySelectorAll('.scroll-to-top-trigger').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});
