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
    try {
      const step = JSON.parse(line);
      // Check if it has tool_calls
      if (step.tool_calls) {
        for (const tc of step.tool_calls) {
          if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content' || tc.name === 'write_to_file') {
            const args = tc.args || {};
            const target = args.TargetFile || args.TargetFile;
            if (target && target.includes('DestinationPage.jsx')) {
              console.log(`Step ${stepCount} (${tc.name}):`);
              console.log(`Instruction: ${args.Instruction}`);
              if (args.TargetContent) {
                console.log(`--- Target Content ---`);
                console.log(args.TargetContent.substring(0, 300) + '...');
              }
              if (args.ReplacementContent) {
                console.log(`--- Replacement Content ---`);
                console.log(args.ReplacementContent.substring(0, 1000) + '...');
              }
              console.log('====================================\n');
            }
          }
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }
  console.log(`Finished searching ${stepCount} steps.`);
}

search();
