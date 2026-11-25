const fs = require('fs');

const originalPosts = JSON.parse(fs.readFileSync('data/blog.json', 'utf8'));
const extractedPosts = JSON.parse(fs.readFileSync('scratch/all_complete_ssagro_posts.json', 'utf8'));

// Map original deep articles by slug
const origMap = {};
originalPosts.forEach(p => {
  if (p.slug) origMap[p.slug] = p;
});

// Replace in extractedPosts if original exists
const merged = extractedPosts.map((post, index) => {
  if (origMap[post.slug]) {
    const orig = origMap[post.slug];
    return {
      ...post,
      title: orig.title || post.title,
      subtitle: orig.subtitle || post.subtitle,
      author: orig.author || post.author,
      content: orig.content || post.content,
      readTime: orig.readTime || post.readTime,
      category: orig.category || post.category,
      image: orig.image || post.image,
      featured: (index === 0)
    };
  }
  return post;
});

console.log('Merged total:', merged.length);
fs.writeFileSync('data/blog.json', JSON.stringify(merged, null, 2), 'utf8');

// Update blog-data.js DEFAULT_BLOG_POSTS
let blogDataCode = fs.readFileSync('blog-data.js', 'utf8');
const startIndex = blogDataCode.indexOf('const DEFAULT_BLOG_POSTS = [');
const endIndex = blogDataCode.indexOf('function slugifyText(text) {');

if (startIndex !== -1 && endIndex !== -1) {
  const newDeclar = 'const DEFAULT_BLOG_POSTS = ' + JSON.stringify(merged, null, 2) + ';\n\n';
  blogDataCode = blogDataCode.substring(0, startIndex) + newDeclar + blogDataCode.substring(endIndex);
  fs.writeFileSync('blog-data.js', blogDataCode, 'utf8');
  console.log('Successfully saved data/blog.json and blog-data.js with ' + merged.length + ' real posts!');
} else {
  console.error('Indices not found in blog-data.js');
}
