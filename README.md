# 🌱 SS Agro — Site Institucional, Blog Interativo & Painel Gerencial

Site institucional moderno da **SS Agro Sistemas de Gestão (SS-Agro ERP)**, desenvolvido com identidade visual oficial (`#0f273c`, `#5de0e6` e `#004aad`), banner em vídeo com transição contínua (*crossfade*), **Blog Interativo** e **Painel Gerencial Completo (CMS + Analytics)**.

---

## 🚀 Estrutura do Projeto

- `index.html` — Página inicial completa (Banner em vídeo duplo, 4 Segmentos, Soluções Desktop/BI/Mobile, 16 Módulos interativos, Sobre Nós, Blog Dinâmico e Unidades de Rio Verde e Goiânia).
- `artigo.html` — Tela de leitura individual das notícias do Blog com barra de progresso, tempo estimado de leitura, contador automático de visualizações (`+1 leitura`), compartilhamento no WhatsApp e notícias relacionadas.
- `admin.html` & `admin.js` — **Painel Gerencial do Blog**, contendo:
  - **4 Indicadores Executivos (KPIs):** Total de Leituras, Notícias Publicadas vs. Ocultas, Média por Artigo e Notícia Campeã de Audiência (🏆).
  - **Gráfico Gerencial de Desempenho de Leitura:** Barras horizontais comparativas + Gráfico de Colunas em Canvas 2D mostrando qual notícia teve mais leitura.
  - **Gráfico de Rosca (Donut Chart):** Distribuição de leituras por categoria.
  - **Gerenciador de Notícias (CRUD):** Criar nova notícia, fazer upload de foto de capa, editar texto, excluir, exportar CSV e alternar visibilidade no site em tempo real.
- `blog-data.js` — Cliente unificado de dados do Blog (`window.SSAgroBlog`) com suporte à API REST e fallback automático em `localStorage`.
- `data/blog.json` — Banco de dados JSON com os artigos completos do Blog SS Agro.
- `server.py` — Servidor HTTP local em Python com suporte a *Byte-Range Video Streaming* (`HTTP 206`) e API REST completa (`/api/posts`, `/api/posts/<id>/view`, `/api/upload`).
- `iniciar-site.bat` — Atalho para iniciar o servidor local no Windows com um clique.

---

## 💻 Como Executar Localmente

1. Certifique-se de ter o **Python 3** instalado.
2. Dê dois cliques em `iniciar-site.bat` ou execute no terminal:
   ```bash
   python server.py
   ```
3. Acesse no navegador:
   - **Site Principal:** `http://localhost:8080`
   - **Painel Gerencial do Blog:** `http://localhost:8080/admin.html`
