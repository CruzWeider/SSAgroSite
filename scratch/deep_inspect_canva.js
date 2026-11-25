const fs = require('fs');

function inspectCanvaStructure(file) {
  console.log(`\n================== ${file} ==================`);
  const html = fs.readFileSync(file, 'utf-8');
  const match = html.match(/window\['bootstrap'\]\s*=\s*JSON\.parse\('([\s\S]*?)'\);/);
  if (!match) return;
  const jsonStr = match[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  const data = JSON.parse(jsonStr);

  // Vamos ver o que tem em page
  console.log('page keys:', Object.keys(data.page || {}));
  
  // Vamos buscar onde os textos (títulos das matérias) estão e quem é o parente / container
  // Vamos pegar 2 títulos conhecidos
  const sampleTitles = [
    'El Niño',
    'Fertilizantes',
    'Manejo',
    'Milho',
    'Barter',
    'Soja'
  ];

  // Vamos percorrer o objeto data recursivamente procurando textos ou links
  function findNodes(obj, path = '', results = []) {
    if (!obj || typeof obj !== 'object') return results;
    if (Array.isArray(obj)) {
      obj.forEach((item, idx) => findNodes(item, `${path}[${idx}]`, results));
      return results;
    }
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string') {
        for (const st of sampleTitles) {
          if (v.toLowerCase().includes(st.toLowerCase()) && v.length < 150) {
            results.push({ path: `${path}.${k}`, text: v, parentKeys: Object.keys(obj) });
            break;
          }
        }
      } else if (typeof v === 'object') {
        findNodes(v, `${path}.${k}`, results);
      }
    }
    return results;
  }

  const nodes = findNodes(data.page);
  console.log(`Encontrados ${nodes.length} nós de texto de exemplo.`);
  if (nodes.length > 0) {
    console.log('Exemplo 1:', nodes[0]);
    console.log('Exemplo 2:', nodes[1]);
  }
}

inspectCanvaStructure('scratch/ssagro_2025.html');
