const fs = require('fs');

const posts = JSON.parse(fs.readFileSync('data/blog.json', 'utf8'));

let content = fs.readFileSync('blog-data.js', 'utf8');

const startIndex = content.indexOf('const DEFAULT_BLOG_POSTS = [');
const endIndex = content.indexOf('function slugifyText(text) {');

if (startIndex !== -1 && endIndex !== -1) {
  const newDeclar = 'const DEFAULT_BLOG_POSTS = ' + JSON.stringify(posts, null, 2) + ';\n\n';
  content = content.substring(0, startIndex) + newDeclar + content.substring(endIndex);
  fs.writeFileSync('blog-data.js', content, 'utf8');
  console.log('blog-data.js successfully updated with ' + posts.length + ' default posts!');
} else {
  console.error('Indices:', { startIndex, endIndex });
}
