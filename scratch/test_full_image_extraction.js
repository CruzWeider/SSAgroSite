const fs = require('fs');

function extractMediaMappings(filePath) {
  console.log(`\n================ Processing ${filePath} ================`);
  const html = fs.readFileSync(filePath, 'utf-8');

  // 1. Extrair todas as definições RASTER
  // {"type":"RASTER","id":"MAHUPVBnoJ4","version":1,"files":[{"url":"_assets/media/39cab0301e484b2fc45f2c01d5475225.jpg","urlDenied":false,"width":800,"height":597, ...
  const rasterRegex = /\{"type":"RASTER","id":"([^"]+)","version":\d+,"files":(\[[^\]]+\])\}/g;
  const mediaToFiles = new Map();
  let m;
  while ((m = rasterRegex.exec(html)) !== null) {
    const id = m[1];
    try {
      const files = JSON.parse(m[2]);
      if (!mediaToFiles.has(id)) {
        mediaToFiles.set(id, files);
      }
    } catch (e) {}
  }
  console.log(`Encontrados ${mediaToFiles.size} registros de mídia RASTER.`);

  // 2. Extrair bootstrap para pegar os elementos da página
  const match = html.match(/window\['bootstrap'\]\s*=\s*JSON\.parse\('([\s\S]*?)'\);/);
  if (!match) {
    console.log('Sem bootstrap');
    return [];
  }
  const jsonStr = match[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  const data = JSON.parse(jsonStr);

  // Percorrer todas as seções e elementos da página
  const urlToImage = new Map();
  const urlToTitle = new Map();

  function traverse(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      obj.forEach(traverse);
      return;
    }

    // Se o elemento tem link G e mídia b[...].B.B.A.A
    if (obj.G && typeof obj.G === 'string') {
      const linkUrl = obj.G.trim();
      let mediaId = null;

      // Procurar se tem mídia em obj.b
      if (Array.isArray(obj.b)) {
        for (const item of obj.b) {
          if (item?.B?.B?.A?.A && typeof item.B.B.A.A === 'string') {
            mediaId = item.B.B.A.A;
            break;
          }
        }
      }

      if (mediaId && mediaToFiles.has(mediaId)) {
        const files = mediaToFiles.get(mediaId);
        // Pega preferencialmente o de qualidade SCREEN ou largura em torno de 800-1200
        let chosen = files[0];
        for (const f of files) {
          if (f.width >= 600 && f.width <= 1600) {
            chosen = f;
            break;
          }
        }
        if (chosen && chosen.url) {
          urlToImage.set(linkUrl, chosen.url);
        }
      }
    }

    // Continuar descendo
    for (const v of Object.values(obj)) {
      if (typeof v === 'object') traverse(v);
    }
  }

  traverse(data.page);
  console.log(`Mapeadas ${urlToImage.size} URLs com imagem de capa.`);

  // Imprimir amostras
  let i = 0;
  for (const [u, img] of urlToImage.entries()) {
    if (i++ < 5) {
      console.log(`  Link: ${u.split('/').pop().slice(0, 50)}...`);
      console.log(`  Img:  ${img}`);
    }
  }

  return { mediaToFiles, urlToImage };
}

const res2025 = extractMediaMappings('scratch/ssagro_2025.html');
const res2026p1 = extractMediaMappings('scratch/ssagro_2026_p1.html');
const res2026p2 = extractMediaMappings('scratch/ssagro_2026_p2.html');
