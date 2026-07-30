import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

console.log("Searching for 'write_to_file' tool calls for index.js...");

let foundCount = 0;
for await (const line of rl) {
  if (line.includes('write_to_file') && (line.includes('src/data/index.js') || line.includes('src\\\\data\\\\index.js'))) {
    foundCount++;
    console.log(`Match ${foundCount}: Length = ${line.length}`);
    try {
      const obj = JSON.parse(line);
      // Let's see if this has tool_calls
      const calls = obj.tool_calls;
      if (calls) {
        calls.forEach((call, cidx) => {
          if (call.name === 'write_to_file' && call.arguments?.CodeContent) {
            const code = call.arguments.CodeContent;
            console.log(`  - Found CodeContent in call ${cidx}! Length: ${code.length}`);
            fs.writeFileSync(`scratch/backup_code_${foundCount}.js`, code);
            console.log(`  - Saved scratch/backup_code_${foundCount}.js`);
          }
        });
      }
    } catch (err) {
      console.log("Error parsing line:", err.message);
    }
  }
}

console.log("Search finished.");
