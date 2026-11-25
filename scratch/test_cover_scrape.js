const fs = require('fs');

const posts = JSON.parse(fs.readFileSync('data/blog.json', 'utf-8'));
console.log('Total posts:', posts.length);

async function testFetchCover(post) {
  const url = `https://ssagro.com.br/blog-ss-agro-${post.slug}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (res.status !== 200) return null;
    const html = await res.text();
    // In Canva article page, look for the main content photo (usually a large JPG or PNG)
    // Exclude header/footer logos and icons
    const ignored = new Set([
      'a5be765a8729a00341c84376d610cf33.png',
      '0f44acb9910a2cecc032f32b185f9ef6.png',
      'ae180eb9e0c871bc8a0590847af4c891.png',
      '01fe8a63b21c178f1af1e720fdb8eab9.png',
      '217e05aef375a015d18b8151c6ee1610.png',
      '9e0817c851f19a6288de81375744e03c.png',
      'fb3c84835f4957b808c3f24a39238922.png',
      '1871a124c4782c5676d8c0ca7d6c38ba.png',
      '2cebffd4c435988dbb36c11612057ffc.png',
      '38ca8a6d08e6d49f6389fcc1d0dd6164.png',
      '690caf6c2f3a7bc244a8716013849751.png',
      '9bf894ac18a5cb49f697d44cad565e0e.png',
      '17b670fa568f881f80196b31236f5279.jpg',
      'c891e58c6c4793a5cfe72b57330ceb2c.jpg',
      'e76e27dc3259323db10e0c658d7c9b2b.jpg',
      '59e2e936625ce0c1cc5dd1a688234d93.png'
    ]);

    const allMedia = html.match(/_assets\/media\/([a-f0-9]+\.(?:jpg|jpeg|png|webp))/g) || [];
    for (const m of allMedia) {
      const filename = m.replace('_assets/media/', '');
      if (!ignored.has(filename)) {
        return `https://ssagro.com.br/blog-ss-agro/${m}`;
      }
    }
  } catch (e) {
    return null;
  }
  return null;
}

async function runSample() {
  console.log('Testando 5 matérias...');
  for (let i = 0; i < 5; i++) {
    const p = posts[i];
    const img = await testFetchCover(p);
    console.log(`[${p.id}] ${p.title.slice(0, 40)}... -> ${img}`);
  }
}
runSample();
