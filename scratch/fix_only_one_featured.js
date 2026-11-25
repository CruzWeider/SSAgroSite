const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('data/blog.json', 'utf-8'));
for (const p of posts) {
  if (p.slug === 'el-nino-agressivo-janela-plantio') {
    p.featured = true;
  } else {
    p.featured = false;
  }
}
posts.sort((a, b) => {
  if (a.featured && !b.featured) return -1;
  if (!a.featured && b.featured) return 1;
  return new Date(b.createdAt) - new Date(a.createdAt);
});
fs.writeFileSync('data/blog.json', JSON.stringify(posts, null, 2), 'utf-8');

let code = fs.readFileSync('blog-data.js', 'utf-8');
code = code.replace(
  /const DEFAULT_BLOG_POSTS = \[[\s\S]*?\];\n\nfunction getLocalPosts/,
  `const DEFAULT_BLOG_POSTS = ${JSON.stringify(posts, null, 2)};\n\nfunction getLocalPosts`
);
fs.writeFileSync('blog-data.js', code, 'utf-8');

console.log('Top 4 posts após ajuste de featured:');
posts.slice(0, 4).forEach((p, i) => console.log(`${i+1}. [${p.createdAt}] [Featured: ${p.featured}] ${p.title} -> ${p.image}`));
