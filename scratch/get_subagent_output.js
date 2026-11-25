const fs = require('fs');
const readline = require('readline');

async function readSubagent() {
  const fileStream = fs.createReadStream('C:/Users/kamil/.gemini/antigravity/brain/99cd32e5-7869-4bd5-bbba-5bc9969eac8c/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.step_index === 17) {
        fs.writeFileSync('scratch/subagent_step17.txt', obj.content, 'utf-8');
        console.log('Step 17 written, length:', obj.content.length);
      }
    } catch (e) {}
  }
}
readSubagent();
