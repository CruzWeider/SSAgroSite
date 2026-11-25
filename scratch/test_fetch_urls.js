async function testFetch() {
  const urls = [
    'https://ssagro.com.br/blog-ss-agro/ssagro-2025',
    'https://ssagro.com.br/blog-ss-agro/ssagro-2026---parte-1',
    'https://ssagro.com.br/blog-ss-agro/ssagro-2026---parte-2'
  ];

  for (const u of urls) {
    console.log('\nFetching:', u);
    const res = await fetch(u, { redirect: 'follow' });
    console.log('Status:', res.status, 'Final URL:', res.url);
    const text = await res.text();
    console.log('Length:', text.length);
    // count RASTER
    const rasters = text.match(/\{"type":"RASTER"/g) || [];
    console.log('RASTER count:', rasters.length);
    // count media files
    const mediaFiles = text.match(/_assets\/media\/[a-f0-9]+\.(?:jpg|jpeg|png|webp)/g) || [];
    console.log('Media files count:', new Set(mediaFiles).size);
    // check title
    const titleMatch = text.match(/<title>([^<]+)<\/title>/);
    console.log('Title:', titleMatch ? titleMatch[1] : 'none');
  }
}
testFetch();
