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
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --------------------------------------------------------------------------
   * 2. MENU MOBILE (ABRIR / FECHAR NO CELULAR)
   * -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinksContainer = document.getElementById('navLinks');

  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');
      const isOpen = navLinksContainer.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    // Fecha o menu automaticamente ao clicar em qualquer link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
        mobileToggle.innerHTML = '☰';
      });
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

      tabButtons.forEach((b) => b.classList.remove('active'));
      solutionPanels.forEach((panel) => panel.classList.remove('active'));

      btn.classList.add('active');
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

      filterChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      moduleCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeSlideIn 0.35s ease forwards';
        } else {
          card.classList.add('hidden');
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
   * 10. BANNER DE VÍDEO COM PLAYLIST CONTÍNUA EM LOOP (DUPLO PLAYER CROSSFADE)
   * --------------------------------------------------------------------------
   * Explicação simples para programador júnior:
   * - Usamos DOIS elementos <video> sobrepostos (#heroVideo1 e #heroVideo2).
   * - Faltando 0.55 segundo para o Vídeo 1 acabar, já damos play no Vídeo 2 do
   *   início (currentTime = 0) e fazemos a troca suave de opacidade (crossfade
   *   de 1.2 segundo), enquanto ambos os vídeos ainda estão em movimento!
   * - Assim a imagem nunca fica parada no final e alterna infinitamente entre
   *   o Vídeo 1 e o Vídeo 2.
   * -------------------------------------------------------------------------- */
  const video1 = document.getElementById('heroVideo1');
  const video2 = document.getElementById('heroVideo2');

  if (video1 && video2) {
    let currentActiveVideo = 1;
    let isTransitioning = false;

    function safePlay(vid) {
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

    function transitionToNextVideo() {
      if (isTransitioning) return;
      isTransitioning = true;

      if (currentActiveVideo === 1) {
        // Inicia o Vídeo 2 do zero e faz a fusão suave (crossfade)
        safePlay(video2);
        video2.classList.add('active');
        video1.classList.remove('active');
        currentActiveVideo = 2;

        setTimeout(() => {
          video1.pause();
          try {
            video1.currentTime = 0;
          } catch (_) {}
          isTransitioning = false;
        }, 1200);
      } else {
        // Inicia o Vídeo 1 do zero e faz a fusão suave (crossfade)
        safePlay(video1);
        video1.classList.add('active');
        video2.classList.remove('active');
        currentActiveVideo = 1;

        setTimeout(() => {
          video2.pause();
          try {
            video2.currentTime = 0;
          } catch (_) {}
          isTransitioning = false;
        }, 1200);
      }
    }

    // 1. Escuta o evento nativo 'ended'
    video1.addEventListener('ended', transitionToNextVideo);
    video2.addEventListener('ended', transitionToNextVideo);

    // 2. Inicia o crossfade suave 0.55s antes do vídeo acabar para nunca parar no último frame
    function checkVideoProgress() {
      if (isTransitioning) return;
      const activeVid = currentActiveVideo === 1 ? video1 : video2;

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

    video1.addEventListener('timeupdate', checkVideoProgress);
    video2.addEventListener('timeupdate', checkVideoProgress);

    // 3. Watchdog a cada 200ms: garante que nunca fique parado mesmo se o navegador atrasar eventos
    setInterval(checkVideoProgress, 200);

    // Inicia a reprodução garantida do primeiro vídeo
    safePlay(video1);

    // Efeito Parallax suave em ambos os vídeos ao rolar a página
    window.addEventListener(
      'scroll',
      () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY < window.innerHeight * 1.2) {
          const scale = 1.04 + (currentScrollY / window.innerHeight) * 0.06;
          const translateY = (currentScrollY * 0.16).toFixed(1);
          video1.style.transform = `scale(${scale.toFixed(3)}) translateY(${translateY}px)`;
          video2.style.transform = `scale(${scale.toFixed(3)}) translateY(${translateY}px)`;
        }
      },
      { passive: true }
    );
  }

  /* --------------------------------------------------------------------------
   * 11. RENDERIZAÇÃO DINÂMICA DOS CARDS DO BLOG (CONECTADO AO PAINEL GERENCIAL)
   * --------------------------------------------------------------------------
   * Explicação simples para programador júnior:
   * - Busca todas as notícias marcadas como "Publicadas" na nossa API (/api/posts)
   *   ou no banco local e cria os cards automaticamente dentro de #blogGrid.
   * - Assim, qualquer notícia nova, editada ou ocultada no Painel Gerencial
   *   (admin.html) reflete imediatamente na página inicial!
   * -------------------------------------------------------------------------- */
  const blogGrid = document.getElementById('blogGrid');
  if (blogGrid && window.SSAgroBlog) {
    window.SSAgroBlog.getPublishedPosts()
      .then((posts) => {
        if (!Array.isArray(posts) || posts.length === 0) {
          blogGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: rgba(19, 49, 77, 0.5); border-radius: 18px; border: 1px solid rgba(93, 224, 230, 0.2);">
              <p style="color: var(--ss-gray-muted); margin-bottom: 14px;">Nenhuma notícia publicada no momento.</p>
              <a href="admin.html" class="btn btn--outline btn--sm">Gerenciar Notícias no Painel</a>
            </div>
          `;
          return;
        }

        blogGrid.innerHTML = posts
          .map((post, idx) => {
            const delayClass = `delay-${(idx % 4) + 1}`;
            const safeTitle = String(post.title || '').replace(/"/g, '&quot;');
            const safeCat = String(post.category || 'Artigo').replace(/"/g, '&quot;');
            const viewsCount = Number(post.views || 0).toLocaleString('pt-BR');
            return `
              <a
                href="artigo.html?slug=${encodeURIComponent(post.slug)}"
                class="blog-card spotlight-card reveal is-visible ${delayClass}"
              >
                <div class="blog-card__img">
                  <img src="${post.image || 'assets/blog-1.jpg'}" alt="${safeTitle}" loading="lazy" />
                  <span class="blog-card__tag">${safeCat}</span>
                </div>
                <div class="blog-card__body">
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 0.76rem; color: var(--ss-gray-muted); margin-bottom: 8px;">
                    <span>📅 ${window.SSAgroBlog.formatDateBR(post.publishedAt)}</span>
                    <span style="color: var(--ss-cyan); font-weight: 600;">👁️ ${viewsCount} leituras</span>
                  </div>
                  <h3 class="blog-card__title">${post.title}</h3>
                  <div class="blog-card__more">
                    Ler artigo completo <span>→</span>
                  </div>
                </div>
              </a>
            `;
          })
          .join('');

        // Ativa o efeito Spotlight nos novos cards renderizados dinamicamente
        blogGrid.querySelectorAll('.spotlight-card').forEach((card) => {
          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
          });
        });
      })
      .catch((err) => {
        console.warn('Usando cards estáticos de fallback no blog:', err);
      });
  }
});
