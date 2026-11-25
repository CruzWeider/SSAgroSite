const fs = require('fs');

const raw = fs.readFileSync('scratch/subagent_step17.txt', 'utf-8');
// Encontrar [Browser Step 17] e o JSON
const match = raw.match(/\[Browser Step 17\]\s*(\{[\s\S]*?\})\s*(\[WEBVIEW_BROWSER_HUD\]|$)/);
if (match) {
  const data = JSON.parse(match[1]);
  console.log('uniqueImgCount:', data.value?.uniqueImgCount);
  console.log('Images:');
  const imgs = data.value?.images || {};
  for (const [k, v] of Object.entries(imgs)) {
    console.log(`- ${k} (count: ${v.count}) [w:${v.sampleBox?.width} h:${v.sampleBox?.height} y:${v.sampleBox?.y}]`);
  }
} else {
  console.log('Match failed');
}
