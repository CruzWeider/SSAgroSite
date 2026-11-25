const fs = require('fs');

const posts = JSON.parse(fs.readFileSync('data/blog.json', 'utf-8'));

const targets = [
  'El Niño',
  'Nova Legislação de Fertilizantes',
  'Manejo Fisiológico',
  'Consumo Interno de Milho'
];

for (const t of targets) {
  const found = posts.filter(p => p.title.toLowerCase().includes(t.toLowerCase()) || p.slug.toLowerCase().includes(t.toLowerCase()));
  console.log(`\nBusca por "${t}": ${found.length} encontrado(s)`);
  found.forEach(f => console.log(`  ID: ${f.id} | Slug: ${f.slug} | Title: ${f.title} | Current Img: ${f.image} | Edition: ${f.edition} | Featured: ${f.featured}`));
}
