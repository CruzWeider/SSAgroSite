const fs = require('fs');

async function download(url, dest) {
  try {
    const res = await fetch(url);
    if (res.status !== 200) {
      console.error(`Falha ao baixar ${url}: status ${res.status}`);
      return false;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`Baixado com sucesso: ${dest} (${buf.length} bytes) de ${url}`);
    return true;
  } catch (e) {
    console.error(`Erro ao baixar ${url}:`, e.message);
    return false;
  }
}

async function run() {
  await download('https://ssagro.com.br/blog-ss-agro/_assets/media/39cab0301e484b2fc45f2c01d5475225.jpg', 'assets/blog-elnino.jpg');
  await download('https://ssagro.com.br/blog-ss-agro/_assets/media/743173d8fd5f9064fe2e2a54c53544f9.jpg', 'assets/blog-fertilizantes.jpg');
  await download('https://ssagro.com.br/blog-ss-agro/_assets/media/b8ba124607b85589c4789bc45b4050c9.jpg', 'assets/blog-manejo.jpg');
  await download('https://ssagro.com.br/blog-ss-agro/_assets/media/d6aff9023bb5d8d621aedba2669a4de6.jpg', 'assets/blog-milho.jpg');
  await download('https://ssagro.com.br/blog-ss-agro/_assets/media/092767a0e634ef4aecd3fc4a75c740c8.png', 'assets/blog-card-bg.png');
}
run();
