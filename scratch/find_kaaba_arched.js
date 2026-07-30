import fs from 'fs';
import readline from 'readline';

async function run() {
  const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\cfde45ab-22d0-4261-bac1-e4c10f2a746d\\.system_generated\\logs\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const data = JSON.parse(line);
    const contentStr = JSON.stringify(data);
    if (contentStr.includes('kaaba_arched')) {
      console.log(`Step ${data.step_index} (${data.source} - ${data.type}):`);
      if (data.content) {
        console.log(data.content.substring(0, 500));
      } else {
        console.log(contentStr.substring(0, 500));
      }
      console.log('=========================================');
    }
  }
}

run();
