import fs from 'fs';
import readline from 'readline';

async function run() {
  const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\cfde45ab-22d0-4261-bac1-e4c10f2a746d\\.system_generated\\logs\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 0;
  for await (const line of rl) {
    index++;
    if (line.includes('"type":"USER_INPUT"')) {
      const data = JSON.parse(line);
      const text = data.content || '';
      if (text.toLowerCase().includes('kabah') || text.toLowerCase().includes('kaaba') || text.toLowerCase().includes('image') || text.toLowerCase().includes('png') || text.toLowerCase().includes('jpg')) {
        console.log(`Step ${data.step_index || index}:`);
        console.log(text);
        console.log('---');
      }
    }
  }
}

run();
