import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

const targetSteps = [3346, 4757, 6008];
console.log("Extracting content for target steps:", targetSteps);

for await (const line of rl) {
  try {
    const obj = JSON.parse(line);
    if (targetSteps.includes(obj.step_index)) {
      console.log(`Found step ${obj.step_index}! Type: ${obj.type}, Content length: ${obj.content?.length || 0}`);
      fs.writeFileSync(`scratch/step_${obj.step_index}.txt`, obj.content || JSON.stringify(obj, null, 2));
      console.log(`Saved scratch/step_${obj.step_index}.txt`);
    }
  } catch (err) {
    // Ignore
  }
}
