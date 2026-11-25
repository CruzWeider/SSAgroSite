const fs = require('fs');

const posts = JSON.parse(fs.readFileSync('data/blog.json', 'utf-8'));

// Identificar os 4 posts originais
for (const p of posts) {
  if (p.slug === 'el-nino-agressivo-janela-plantio') {
    p.createdAt = '2026-10-31';
    p.featured = true;
    p.image = 'assets/blog-elnino.jpg';
  } else if (p.slug === 'nova-legislacao-fertilizantes-nacionais') {
    p.createdAt = '2026-10-30';
    p.image = 'assets/blog-fertilizantes.jpg';
  } else if (p.slug === 'manejo-fisiologico-protecao-termica') {
    p.createdAt = '2026-10-29';
    p.image = 'assets/blog-manejo.jpg';
  } else if (p.slug === 'consumo-interno-milho-barter-safrinha') {
    p.createdAt = '2026-10-28';
    p.image = 'assets/blog-milho.jpg';
  } else {
    // Garantir que nenhum outro post tenha data superior a 2026-10-27
    if (p.createdAt > '2026-10-27') {
      p.createdAt = '2026-10-20';
    }
  }
}

// Ordenar para garantir que fiquem no topo
posts.sort((a, b) => {
  if (a.featured && !b.featured) return -1;
  if (!a.featured && b.featured) return 1;
  return new Date(b.createdAt) - new Date(a.createdAt);
});

fs.writeFileSync('data/blog.json', JSON.stringify(posts, null, 2), 'utf-8');

// Também atualizar blog-data.js
let code = fs.readFileSync('blog-data.js', 'utf-8');
code = code.replace(
  /const DEFAULT_BLOG_POSTS = \[[\s\S]*?\];\n\nfunction getLocalPosts/,
  `const DEFAULT_BLOG_POSTS = ${JSON.stringify(posts, null, 2)};\n\nfunction getLocalPosts`
);
fs.writeFileSync('blog-data.js', code, 'utf-8');

console.log('Top 4 posts após ajuste de datas:');
posts.slice(0, 4).forEach((p, i) => console.log(`${i+1}. [${p.createdAt}] ${p.title} -> ${p.image}`));
