const fs = require('fs');

const posts = JSON.parse(fs.readFileSync('scratch/all_complete_ssagro_posts.json', 'utf-8'));
console.log('Total posts in all_complete_ssagro_posts.json:', posts.length);
console.log('Sample post 0:', posts[0]);
console.log('Sample post 10:', posts[10]);
console.log('Sample post 60:', posts[60]);
