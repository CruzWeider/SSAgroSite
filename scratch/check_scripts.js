const fs = require('fs');

const html = fs.readFileSync('scratch/ssagro_2025.html', 'utf-8');
const scriptSrcs = html.match(/<script[^>]+src=["'][^"']+["']/gi) || [];
console.log('Script sources:', scriptSrcs);

const links = html.match(/<link[^>]+href=["'][^"']+["']/gi) || [];
console.log('Link hrefs:', links);

const base = html.match(/<base[^>]+>/gi) || [];
console.log('Base tags:', base);
