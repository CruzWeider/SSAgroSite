async function inspectArticleHtml() {
  const url = 'https://ssagro.com.br/blog-ss-agro-conflitos-no-oriente-m-dio-elevam-alerta-e-pressionam-custos-do-agro-na-safra-2024-25';
  const res = await fetch(url);
  const html = await res.text();
  const match = html.match(/window\['bootstrap'\]\s*=\s*JSON\.parse\('([\s\S]*?)'\);/);
  if (!match) {
    console.log('No bootstrap');
    return;
  }
  const jsonStr = match[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  const data = JSON.parse(jsonStr);
  console.log('Bootstrap found! Inspecting rasters:');
  const full = JSON.stringify(data);
  const rasters = full.match(/_assets\/media\/[a-f0-9]+\.(?:jpg|jpeg|png|webp)/g) || [];
  const unique = Array.from(new Set(rasters));
  console.log(`Unique rasters in article (${unique.length}):`);
  for (const r of unique) {
    // test both root and subpath
    const r1 = await fetch(`https://ssagro.com.br/${r}`);
    if (r1.status === 200) {
      console.log(`  200 OK: https://ssagro.com.br/${r} (${r1.headers.get('content-type')}, ${r1.headers.get('content-length')} bytes)`);
    } else {
      const r2 = await fetch(`https://ssagro.com.br/blog-ss-agro/${r}`);
      if (r2.status === 200) {
        console.log(`  200 OK: https://ssagro.com.br/blog-ss-agro/${r} (${r2.headers.get('content-type')}, ${r2.headers.get('content-length')} bytes)`);
      }
    }
  }
}
inspectArticleHtml();
