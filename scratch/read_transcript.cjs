const fs = require('fs');
const readline = require('readline');

const logFilePath = 'C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\cfde45ab-22d0-4261-bac1-e4c10f2a746d\\.system_generated\\logs\\transcript.jsonl';

async function search() {
  const fileStream = fs.createReadStream(logFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let stepCount = 0;
  for await (const line of rl) {
    stepCount++;
    if (stepCount === 4197) {
      try {
        const step = JSON.parse(line);
        if (step.tool_calls) {
          for (const tc of step.tool_calls) {
            console.log(`Step ${stepCount} (${tc.name}):`);
            const args = tc.args || {};
            console.log(`TargetFile: ${args.TargetFile}`);
            console.log(`StartLine: ${args.StartLine}, EndLine: ${args.EndLine}`);
            console.log(`--- Target Content ---`);
            console.log(args.TargetContent);
            console.log(`--- Replacement Content ---`);
            console.log(args.ReplacementContent);
            console.log('====================================\n');
          }
        }
      } catch (e) {
        console.error(e);
      }
      break;
    }
  }
}

search();
