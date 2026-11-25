const fs = require('fs');

function inspect(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(filePath, 'não existe');
    return;
  }
  const html = fs.readFileSync(filePath, 'utf-8');
  console.log(`\n=== Arquivo: ${filePath} (Tamanho: ${html.length} bytes) ===`);

  // Procurar por URLs
  const urls = html.match(/https?:\/\/[^\s"'<>\)]+/g) || [];
  console.log('Total de URLs:', urls.length);

  const imgUrls = urls.filter(u => /\.(jpg|jpeg|png|webp|gif)/i.test(u) || u.includes('/media/') || u.includes('/images/') || u.includes('static-cse'));
  console.log('URLs candidatas a imagens:', imgUrls.length);
  console.log('Primeiras 15 URLs de imagem:', imgUrls.slice(0, 15));

  // Procurar por tags <image
  const svgImages = html.match(/<image[^>]+>/g) || [];
  console.log('Tags <image (SVG):', svgImages.length);
  if (svgImages.length > 0) {
    console.log('Exemplos de SVG <image:', svgImages.slice(0, 3));
  }

  // Procurar por "url("
  const cssUrls = html.match(/url\(['"]?[^'")]+['"]?\)/g) || [];
  console.log('Ocorrências de url(...):', cssUrls.length);
  if (cssUrls.length > 0) {
    console.log('Exemplos url(...):', cssUrls.slice(0, 5));
  }

  // Procurar scripts com JSON ou dados embutidos
  const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
  console.log('Total de tags <script>:', scripts.length);
  for (let i = 0; i < scripts.length; i++) {
    const sc = scripts[i];
    if (sc.includes('image') || sc.includes('.jpg') || sc.includes('.png')) {
      console.log(`Script #${i} contém referências a imagem (tamanho: ${sc.length})`);
    }
  }
}

inspect('scratch/ssagro_2025.html');
inspect('scratch/ssagro_2026_p1.html');
inspect('scratch/ssagro_2026_p2.html');
