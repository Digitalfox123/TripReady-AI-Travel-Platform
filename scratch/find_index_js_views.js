import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

console.log("Searching for steps involving 'src/data/index.js' or 'index.js' in the brain:");

let count = 0;
for await (const line of rl) {
  if (line.includes('src/data/index.js') || line.includes('src\\\\data\\\\index.js')) {
    count++;
    // Let's parse the JSON to get clean info
    try {
      const obj = JSON.parse(line);
      console.log(`Match ${count}: Step ${obj.step_index}, Source: ${obj.source}, Type: ${obj.type}, Status: ${obj.status}, Length: ${line.length}, TargetFile: ${obj.tool_calls?.[0]?.arguments?.TargetFile || obj.tool_calls?.[0]?.arguments?.AbsolutePath || 'N/A'}`);
    } catch (err) {
      console.log(`Match ${count}: Length = ${line.length}, Starts: ${line.substring(0, 100)}`);
    }
  }
}
