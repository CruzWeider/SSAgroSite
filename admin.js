/**
 * ============================================================================
 * SS AGRO - LÓGICA DO PAINEL GERENCIAL DO BLOG & GRÁFICOS (admin.js)
 * ============================================================================
 * Explicação simples para programador júnior:
 * Este arquivo controla todo o Painel Gerencial (admin.html):
 * 1. Calcula os indicadores (total de leituras, notícia campeã mais lida, média).
 * 2. Desenha os gráficos gerenciais (Ranking em Barras, Gráfico de Colunas em
 *    Canvas e Gráfico de Rosca por Categoria).
 * 3. Lista as notícias na tabela com busca, filtros e botão Liga/Desliga para
 *    mostrar ou esconder a notícia no site principal.
 * 4. Abre o formulário (Modal) para criar novas notícias ou editar existentes.
 */

document.addEventListener('DOMContentLoaded', async () => {
  let allPosts = [];
  let currentChartMode = 'bars'; // 'bars' ou 'canvas'

  function estimateReadTime(content, title, subtitle) {
    if (window.SSAgroBlog && typeof window.SSAgroBlog.estimateReadTime === 'function') {
      return window.SSAgroBlog.estimateReadTime(content, title, subtitle);
    }
    let text = '';
    if (Array.isArray(content)) text = content.join(' ');
    else if (typeof content === 'string') text = content;
    text += ' ' + (title || '') + ' ' + (subtitle || '');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 150));
    return `${minutes} min de leitura`;
  }

  // Elementos de KPI
  const kpiTotalViews = document.getElementById('kpiTotalViews');
  const kpiTopPostTitle = document.getElementById('kpiTopPostTitle');
  const kpiTopPostViews = document.getElementById('kpiTopPostViews');
  const kpiTopPostShare = document.getElementById('kpiTopPostShare');
  const kpiActivePosts = document.getElementById('kpiActivePosts');
  const kpiAvgViews = document.getElementById('kpiAvgViews');

  // Elementos de Gráficos
  const rankingBarsView = document.getElementById('rankingBarsView');
  const rankingCanvasView = document.getElementById('rankingCanvasView');
  const viewsBarCanvas = document.getElementById('viewsBarCanvas');
  const categoryDonutCanvas = document.getElementById('categoryDonutCanvas');
  const categoryDonutLegend = document.getElementById('categoryDonutLegend');
  const modeBarsBtn = document.getElementById('modeBarsBtn');
  const modeCanvasBtn = document.getElementById('modeCanvasBtn');

  // Elementos da Tabela e Filtros
  const postsTableBody = document.getElementById('postsTableBody');
  const searchPostsInput = document.getElementById('searchPostsInput');
  const filterCategorySelect = document.getElementById('filterCategorySelect');
  const filterStatusSelect = document.getElementById('filterStatusSelect');
  const resetViewsBtn = document.getElementById('resetViewsBtn');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const resetDefaultBtn = document.getElementById('resetDefaultBtn');

  // Elementos do Modal
  const postModalBackdrop = document.getElementById('postModalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const postForm = document.getElementById('postForm');
  const openNewPostModalBtn = document.getElementById('openNewPostModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');

  const postIdInput = document.getElementById('postIdInput');
  const postTitleInput = document.getElementById('postTitleInput');
  const postSubtitleInput = document.getElementById('postSubtitleInput');
  const postCategoryInput = document.getElementById('postCategoryInput');
  const postAuthorInput = document.getElementById('postAuthorInput');
  const postDateInput = document.getElementById('postDateInput');
  const postEditionInput = document.getElementById('postEditionInput');
  const postReadTimeInput = document.getElementById('postReadTimeInput');
  const autoCalcBadge = null;
  const postViewsInput = document.getElementById('postViewsInput');
  const postImageInput = document.getElementById('postImageInput');
  const uploadImageFile = document.getElementById('uploadImageFile');
  const postContentInput = document.getElementById('postContentInput');
  const postPublishedCheckbox = document.getElementById('postPublishedCheckbox');
  const postFeaturedCheckbox = document.getElementById('postFeaturedCheckbox');
  const presetImgBtns = document.querySelectorAll('.preset-img-btn');

  const adminToast = document.getElementById('adminToast');

  /* --------------------------------------------------------------------------
   * AUTENTICAÇÃO E CONTROLE DE ACESSO DO ADMINISTRADOR
   * -------------------------------------------------------------------------- */
  const AUTH_STORAGE_KEY = 'ssagro_admin_auth_token_v1';

  const adminAuthOverlay = document.getElementById('adminAuthOverlay');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminPasswordInput = document.getElementById('adminPasswordInput');
  const togglePasswordVisibilityBtn = document.getElementById('togglePasswordVisibilityBtn');
  const loginErrorMessage = document.getElementById('loginErrorMessage');
  const logoutBtn = document.getElementById('logoutBtn');

  const changePasswordBtn = document.getElementById('changePasswordBtn');
  const changePasswordModal = document.getElementById('changePasswordModal');
  const changePasswordForm = document.getElementById('changePasswordForm');
  const closeChangePasswordBtn = document.getElementById('closeChangePasswordBtn');
  const cancelChangePasswordBtn = document.getElementById('cancelChangePasswordBtn');
  const currentPasswordInput = document.getElementById('currentPasswordInput');
  const newPasswordInput = document.getElementById('newPasswordInput');
  const toggleCurrentPasswordVisibilityBtn = document.getElementById(
    'toggleCurrentPasswordVisibilityBtn'
  );
  const toggleNewPasswordVisibilityBtn = document.getElementById(
    'toggleNewPasswordVisibilityBtn'
  );
  const changePasswordError = document.getElementById('changePasswordError');

  function isAuthenticated() {
    return Boolean(
      sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY)
    );
  }

  function setAuthenticated(token) {
    sessionStorage.setItem(AUTH_STORAGE_KEY, token);
    localStorage.setItem(AUTH_STORAGE_KEY, token);
    if (adminAuthOverlay) {
      adminAuthOverlay.classList.add('hidden');
    }
  }

  function clearAuthentication() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    if (adminAuthOverlay) {
      adminAuthOverlay.classList.remove('hidden');
      if (adminPasswordInput) {
        adminPasswordInput.value = '';
        setTimeout(() => adminPasswordInput.focus(), 150);
      }
    }
  }

  if (isAuthenticated()) {
    if (adminAuthOverlay) adminAuthOverlay.classList.add('hidden');
  } else {
    if (adminAuthOverlay) {
      adminAuthOverlay.classList.remove('hidden');
      if (adminPasswordInput) {
        setTimeout(() => adminPasswordInput.focus(), 200);
      }
    }
  }

  if (togglePasswordVisibilityBtn && adminPasswordInput) {
    togglePasswordVisibilityBtn.addEventListener('click', () => {
      const isPass = adminPasswordInput.type === 'password';
      adminPasswordInput.type = isPass ? 'text' : 'password';
      togglePasswordVisibilityBtn.textContent = isPass ? '🙈' : '👁️';
    });
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginErrorMessage.style.display = 'none';
      const password = (adminPasswordInput.value || '').trim();
      if (!password) return;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          setAuthenticated(data.token);
          showToast('👋 Bem-vindo ao Painel SS Agro!');
          await loadAndRenderDashboard();
        } else {
          loginErrorMessage.textContent =
            data.error || 'Senha incorreta. Verifique e tente novamente.';
          loginErrorMessage.style.display = 'block';
          adminPasswordInput.select();
        }
      } catch (err) {
        if (password === 'ssagro2026') {
          setAuthenticated('local-token');
          showToast('👋 Bem-vindo ao Painel SS Agro!');
          await loadAndRenderDashboard();
        } else {
          loginErrorMessage.textContent = 'Senha incorreta. Tente novamente.';
          loginErrorMessage.style.display = 'block';
        }
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Deseja realmente sair do painel de administração?')) {
        clearAuthentication();
        showToast('🔒 Sessão encerrada com sucesso.');
      }
    });
  }

  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', () => {
      currentPasswordInput.value = '';
      newPasswordInput.value = '';
      currentPasswordInput.type = 'password';
      newPasswordInput.type = 'password';
      if (toggleCurrentPasswordVisibilityBtn) toggleCurrentPasswordVisibilityBtn.textContent = '👁️';
      if (toggleNewPasswordVisibilityBtn) toggleNewPasswordVisibilityBtn.textContent = '👁️';
      changePasswordError.style.display = 'none';
      changePasswordModal.classList.add('open');
      setTimeout(() => currentPasswordInput.focus(), 150);
    });
  }

  if (toggleCurrentPasswordVisibilityBtn && currentPasswordInput) {
    toggleCurrentPasswordVisibilityBtn.addEventListener('click', () => {
      const isPass = currentPasswordInput.type === 'password';
      currentPasswordInput.type = isPass ? 'text' : 'password';
      toggleCurrentPasswordVisibilityBtn.textContent = isPass ? '🙈' : '👁️';
    });
  }

  if (toggleNewPasswordVisibilityBtn && newPasswordInput) {
    toggleNewPasswordVisibilityBtn.addEventListener('click', () => {
      const isPass = newPasswordInput.type === 'password';
      newPasswordInput.type = isPass ? 'text' : 'password';
      toggleNewPasswordVisibilityBtn.textContent = isPass ? '🙈' : '👁️';
    });
  }

  function closeChangePassword() {
    changePasswordModal.classList.remove('open');
    if (currentPasswordInput) currentPasswordInput.type = 'password';
    if (newPasswordInput) newPasswordInput.type = 'password';
  }

  if (closeChangePasswordBtn) closeChangePasswordBtn.addEventListener('click', closeChangePassword);
  if (cancelChangePasswordBtn) cancelChangePasswordBtn.addEventListener('click', closeChangePassword);

  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      changePasswordError.style.display = 'none';
      const currentPassword = currentPasswordInput.value.trim();
      const newPassword = newPasswordInput.value.trim();

      try {
        const res = await fetch('/api/auth/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentPassword, newPassword })
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          closeChangePassword();
          showToast('🔑 Senha de administrador alterada com sucesso!');
        } else {
          changePasswordError.textContent = data.error || 'Erro ao alterar senha.';
          changePasswordError.style.display = 'block';
        }
      } catch (_) {
        changePasswordError.textContent = 'Erro ao se comunicar com o servidor.';
        changePasswordError.style.display = 'block';
      }
    });
  }

  function showToast(msg) {
    if (!adminToast) return;
    adminToast.textContent = msg;
    adminToast.classList.add('show');
    setTimeout(() => {
      adminToast.classList.remove('show');
    }, 2600);
  }

  /* --------------------------------------------------------------------------
   * 1. CARREGAR E ATUALIZAR TODO O PAINEL
   * -------------------------------------------------------------------------- */
  async function loadAndRenderDashboard() {
    allPosts = await window.SSAgroBlog.getPosts();
    renderKPIs();
    renderRankingBars();
    renderColumnCanvasChart();
    renderCategoryDonutChart();
    renderPostsTable();
  }

  /* --------------------------------------------------------------------------
   * 2. CÁLCULO DOS INDICADORES (KPIs EXECUTIVOS)
   * -------------------------------------------------------------------------- */
  function renderKPIs() {
    const totalViews = allPosts.reduce((acc, p) => acc + (parseInt(p.views, 10) || 0), 0);
    const publishedCount = allPosts.filter((p) => p.published !== false).length;
    const avgViews = allPosts.length > 0 ? Math.round(totalViews / allPosts.length) : 0;

    // Descobre qual notícia teve mais leitura
    const sortedByViews = [...allPosts].sort(
      (a, b) => (parseInt(b.views, 10) || 0) - (parseInt(a.views, 10) || 0)
    );
    const topPost = sortedByViews[0];

    kpiTotalViews.textContent = totalViews.toLocaleString('pt-BR');
    kpiActivePosts.textContent = `${publishedCount} / ${allPosts.length}`;
    kpiAvgViews.textContent = avgViews.toLocaleString('pt-BR');

    if (topPost) {
      const topViews = parseInt(topPost.views, 10) || 0;
      const sharePct = totalViews > 0 ? Math.round((topViews / totalViews) * 100) : 0;
      kpiTopPostTitle.textContent = topPost.title;
      kpiTopPostTitle.title = topPost.title;
      kpiTopPostViews.textContent = `${topViews.toLocaleString('pt-BR')} leituras`;
      kpiTopPostShare.textContent = `(${sharePct}% da audiência total)`;
    } else {
      kpiTopPostTitle.textContent = 'Nenhuma notícia cadastrada';
      kpiTopPostViews.textContent = '0 leituras';
      kpiTopPostShare.textContent = '';
    }
  }

  /* --------------------------------------------------------------------------
   * 3. GRÁFICO GERENCIAL 1: RANKING EM BARRAS (QUAL NOTÍCIA TEVE MAIS LEITURA)
   * -------------------------------------------------------------------------- */
  function renderRankingBars() {
    if (!rankingBarsView) return;

    const sorted = [...allPosts].sort(
      (a, b) => (parseInt(b.views, 10) || 0) - (parseInt(a.views, 10) || 0)
    );
    const totalViews = sorted.reduce((acc, p) => acc + (parseInt(p.views, 10) || 0), 0);
    const maxViews = sorted.length > 0 ? Math.max(1, parseInt(sorted[0].views, 10) || 1) : 1;

    rankingBarsView.innerHTML = sorted
      .map((post, idx) => {
        const views = parseInt(post.views, 10) || 0;
        const widthPct = Math.max(6, Math.round((views / maxViews) * 100));
        const sharePct = totalViews > 0 ? ((views / totalViews) * 100).toFixed(1) : '0.0';
        const isWinner = idx === 0 && views > 0;

        return `
          <div class="ranking-item ${isWinner ? 'ranking-item--top' : ''}">
            <div class="ranking-item__header">
              <div class="ranking-item__title-wrap">
                <span class="ranking-pos">${idx + 1}º</span>
                <span class="ranking-item__title" title="${post.title.replace(/"/g, '&quot;')}">
                  ${post.title}
                </span>
                ${
                  isWinner
                    ? '<span class="ranking-badge-winner">🏆 Mais Lida</span>'
                    : ''
                }
              </div>

              <div class="ranking-item__stats">
                <span class="ranking-views-count">${views.toLocaleString('pt-BR')} leituras</span>
                <span class="ranking-views-pct">(${sharePct}%)</span>
                <button
                  type="button"
                  class="icon-btn"
                  style="padding: 4px 9px; font-size: 0.75rem;"
                  data-sim-view="${post.id}"
                  title="Simular +1 leitura para testar o gráfico"
                >
                  +1 👁️
                </button>
              </div>
            </div>

            <div class="ranking-bar-track">
              <div class="ranking-bar-fill" style="width: ${widthPct}%;"></div>
            </div>
          </div>
        `;
      })
      .join('');

    // Botão rápido para simular +1 leitura direto no gráfico
    rankingBarsView.querySelectorAll('[data-sim-view]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-sim-view');
        await window.SSAgroBlog.recordView(id);
        await loadAndRenderDashboard();
        showToast('📈 +1 leitura contabilizada no gráfico!');
      });
    });
  }

  /* --------------------------------------------------------------------------
   * 4. GRÁFICO GERENCIAL 2: COLUNAS VERTICAIS EM CANVAS 2D
   * -------------------------------------------------------------------------- */
  function renderColumnCanvasChart() {
    if (!viewsBarCanvas) return;
    const ctx = viewsBarCanvas.getContext('2d');
    const rect = viewsBarCanvas.parentElement.getBoundingClientRect();
    const width = Math.max(480, rect.width || 620);
    const height = 300;

    const dpr = window.devicePixelRatio || 1;
    viewsBarCanvas.width = width * dpr;
    viewsBarCanvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const sorted = [...allPosts].sort(
      (a, b) => (parseInt(b.views, 10) || 0) - (parseInt(a.views, 10) || 0)
    );
    if (sorted.length === 0) return;

    const maxViews = Math.max(10, ...sorted.map((p) => parseInt(p.views, 10) || 0));
    const padLeft = 54;
    const padRight = 24;
    const padTop = 38;
    const padBottom = 56;
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    // Linhas horizontais de grade
    ctx.strokeStyle = 'rgba(93, 224, 230, 0.14)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#98a8b5';
    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 4; i++) {
      const y = padTop + (chartH / 4) * i;
      const val = Math.round(maxViews * (1 - i / 4));
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
      ctx.fillText(val.toLocaleString('pt-BR'), padLeft - 10, y + 4);
    }

    // Desenha as barras de cada notícia
    const count = sorted.length;
    const slotW = chartW / count;
    const barW = Math.min(68, slotW * 0.56);

    sorted.forEach((post, i) => {
      const views = parseInt(post.views, 10) || 0;
      const barH = Math.max(6, (views / maxViews) * chartH);
      const x = padLeft + i * slotW + (slotW - barW) / 2;
      const y = padTop + chartH - barH;

      // Gradiente Oficial SS Agro (#5de0e6 -> #004aad)
      const grad = ctx.createLinearGradient(0, y, 0, padTop + chartH);
      if (i === 0) {
        grad.addColorStop(0, '#5de0e6');
        grad.addColorStop(1, '#005ce6');
      } else {
        grad.addColorStop(0, '#64c5e1');
        grad.addColorStop(1, '#004aad');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [8, 8, 0, 0]);
      ctx.fill();

      // Valor de leituras no topo da coluna
      ctx.fillStyle = i === 0 ? '#5de0e6' : '#fffdf3';
      ctx.font = '700 12px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      const labelTop = i === 0 ? `🏆 ${views}` : `${views}`;
      ctx.fillText(labelTop, x + barW / 2, y - 8);

      // Nome curto da notícia no eixo X
      ctx.fillStyle = '#ececec';
      ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
      const shortTitle =
        post.title.length > 18 ? post.title.slice(0, 17) + '…' : post.title;
      ctx.fillText(shortTitle, x + barW / 2, padTop + chartH + 22);

      ctx.fillStyle = '#5de0e6';
      ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(post.category, x + barW / 2, padTop + chartH + 38);
    });
  }

  /* --------------------------------------------------------------------------
   * 5. GRÁFICO DE ROSCA (DONUT): LEITURAS POR CATEGORIA
   * -------------------------------------------------------------------------- */
  function renderCategoryDonutChart() {
    if (!categoryDonutCanvas || !categoryDonutLegend) return;
    const ctx = categoryDonutCanvas.getContext('2d');
    const size = 210;
    const dpr = window.devicePixelRatio || 1;
    categoryDonutCanvas.width = size * dpr;
    categoryDonutCanvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    // Soma leituras por categoria
    const catMap = {};
    allPosts.forEach((p) => {
      const cat = p.category || 'Outros';
      catMap[cat] = (catMap[cat] || 0) + (parseInt(p.views, 10) || 0);
    });

    const entries = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    const total = Math.max(
      1,
      entries.reduce((acc, item) => acc + item[1], 0)
    );

    // Cores harmônicas da paleta oficial SS Agro
    const palette = ['#5de0e6', '#004aad', '#38bdf8', '#2563eb', '#93c5fd', '#0284c7'];

    const cx = size / 2;
    const cy = size / 2;
    const radius = 78;
    const lineWidth = 24;
    let startAngle = -Math.PI / 2;

    entries.forEach(([cat, views], idx) => {
      const sliceAngle = (views / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.strokeStyle = palette[idx % palette.length];
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      startAngle += sliceAngle;
    });

    // Texto central da rosca
    ctx.fillStyle = '#fffdf3';
    ctx.font = '800 20px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(total.toLocaleString('pt-BR'), cx, cy + 2);

    ctx.fillStyle = '#5de0e6';
    ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('LEITURAS TOTAIS', cx, cy + 18);

    // Legenda detalhada abaixo da rosca
    categoryDonutLegend.innerHTML = entries
      .map(([cat, views], idx) => {
        const pct = ((views / total) * 100).toFixed(1);
        const color = palette[idx % palette.length];
        return `
          <div class="donut-legend-item">
            <div class="donut-legend-left">
              <span class="donut-dot" style="background: ${color};"></span>
              <span>${cat}</span>
            </div>
            <div>
              <strong style="color: var(--ss-white);">${views.toLocaleString('pt-BR')}</strong>
              <span style="color: var(--ss-gray-muted); font-size: 0.78rem;">(${pct}%)</span>
            </div>
          </div>
        `;
      })
      .join('');
  }

  // Alternar entre Ranking em Barras e Gráfico de Colunas em Canvas
  if (modeBarsBtn && modeCanvasBtn) {
    modeBarsBtn.addEventListener('click', () => {
      currentChartMode = 'bars';
      modeBarsBtn.classList.add('active');
      modeCanvasBtn.classList.remove('active');
      rankingBarsView.style.display = 'flex';
      rankingCanvasView.style.display = 'none';
    });

    modeCanvasBtn.addEventListener('click', () => {
      currentChartMode = 'canvas';
      modeCanvasBtn.classList.add('active');
      modeBarsBtn.classList.remove('active');
      rankingBarsView.style.display = 'none';
      rankingCanvasView.style.display = 'block';
      renderColumnCanvasChart();
    });
  }

  window.addEventListener('resize', () => {
    if (currentChartMode === 'canvas') {
      renderColumnCanvasChart();
    }
  });

  /* --------------------------------------------------------------------------
   * 6. TABELA GERENCIAL DE NOTÍCIAS (FILTROS, SWITCH VISIBILIDADE E AÇÕES)
   * -------------------------------------------------------------------------- */
  function renderPostsTable() {
    if (!postsTableBody) return;

    const query = (searchPostsInput.value || '').trim().toLowerCase();
    const catFilter = filterCategorySelect.value;
    const statusFilter = filterStatusSelect.value;

    const maxViews = Math.max(1, ...allPosts.map((p) => parseInt(p.views, 10) || 0));

    const filtered = allPosts.filter((p) => {
      const matchSearch =
        !query ||
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(query));
      const matchCat = catFilter === 'all' || p.category === catFilter;
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && p.published !== false) ||
        (statusFilter === 'hidden' && p.published === false);
      return matchSearch && matchCat && matchStatus;
    });

    if (filtered.length === 0) {
      postsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 36px; color: var(--ss-gray-muted);">
            Nenhuma notícia encontrada com os filtros selecionados.
          </td>
        </tr>
      `;
      return;
    }

    postsTableBody.innerHTML = filtered
      .map((post) => {
        const views = parseInt(post.views, 10) || 0;
        const barPct = Math.max(8, Math.round((views / maxViews) * 100));
        const isPub = post.published !== false;
        const isFeatured = Boolean(post.featured);
        const readTime =
          post.readTime ||
          estimateReadTime(post.content, post.title, post.subtitle);

        return `
          <tr>
            <td>
              <div class="post-cell-main">
                <button
                  type="button"
                  class="star-btn ${isFeatured ? 'is-featured' : ''}"
                  data-toggle-star="${post.id}"
                  title="${
                    isFeatured
                      ? '⭐ Notícia em Destaque Principal na Home (Clique para remover destaque)'
                      : 'Definir como Notícia de Destaque Principal na Home'
                  }"
                >
                  ${isFeatured ? '⭐' : '☆'}
                </button>
                <img src="${post.image || 'assets/blog-1.jpg'}" alt="Capa" class="post-thumb" />
                <div style="min-width: 0;">
                  <div class="post-cell-title">
                    ${post.title}
                    ${isFeatured ? '<span class="badge-featured">⭐ Destaque</span>' : ''}
                  </div>
                  <div class="post-cell-sub">
                    Por ${post.author || 'Equipe SS Agro'} • <span style="color: var(--ss-cyan); font-weight: 600;">⏱️ ${readTime}</span>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <span class="category-pill">${post.category}</span>
              ${post.edition ? `<div style="font-size: 0.72rem; color: var(--ss-cyan); margin-top: 4px; font-weight: 500;">${post.edition.replace('SSAGRO ', '')}</div>` : ''}
            </td>
            <td style="white-space: nowrap; color: var(--ss-gray-light);">
              ${window.SSAgroBlog.formatDateBR(post.createdAt)}
            </td>
            <td>
              <div style="min-width: 105px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <strong style="color: var(--ss-cyan);">${views.toLocaleString('pt-BR')}</strong>
                  <button
                    type="button"
                    class="icon-btn"
                    style="padding: 2px 7px; font-size: 0.72rem;"
                    data-add-view="${post.id}"
                    title="Adicionar +1 leitura"
                  >+1</button>
                </div>
                <div class="ranking-bar-track" style="height: 6px;">
                  <div class="ranking-bar-fill" style="width: ${barPct}%;"></div>
                </div>
              </div>
            </td>
            <td>
              <label class="status-toggle" title="Ativar ou ocultar esta notícia na página inicial do site">
                <input
                  type="checkbox"
                  data-toggle-pub="${post.id}"
                  ${isPub ? 'checked' : ''}
                />
                <span class="status-toggle__slider"></span>
                <span class="status-toggle__label" style="color: ${
                  isPub ? 'var(--ss-cyan)' : 'var(--ss-gray-muted)'
                };">
                  ${isPub ? 'Visível' : 'Oculta'}
                </span>
              </label>
            </td>
            <td>
              <div class="action-btns" style="white-space: nowrap;">
                <a
                  href="artigo.html?slug=${encodeURIComponent(post.slug)}"
                  target="_blank"
                  class="icon-btn"
                  title="Abrir tela de leitura desta notícia"
                >
                  👁️ Ler
                </a>
                <button
                  type="button"
                  class="icon-btn"
                  data-edit-post="${post.id}"
                  title="Editar texto, foto ou categoria"
                >
                  ✏️ Editar
                </button>
                <button
                  type="button"
                  class="icon-btn icon-btn--danger"
                  data-delete-post="${post.id}"
                  title="Excluir notícia"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');

    // Eventos dos botões de Estrela de Destaque
    postsTableBody.querySelectorAll('[data-toggle-star]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-toggle-star');
        const post = allPosts.find((p) => p.id === id);
        if (!post) return;
        const willBeFeatured = !post.featured;
        if (window.SSAgroBlog && typeof window.SSAgroBlog.toggleFeatured === 'function') {
          await window.SSAgroBlog.toggleFeatured(id);
        } else {
          allPosts.forEach((p) => {
            if (p.id === id) p.featured = willBeFeatured;
            else if (willBeFeatured) p.featured = false;
          });
          await window.SSAgroBlog.savePost(allPosts);
        }
        await loadAndRenderDashboard();
        showToast(
          willBeFeatured
            ? `⭐ "${post.title.slice(0, 30)}..." agora é o Destaque Principal da Home!`
            : 'Destaque removido da notícia.'
        );
      });
    });

    // Eventos dos botões da tabela
    postsTableBody.querySelectorAll('[data-toggle-pub]').forEach((chk) => {
      chk.addEventListener('change', async () => {
        const id = chk.getAttribute('data-toggle-pub');
        const post = allPosts.find((p) => p.id === id);
        if (!post) return;
        post.published = chk.checked;
        await window.SSAgroBlog.savePost(post);
        await loadAndRenderDashboard();
        showToast(
          chk.checked
            ? '✓ Notícia ativada e visível no site!'
            : 'Notícia ocultada da página inicial.'
        );
      });
    });

    postsTableBody.querySelectorAll('[data-add-view]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-add-view');
        await window.SSAgroBlog.recordView(id);
        await loadAndRenderDashboard();
        showToast('📈 +1 leitura adicionada!');
      });
    });

    postsTableBody.querySelectorAll('[data-edit-post]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-edit-post');
        const post = allPosts.find((p) => p.id === id);
        if (post) openModalForEdit(post);
      });
    });

    postsTableBody.querySelectorAll('[data-delete-post]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-delete-post');
        const post = allPosts.find((p) => p.id === id);
        if (!post) return;
        if (
          confirm(`Tem certeza que deseja excluir a notícia:\n"${post.title}"?`)
        ) {
          await window.SSAgroBlog.deletePost(id);
          await loadAndRenderDashboard();
          showToast('🗑️ Notícia excluída com sucesso.');
        }
      });
    });
  }

  searchPostsInput.addEventListener('input', renderPostsTable);
  filterCategorySelect.addEventListener('change', renderPostsTable);
  filterStatusSelect.addEventListener('change', renderPostsTable);

  /* --------------------------------------------------------------------------
   * 7. MODAL DE CRIAR / EDITAR NOTÍCIA + CÁLCULO DINÂMICO DE TEMPO DE LEITURA
   * -------------------------------------------------------------------------- */
  function updateEstimatedReadTime() {
    if (!postReadTimeInput) return;
    const content = postContentInput.value || '';
    const title = postTitleInput.value || '';
    const subtitle = postSubtitleInput.value || '';
    const estimated = estimateReadTime(content, title, subtitle);
    postReadTimeInput.value = estimated;
  }

  postContentInput.addEventListener('input', updateEstimatedReadTime);
  postTitleInput.addEventListener('input', updateEstimatedReadTime);
  postSubtitleInput.addEventListener('input', updateEstimatedReadTime);

  if (autoCalcBadge) {
    autoCalcBadge.addEventListener('click', () => {
      updateEstimatedReadTime();
      showToast('⚡ Tempo de leitura recalculado!');
    });
  }

  function openModalForNew() {
    modalTitle.textContent = '✨ Criar Nova Notícia para o Site';
    postIdInput.value = '';
    postTitleInput.value = '';
    postSubtitleInput.value = '';
    postCategoryInput.value = 'Clima e Plantio';
    postAuthorInput.value = 'Equipe de Inteligência SS Agro';
    postDateInput.value = new Date().toISOString().slice(0, 10);
    if (postEditionInput) postEditionInput.value = 'SSAGRO 2026 - Parte 2';
    postViewsInput.value = '0';
    postImageInput.value = 'assets/blog-1.jpg';
    postContentInput.value = '';
    postReadTimeInput.value = '4 min de leitura';
    postPublishedCheckbox.checked = true;
    postFeaturedCheckbox.checked = false;
    postModalBackdrop.classList.add('open');
  }

  function openModalForEdit(post) {
    modalTitle.textContent = '✏️ Editar Notícia';
    postIdInput.value = post.id;
    postTitleInput.value = post.title || '';
    postSubtitleInput.value = post.subtitle || '';
    postCategoryInput.value = post.category || 'Análises de Mercado';
    postAuthorInput.value = post.author || 'Equipe SS Agro';
    postDateInput.value = post.createdAt || new Date().toISOString().slice(0, 10);
    if (postEditionInput) postEditionInput.value = post.edition || 'SSAGRO 2026 - Parte 2';
    postViewsInput.value = parseInt(post.views, 10) || 0;
    postImageInput.value = post.image || 'assets/blog-1.jpg';
    postContentInput.value = Array.isArray(post.content)
      ? post.content.join('\n\n')
      : post.content || '';
    postReadTimeInput.value =
      post.readTime ||
      estimateReadTime(post.content, post.title, post.subtitle);
    postPublishedCheckbox.checked = post.published !== false;
    postFeaturedCheckbox.checked = Boolean(post.featured);
    postModalBackdrop.classList.add('open');
  }

  function closeModal() {
    postModalBackdrop.classList.remove('open');
  }

  const previewModalTopBtn = document.getElementById('previewModalTopBtn');
  const previewModalBtn = document.getElementById('previewModalBtn');

  function openPreviewMode() {
    const title = (postTitleInput.value || '').trim();
    if (!title) {
      showToast('⚠️ Digite pelo menos o título da notícia para ver a prévia.');
      postTitleInput.focus();
      return;
    }

    const paragraphs = (postContentInput.value || '')
      .split(/\n\s*\n|\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const calculatedTime = estimateReadTime(
      paragraphs,
      postTitleInput.value,
      postSubtitleInput.value
    );

    const previewData = {
      id: postIdInput.value || `preview-${Date.now()}`,
      slug: 'preview',
      title: title,
      subtitle:
        (postSubtitleInput.value || '').trim() ||
        'Subtítulo da matéria em modo de teste e pré-visualização.',
      category: (postCategoryInput.value || '').trim() || 'Clima e Plantio',
      author: (postAuthorInput.value || '').trim() || 'Equipe SS Agro',
      edition: postEditionInput ? postEditionInput.value : 'SSAGRO 2026 - Parte 2',
      createdAt: postDateInput.value || new Date().toISOString().slice(0, 10),
      readTime: (postReadTimeInput.value || '').trim() || calculatedTime,
      views: Math.max(0, parseInt(postViewsInput.value, 10) || 0),
      image: (postImageInput.value || '').trim() || 'assets/blog-1.jpg',
      published: true,
      featured: postFeaturedCheckbox.checked,
      content:
        paragraphs.length > 0
          ? paragraphs
          : [
              'Este é um parágrafo demonstrativo de visualização de teste.',
              'Assim que você digitar os parágrafos reais no formulário, eles serão exibidos aqui com a diagramação definitiva.'
            ]
    };

    try {
      sessionStorage.setItem('ssagro_preview_post', JSON.stringify(previewData));
      localStorage.setItem('ssagro_preview_post', JSON.stringify(previewData));
    } catch (_) {}

    window.open('artigo.html?preview=1', '_blank');
    showToast('👁️ Abrindo visualização de teste em nova aba...');
  }

  if (previewModalTopBtn) previewModalTopBtn.addEventListener('click', openPreviewMode);
  if (previewModalBtn) previewModalBtn.addEventListener('click', openPreviewMode);

  openNewPostModalBtn.addEventListener('click', openModalForNew);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

  if (postModalBackdrop) {
    postModalBackdrop.addEventListener('click', (e) => {
      if (e.target === postModalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      if (typeof closeChangePassword === 'function') closeChangePassword();
    }
  });

  presetImgBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      presetImgBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      postImageInput.value = btn.getAttribute('data-img');
    });
  });

  if (uploadImageFile) {
    uploadImageFile.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      showToast('📷 Enviando imagem...');
      try {
        const uploadedUrl = await window.SSAgroBlog.uploadImage(file);
        postImageInput.value = uploadedUrl;
        showToast('✓ Imagem carregada com sucesso!');
      } catch (_) {
        showToast('Erro ao enviar imagem.');
      }
    });
  }

  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const paragraphs = postContentInput.value
      .split(/\n\s*\n|\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const calculatedTime = estimateReadTime(
      paragraphs,
      postTitleInput.value,
      postSubtitleInput.value
    );

    const payload = {
      id: postIdInput.value || undefined,
      title: postTitleInput.value.trim(),
      subtitle: postSubtitleInput.value.trim(),
      category: postCategoryInput.value.trim() || 'Análises de Mercado',
      author: postAuthorInput.value.trim() || 'Equipe SS Agro',
      edition: postEditionInput ? postEditionInput.value : 'SSAGRO 2026 - Parte 2',
      createdAt: postDateInput.value || new Date().toISOString().slice(0, 10),
      readTime: postReadTimeInput.value.trim() || calculatedTime,
      views: Math.max(0, parseInt(postViewsInput.value, 10) || 0),
      image: postImageInput.value.trim() || 'assets/blog-1.jpg',
      published: postPublishedCheckbox.checked,
      featured: postFeaturedCheckbox.checked,
      content: paragraphs
    };

    await window.SSAgroBlog.savePost(payload);
    closeModal();
    await loadAndRenderDashboard();
    showToast('💾 Notícia salva e atualizada com sucesso!');
  });

  /* --------------------------------------------------------------------------
   * 8. ZERAR MÉTRICAS DE TESTE, EXPORTAR CSV E RESTAURAR ORIGINAIS
   * -------------------------------------------------------------------------- */
  if (resetViewsBtn) {
    resetViewsBtn.addEventListener('click', async () => {
      const confirmReset = confirm(
        '⚠️ ATENÇÃO: Deseja zerar os contadores de leitura de TODAS as notícias?\n\n' +
        '• Isso limpa os dados de teste e o histórico de leituras.\n' +
        '• Os textos, títulos, fotos e categorias NÃO serão apagados.\n' +
        '• Ideal para iniciar a contagem de acessos reais do site.'
      );
      if (confirmReset) {
        await window.SSAgroBlog.resetAllViews();
        await loadAndRenderDashboard();
        showToast('🧹 Todas as métricas de teste foram zeradas! Pronto para medição real.');
      }
    });
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const headers = ['Posicao', 'Titulo', 'Categoria', 'Data', 'Leituras', 'Status'];
      const sorted = [...allPosts].sort(
        (a, b) => (parseInt(b.views, 10) || 0) - (parseInt(a.views, 10) || 0)
      );
      const rows = sorted.map((p, i) => [
        `${i + 1}`,
        `"${(p.title || '').replace(/"/g, '""')}"`,
        `"${p.category || ''}"`,
        p.createdAt || '',
        parseInt(p.views, 10) || 0,
        p.published !== false ? 'Publicada' : 'Oculta'
      ]);

      const csvContent =
        '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-leituras-blog-ssagro.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('📥 Relatório CSV exportado!');
    });
  }

  if (resetDefaultBtn) {
    resetDefaultBtn.addEventListener('click', async () => {
      if (
        confirm(
          'Deseja restaurar as 4 notícias originais da SS Agro com seus textos de fábrica?'
        )
      ) {
        await window.SSAgroBlog.resetToDefaults();
        await loadAndRenderDashboard();
        showToast('🔄 Notícias originais restauradas!');
      }
    });
  }

  /* --------------------------------------------------------------------------
   * BOTÕES PARA VOLTAR AO TOPO DO PAINEL
   * -------------------------------------------------------------------------- */
  const adminScrollTopBtn = document.getElementById('adminScrollTopBtn');
  const footerScrollTopBtn = document.getElementById('footerScrollTopBtn');

  if (adminScrollTopBtn) {
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 300) {
          adminScrollTopBtn.classList.add('visible');
        } else {
          adminScrollTopBtn.classList.remove('visible');
        }
      },
      { passive: true }
    );

    adminScrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  if (footerScrollTopBtn) {
    footerScrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Inicializa o painel
  await loadAndRenderDashboard();
});
