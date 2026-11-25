const fs = require('fs');

const html = fs.readFileSync('scratch/ssagro_2025.html', 'utf-8');
const match = html.match(/window\['bootstrap'\]\s*=\s*JSON\.parse\('([\s\S]*?)'\);/);

if (!match) {
  console.log('Não encontrou window[bootstrap]');
  process.exit(1);
}

// Em JSON.parse('...'), as aspas estão escapadas
const jsonStr = match[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
try {
  const data = JSON.parse(jsonStr);
  console.log('Bootstrap parsed com sucesso! Keys:', Object.keys(data));
  
  // Vamos buscar em todo o objeto data qualquer string que termine com jpg/png/webp
  const jsonFull = JSON.stringify(data);
  const mediaMatches = jsonFull.match(/_assets\/[^"'\\]+\.(jpg|jpeg|png|webp)/g) || [];
  console.log('Total de referências _assets/... com imagem:', mediaMatches.length);
  const uniqueMedias = Array.from(new Set(mediaMatches));
  console.log('Imagens únicas encontradas:', uniqueMedias.length);
  console.log('Primeiras 10:', uniqueMedias.slice(0, 10));
} catch (e) {
  console.error('Erro ao fazer parse do JSON:', e.message);
  // fallback regex direto na string
  const directMatches = html.match(/_assets\/(?:media|images)\/[a-f0-9]+\.(?:jpg|jpeg|png|webp)/g) || [];
  console.log('Direct regex matches:', directMatches.length, directMatches.slice(0, 5));
}
