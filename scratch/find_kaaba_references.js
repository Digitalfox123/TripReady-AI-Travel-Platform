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
    
    // Check if step_index is between 11000 and 12500
    const step = data.step_index;
    if (step >= 11000 && step <= 12600) {
      if (contentStr.toLowerCase().includes('kaaba') || contentStr.toLowerCase().includes('kabah') || contentStr.toLowerCase().includes('uploaded') || contentStr.toLowerCase().includes('media__')) {
        console.log(`Step ${step} (${data.source} - ${data.type}):`);
        if (data.content) {
          console.log(data.content.substring(0, 800));
        } else {
          console.log(contentStr.substring(0, 800));
        }
        console.log('=========================================');
      }
    }
  }
}

run();
