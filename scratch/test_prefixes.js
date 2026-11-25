const prefixes = [
  'https://ssagro.com.br/blog-ss-agro/_assets/media/a5be765a8729a00341c84376d610cf33.png',
  'https://ssagro.com.br/_assets/media/a5be765a8729a00341c84376d610cf33.png',
  'https://static-cse.canva.com/_assets/media/a5be765a8729a00341c84376d610cf33.png',
  'https://media-public.canva.com/a5be765a8729a00341c84376d610cf33.png'
];

async function check() {
  for (const url of prefixes) {
    try {
      const res = await fetch(url);
      console.log(url, '-->', res.status);
    } catch (e) {
      console.log(url, '--> err', e.message);
    }
  }
}
check();
