async function checkBase() {
  const url = 'https://ssagro.com.br/blog-ss-agro-mercado-de-defensivos-agr-colas-respira-com-alta-de-3-e-movimenta-o-bilion-ria-na-safra-2024-25';
  const res = await fetch(url);
  const html = await res.text();
  const baseMatch = html.match(/<base[^>]+>/i);
  console.log('Base:', baseMatch ? baseMatch[0] : 'None');
  // Check any 200 image URL on that page
  const imgs = html.match(/_assets\/media\/[a-f0-9]+\.(?:jpg|jpeg|png|webp)/g) || [];
  const unique = Array.from(new Set(imgs));
  for (const img of unique.slice(0, 5)) {
    const candidates = [
      `https://ssagro.com.br/${img}`,
      `https://ssagro.com.br/blog-ss-agro/${img}`,
      `https://ssagro.com.br/blog-ss-agro-mercado-de-defensivos-agr-colas-respira-com-alta-de-3-e-movimenta-o-bilion-ria-na-safra-2024-25/${img}`
    ];
    for (const c of candidates) {
      const cr = await fetch(c);
      if (cr.status === 200) {
        console.log('FOUND 200:', c, cr.headers.get('content-type'));
        return;
      }
    }
  }
}
checkBase();
