const fs = require('fs');
const logFilePath = 'C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\cfde45ab-22d0-4261-bac1-e4c10f2a746d\\.system_generated\\logs\\transcript.jsonl';

const lines = fs.readFileSync(logFilePath, 'utf8').split('\n');
const stepLine = lines[4197 - 1]; // 0-indexed
const step = JSON.parse(stepLine);
for (const tc of step.tool_calls) {
  if (tc.name === 'replace_file_content') {
    fs.writeFileSync('scratch/target_content_4197.txt', tc.args.TargetContent);
    fs.writeFileSync('scratch/replacement_content_4197.txt', tc.args.ReplacementContent);
    console.log("Wrote full target and replacement content to scratch files.");
  }
}
