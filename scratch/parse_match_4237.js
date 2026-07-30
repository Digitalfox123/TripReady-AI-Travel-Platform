import fs from 'fs';

const content = fs.readFileSync('scratch/match_4237.txt', 'utf8');

// The line is a JSON object from the logs, let's parse it!
try {
  const obj = JSON.parse(content);
  console.log("Parsed JSON object successfully! Type:", obj.type);
  if (obj.content) {
    console.log("Saving obj.content to scratch/match_content.txt...");
    fs.writeFileSync('scratch/match_content.txt', obj.content);
    console.log("Saved scratch/match_content.txt! Length:", obj.content.length);
    
    // Let's print out the first 20 lines and some segments of the content to see what it is
    const lines = obj.content.split('\n');
    console.log("Total lines of content:", lines.length);
    console.log("First 30 lines:");
    lines.slice(0, 30).forEach((l, i) => console.log(`[${i + 1}] ${l}`));
    
    console.log("Last 30 lines:");
    lines.slice(lines.length - 30).forEach((l, i) => console.log(`[${lines.length - 30 + i + 1}] ${l}`));
  }
} catch (err) {
  console.log("ERROR parsing JSON:", err.message);
  // Let's print a small snippet of content
  console.log("Snippet:", content.substring(0, 500));
}
