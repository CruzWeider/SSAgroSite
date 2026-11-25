async function testAllPageImages() {
  const url = 'https://ssagro.com.br/blog-ss-agro-mercado-de-defensivos-agr-colas-respira-com-alta-de-3-e-movimenta-o-bilion-ria-na-safra-2024-25';
  const res = await fetch(url);
  const html = await res.text();
  const imgs = Array.from(new Set(html.match(/_assets\/media\/[a-f0-9]+\.(?:jpg|jpeg|png|webp)/g) || []));
  console.log(`Testando ${imgs.length} imagens da matéria...`);

  for (const img of imgs) {
    const u1 = `https://ssagro.com.br/${img}`;
    const r1 = await fetch(u1);
    if (r1.status === 200) {
      console.log(`200 OK: ${u1} (${r1.headers.get('content-type')}, ${r1.headers.get('content-length')} bytes)`);
    } else {
      const u2 = `https://ssagro.com.br/blog-ss-agro/${img}`;
      const r2 = await fetch(u2);
      if (r2.status === 200) {
        console.log(`200 OK: ${u2} (${r2.headers.get('content-type')}, ${r2.headers.get('content-length')} bytes)`);
      }
    }
  }
}
testAllPageImages();
