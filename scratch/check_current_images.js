const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('data/blog.json', 'utf-8'));
console.log('Total posts in data/blog.json:', posts.length);
for (let i = 0; i < 15; i++) {
  console.log(`${i+1}. [${posts[i].edition}] ${posts[i].title.slice(0, 45)}... => ${posts[i].image}`);
}
