const fs = require('fs');

function extractAllArticles(filename) {
  const html = fs.readFileSync('scratch/' + filename, 'utf8');

  // Let's find all text blocks with links
  // In Canva sites, text items have:
  // "C":{"A":["...Title..."]}, ... "Q":"https://ssagro.com.br/blog-ss-agro-..."
  // Let's find all blocks containing "Saiba mais" or links
  const regex = /"C":\{"A":\["([^"]+)"\]\},"B":\[\d+\],"C":\[\{[^}]*"Q":"(https:\/\/ssagro\.com\.br\/blog-ss-agro-[^"]+)"/g;
  
  // Or match all link targets and nearby texts
  console.log('Searching in ' + filename);
}
