import base64
import json
import os
import re
import threading
import time
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
BLOG_JSON_PATH = os.path.join(DATA_DIR, "blog.json")
ASSETS_DIR = os.path.join(BASE_DIR, "assets")

db_lock = threading.Lock()


def load_posts():
    with db_lock:
        if not os.path.exists(BLOG_JSON_PATH):
            return []
        try:
            with open(BLOG_JSON_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []


def save_posts(posts):
    with db_lock:
        os.makedirs(DATA_DIR, exist_ok=True)
        with open(BLOG_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(posts, f, ensure_ascii=False, indent=2)


class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True


class SSAgroHTTPRequestHandler(SimpleHTTPRequestHandler):
    """
    Servidor HTTP + API REST do Blog SS Agro:
    1. Serve páginas HTML, CSS, JS e mídias sem cache obsoleto.
    2. Suporta HTTP 206 Partial Content (Range) para streaming contínuo dos vídeos MP4.
    3. Fornece endpoints REST (/api/posts, /api/posts/<id>/view, /api/upload) para o
       Blog dinâmico e o Painel Gerencial de Notícias.
    """

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def _send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json_body(self):
        length = int(self.headers.get("Content-Length", 0))
        if length <= 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8", errors="ignore")
        try:
            return json.loads(raw)
        except Exception:
            return {}

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/posts":
            posts = load_posts()
            return self._send_json(posts)

        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # 1. Registrar leitura (+1 visualização) em uma notícia
        m_view = re.match(r"^/api/posts/([^/]+)/view$", path)
        if m_view:
            target_key = urllib.parse.unquote(m_view.group(1))
            posts = load_posts()
            updated_post = None
            for p in posts:
                if p.get("id") == target_key or p.get("slug") == target_key:
                    p["views"] = int(p.get("views", 0)) + 1
                    hist = p.get("viewsHistory", [10, 12, 15, 14, 18, 20, 15])
                    if not isinstance(hist, list) or len(hist) == 0:
                        hist = [1]
                    else:
                        hist[-1] = int(hist[-1]) + 1
                    p["viewsHistory"] = hist
                    updated_post = p
                    break

            if updated_post:
                save_posts(posts)
                return self._send_json({"ok": True, "post": updated_post})
            return self._send_json({"ok": False, "error": "Notícia não encontrada"}, 404)

        # 2. Criar nova notícia ou substituir lista completa
        if path == "/api/posts":
            payload = self._read_json_body()
            posts = load_posts()

            if isinstance(payload, list):
                save_posts(payload)
                return self._send_json({"ok": True, "posts": payload})

            new_id = payload.get("id") or f"post-{int(time.time() * 1000)}"
            slug = payload.get("slug") or f"noticia-{int(time.time())}"
            new_post = {
                "id": new_id,
                "slug": slug,
                "title": payload.get("title", "Nova Notícia SS Agro"),
                "subtitle": payload.get("subtitle", ""),
                "category": payload.get("category", "Análises de Mercado"),
                "image": payload.get("image", "assets/blog-1.jpg"),
                "createdAt": payload.get("createdAt", time.strftime("%Y-%m-%d")),
                "readTime": payload.get("readTime", "4 min de leitura"),
                "author": payload.get("author", "Equipe SS Agro"),
                "published": bool(payload.get("published", True)),
                "featured": bool(payload.get("featured", False)),
                "views": int(payload.get("views", 0)),
                "viewsHistory": payload.get("viewsHistory", [0, 0, 0, 0, 0, 0, int(payload.get("views", 0))]),
                "content": payload.get("content", []),
            }
            posts.insert(0, new_post)
            save_posts(posts)
            return self._send_json({"ok": True, "post": new_post}, 201)

        # 3. Upload de imagem de capa para a pasta assets/
        if path == "/api/upload":
            payload = self._read_json_body()
            data_url = payload.get("dataUrl", "")
            filename = payload.get("filename", f"blog-upload-{int(time.time())}.jpg")
            safe_name = re.sub(r"[^a-zA-Z0-9._-]", "_", filename)
            safe_name = f"blog-{int(time.time())}-{safe_name}"

            if "," in data_url:
                _, b64data = data_url.split(",", 1)
                binary = base64.b64decode(b64data)
                os.makedirs(ASSETS_DIR, exist_ok=True)
                out_path = os.path.join(ASSETS_DIR, safe_name)
                with open(out_path, "wb") as f:
                    f.write(binary)
                return self._send_json({"ok": True, "url": f"assets/{safe_name}"})

            return self._send_json({"ok": False, "error": "Imagem inválida"}, 400)

        return self._send_json({"ok": False, "error": "Rota não encontrada"}, 404)

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        m_put = re.match(r"^/api/posts/([^/]+)$", parsed.path)
        if not m_put:
            return self._send_json({"ok": False, "error": "Rota inválida"}, 404)

        target_id = urllib.parse.unquote(m_put.group(1))
        payload = self._read_json_body()
        posts = load_posts()

        for idx, p in enumerate(posts):
            if p.get("id") == target_id or p.get("slug") == target_id:
                updated = {**p, **payload, "id": p.get("id")}
                posts[idx] = updated
                save_posts(posts)
                return self._send_json({"ok": True, "post": updated})

        return self._send_json({"ok": False, "error": "Notícia não encontrada"}, 404)

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        m_del = re.match(r"^/api/posts/([^/]+)$", parsed.path)
        if not m_del:
            return self._send_json({"ok": False, "error": "Rota inválida"}, 404)

        target_id = urllib.parse.unquote(m_del.group(1))
        posts = load_posts()
        new_posts = [p for p in posts if p.get("id") != target_id and p.get("slug") != target_id]
        save_posts(new_posts)
        return self._send_json({"ok": True})

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()

        range_header = self.headers.get("Range")
        if not range_header:
            return super().send_head()

        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        fs = os.fstat(f.fileno())
        file_len = fs[6]

        m = re.match(r"bytes=(\d+)-(\d*)", range_header)
        if not m:
            f.close()
            return super().send_head()

        start = int(m.group(1))
        end = int(m.group(2)) if m.group(2) else file_len - 1

        if start >= file_len:
            f.close()
            self.send_error(416, "Requested Range Not Satisfiable")
            return None

        end = min(end, file_len - 1)
        length = end - start + 1

        self.send_response(206)
        ctype = self.guess_type(path)
        self.send_header("Content-type", ctype)
        self.send_header("Content-Range", f"bytes {start}-{end}/{file_len}")
        self.send_header("Content-Length", str(length))
        self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
        self.end_headers()

        f.seek(start)
        self._range_length = length
        return f

    def copyfile(self, source, outputfile):
        length = getattr(self, "_range_length", None)
        if length is None:
            try:
                super().copyfile(source, outputfile)
            except (ConnectionResetError, BrokenPipeError):
                pass
            return

        bufsize = 64 * 1024
        remaining = length
        try:
            while remaining > 0:
                chunk = source.read(min(bufsize, remaining))
                if not chunk:
                    break
                outputfile.write(chunk)
                remaining -= len(chunk)
        except (ConnectionResetError, BrokenPipeError):
            pass
        finally:
            self._range_length = None


if __name__ == "__main__":
    os.chdir(BASE_DIR)
    server = ThreadingHTTPServer(("0.0.0.0", 8080), SSAgroHTTPRequestHandler)
    print("Servidor SS Agro + API do Blog rodando em http://localhost:8080")
    server.serve_forever()
