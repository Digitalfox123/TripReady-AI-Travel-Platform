import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

console.log("Searching for 'replace_file_content' or 'multi_replace_file_content' targeting index.js...");

let foundCount = 0;
for await (const line of rl) {
  if ((line.includes('replace_file_content') || line.includes('multi_replace_file_content')) && 
      (line.includes('src/data/index.js') || line.includes('src\\\\data\\\\index.js')) &&
      !line.includes('find_replace_calls')) {
    
    foundCount++;
    console.log(`Match ${foundCount}: Length = ${line.length}`);
    try {
      const obj = JSON.parse(line);
      const calls = obj.tool_calls;
      if (calls) {
        calls.forEach((call, cidx) => {
          if ((call.name === 'replace_file_content' || call.name === 'multi_replace_file_content') && 
              (call.arguments?.TargetFile?.includes('index.js'))) {
            
            console.log(`  - Found call in step ${obj.step_index}! Name: ${call.name}`);
            
            // Check if there is ReplacementContent
            const rep = call.arguments.ReplacementContent;
            if (rep && rep.length > 500) {
              console.log(`    * ReplacementContent length: ${rep.length}`);
              fs.writeFileSync(`scratch/backup_replace_${foundCount}.js`, rep);
              console.log(`    * Saved scratch/backup_replace_${foundCount}.js`);
            }
            
            // Check if there are ReplacementChunks
            const chunks = call.arguments.ReplacementChunks;
            if (chunks) {
              chunks.forEach((chunk, chidx) => {
                if (chunk.ReplacementContent && chunk.ReplacementContent.length > 500) {
                  console.log(`    * Chunk ${chidx} ReplacementContent length: ${chunk.ReplacementContent.length}`);
                  fs.writeFileSync(`scratch/backup_chunk_${foundCount}_${chidx}.js`, chunk.ReplacementContent);
                  console.log(`    * Saved scratch/backup_chunk_${foundCount}_${chidx}.js`);
                }
              });
            }
          }
        });
      }
    } catch (err) {
      console.log("Error parsing line:", err.message);
    }
  }
}

console.log("Search finished.");
