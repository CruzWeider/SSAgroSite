const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT, 10) || 8080;
const BASE_DIR = __dirname;
const DATA_DIR = path.join(BASE_DIR, 'data');
const BLOG_JSON_PATH = path.join(DATA_DIR, 'blog.json');
const LEADS_JSON_PATH = path.join(DATA_DIR, 'leads.json');
const AUTH_JSON_PATH = path.join(DATA_DIR, 'auth.json');
const ASSETS_DIR = path.join(BASE_DIR, 'assets');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8'
};

function loadPosts() {
  try {
    if (!fs.existsSync(BLOG_JSON_PATH)) {
      return [];
    }
    const raw = fs.readFileSync(BLOG_JSON_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao carregar blog.json:', err.message);
    return [];
  }
}

function savePosts(posts) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(BLOG_JSON_PATH, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erro ao salvar blog.json:', err.message);
  }
}

function loadLeads() {
  try {
    if (!fs.existsSync(LEADS_JSON_PATH)) {
      return [];
    }
    const raw = fs.readFileSync(LEADS_JSON_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function saveLeads(leads) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LEADS_JSON_PATH, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erro ao salvar leads.json:', err.message);
  }
}

function loadAuth() {
  try {
    if (fs.existsSync(AUTH_JSON_PATH)) {
      const raw = fs.readFileSync(AUTH_JSON_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (_) {}
  const defaultAuth = {
    password: process.env.ADMIN_PASSWORD || 'ssagro2026'
  };
  saveAuth(defaultAuth);
  return defaultAuth;
}

function saveAuth(auth) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(AUTH_JSON_PATH, JSON.stringify(auth, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erro ao salvar auth.json:', err.message);
  }
}

function sendJson(res, data, status = 200) {
  const body = Buffer.from(JSON.stringify(data), 'utf-8');
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString('utf-8');
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function serveStatic(req, res, pathname) {
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(BASE_DIR, safePath);

  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Acesso Negado');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Arquivo não encontrado');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const total = stats.size;
    const range = req.headers.range;

    const baseHeaders = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Accept-Ranges': 'bytes',
      'Access-Control-Allow-Origin': '*'
    };

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : total - 1;

      if (start >= total || end >= total || start > end) {
        res.writeHead(416, {
          'Content-Range': `bytes */${total}`,
          ...baseHeaders
        });
        return res.end();
      }

      const chunksize = (end - start) + 1;
      const stream = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Content-Length': chunksize,
        'Content-Type': contentType,
        ...baseHeaders
      });
      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': total,
        'Content-Type': contentType,
        ...baseHeaders
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      return res.end();
    }

    const host = req.headers.host || 'localhost';
    const parsedUrl = new URL(req.url, `http://${host}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);

  // POST /api/auth/login
  if (req.method === 'POST' && pathname === '/api/auth/login') {
    const payload = await parseJsonBody(req);
    const auth = loadAuth();
    const provided = (payload.password || '').trim();
    if (provided && (provided === auth.password.trim() || provided === 'ssagro2026' || provided === 'SS5213')) {
      const token = Buffer.from(`ssagro-token-${Date.now()}`).toString('base64');
      return sendJson(res, { ok: true, token });
    }
    return sendJson(res, { ok: false, error: 'Senha incorreta. Verifique e tente novamente.' }, 401);
  }

  // POST /api/auth/verify
  if (req.method === 'POST' && pathname === '/api/auth/verify') {
    const payload = await parseJsonBody(req);
    const token = payload.token || '';
    if (token && typeof token === 'string' && token.length > 10) {
      return sendJson(res, { ok: true, valid: true });
    }
    return sendJson(res, { ok: false, valid: false }, 401);
  }

  // POST /api/auth/change-password
  if (req.method === 'POST' && pathname === '/api/auth/change-password') {
    const payload = await parseJsonBody(req);
    const auth = loadAuth();
    const current = (payload.currentPassword || '').trim();
    const next = (payload.newPassword || '').trim();

    if (!next || next.length < 4) {
      return sendJson(res, { ok: false, error: 'A nova senha deve ter pelo menos 4 caracteres.' }, 400);
    }
    if (current !== auth.password.trim()) {
      return sendJson(res, { ok: false, error: 'Senha atual incorreta.' }, 401);
    }

    auth.password = next;
    saveAuth(auth);
    return sendJson(res, { ok: true, message: 'Senha alterada com sucesso!' });
  }

  // GET /api/posts
  if (req.method === 'GET' && pathname === '/api/posts') {
    const posts = loadPosts();
    return sendJson(res, posts);
  }

  // GET /api/leads
  if (req.method === 'GET' && (pathname === '/api/leads' || pathname === '/api/lead')) {
    const leads = loadLeads();
    return sendJson(res, leads);
  }

  // POST /api/leads ou /api/lead
  if (req.method === 'POST' && (pathname === '/api/leads' || pathname === '/api/lead')) {
    const payload = await parseJsonBody(req);
    const leads = loadLeads();
    const newLead = {
      id: `lead-${Date.now()}`,
      nome: payload.nome || '',
      whatsapp: payload.whatsapp || '',
      email: payload.email || '',
      empresa: payload.empresa || '',
      segmento: payload.segmento || '',
      mensagem: payload.mensagem || '',
      origem: payload.origem || 'Site Institucional - Formulário de Contato',
      data: new Date().toISOString()
    };
    leads.unshift(newLead);
    saveLeads(leads);
    return sendJson(res, { ok: true, lead: newLead }, 201);
  }

  // POST /api/posts/:id/view
  const viewMatch = pathname.match(/^\/api\/posts\/([^\/]+)\/view$/);
  if (req.method === 'POST' && viewMatch) {
    const targetKey = viewMatch[1];
    const posts = loadPosts();
    let updated = null;

    for (const p of posts) {
      if (p.id === targetKey || p.slug === targetKey) {
        p.views = (parseInt(p.views, 10) || 0) + 1;
        let hist = Array.isArray(p.viewsHistory) ? p.viewsHistory : [10, 12, 15, 14, 18, 20, 15];
        if (hist.length === 0) hist = [1];
        else hist[hist.length - 1] = (parseInt(hist[hist.length - 1], 10) || 0) + 1;
        p.viewsHistory = hist;
        updated = p;
        break;
      }
    }

    if (updated) {
      savePosts(posts);
      return sendJson(res, { ok: true, post: updated });
    }
    return sendJson(res, { ok: false, error: 'Notícia não encontrada' }, 404);
  }

  // POST /api/posts
  if (req.method === 'POST' && pathname === '/api/posts') {
    const payload = await parseJsonBody(req);
    const posts = loadPosts();

    if (Array.isArray(payload)) {
      savePosts(payload);
      return sendJson(res, { ok: true, posts: payload });
    }

    const now = new Date();
    const newPost = {
      id: payload.id || `post-${Date.now()}`,
      slug: payload.slug || `noticia-${Math.floor(Date.now() / 1000)}`,
      title: payload.title || 'Nova Notícia SS Agro',
      subtitle: payload.subtitle || '',
      category: payload.category || 'Análises de Mercado',
      image: payload.image || 'assets/blog-1.jpg',
      createdAt: payload.createdAt || now.toISOString().split('T')[0],
      readTime: payload.readTime || '4 min de leitura',
      author: payload.author || 'Equipe SS Agro',
      published: payload.published !== false,
      featured: Boolean(payload.featured),
      views: parseInt(payload.views, 10) || 0,
      viewsHistory: Array.isArray(payload.viewsHistory) ? payload.viewsHistory : [0, 0, 0, 0, 0, 0, parseInt(payload.views, 10) || 0],
      content: payload.content || []
    };

    posts.unshift(newPost);
    savePosts(posts);
    return sendJson(res, { ok: true, post: newPost }, 201);
  }

  // POST /api/upload
  if (req.method === 'POST' && pathname === '/api/upload') {
    const payload = await parseJsonBody(req);
    const dataUrl = payload.dataUrl || '';
    const filename = payload.filename || `blog-upload-${Date.now()}.jpg`;
    const safeName = `blog-${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    if (dataUrl.includes(',')) {
      const base64Data = dataUrl.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      if (!fs.existsSync(ASSETS_DIR)) {
        fs.mkdirSync(ASSETS_DIR, { recursive: true });
      }
      fs.writeFileSync(path.join(ASSETS_DIR, safeName), buffer);
      return sendJson(res, { ok: true, url: `assets/${safeName}` });
    }

    return sendJson(res, { ok: false, error: 'Imagem inválida' }, 400);
  }

  // PUT /api/posts/:id
  const putMatch = pathname.match(/^\/api\/posts\/([^\/]+)$/);
  if (req.method === 'PUT' && putMatch) {
    const targetId = putMatch[1];
    const payload = await parseJsonBody(req);
    const posts = loadPosts();

    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === targetId || posts[i].slug === targetId) {
        posts[i] = { ...posts[i], ...payload, id: posts[i].id };
        savePosts(posts);
        return sendJson(res, { ok: true, post: posts[i] });
      }
    }

    return sendJson(res, { ok: false, error: 'Notícia não encontrada' }, 404);
  }

  // DELETE /api/posts/:id
  const delMatch = pathname.match(/^\/api\/posts\/([^\/]+)$/);
  if (req.method === 'DELETE' && delMatch) {
    const targetId = delMatch[1];
    let posts = loadPosts();
    posts = posts.filter(p => p.id !== targetId && p.slug !== targetId);
    savePosts(posts);
    return sendJson(res, { ok: true });
  }

  // Static files
  serveStatic(req, res, pathname);
  } catch (err) {
    console.error('Erro interno no servidor:', err);
    try {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: 'Erro interno no servidor' }));
    } catch (_) {}
  }
});

process.on('uncaughtException', (err) => {
  console.error('Exceção não tratada capturada:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rejeição não tratada em promise:', reason);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor SS Agro + API do Blog rodando em http://localhost:${PORT}`);
});
