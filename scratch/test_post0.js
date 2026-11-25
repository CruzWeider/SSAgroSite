async function test() {
  const url = 'https://ssagro.com.br/blog-ss-agro-mercado-de-defensivos-agr-colas-respira-com-alta-de-3-e-movimenta-o-bilion-ria-na-safra-2024-25';
  const res = await fetch(url);
  console.log('Status:', res.status);
  const html = await res.text();
  const imgs = html.match(/_assets\/media\/[a-f0-9]+\.jpg/g) || [];
  console.log('Unique JPGs:', Array.from(new Set(imgs)));
}
test();
