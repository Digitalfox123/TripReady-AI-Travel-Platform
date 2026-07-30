import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('C:\\Users\\hafiz\\.gemini\\antigravity\\brain\\8aea9138-58d5-4892-b520-33e32f04da5c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

console.log("Searching for testimonials data structures in transcript...");

let foundLines = [];
for await (const line of rl) {
  if (line.includes('featuredTestimonials = [') || line.includes('scrollingTestimonials = [')) {
    if (!line.includes('search_testimonials_full') && !line.includes('console.log')) {
      foundLines.push({ length: line.length, text: line });
    }
  }
}

foundLines.sort((a, b) => b.length - a.length);

foundLines.slice(0, 5).forEach((item, index) => {
  console.log(`Match ${index + 1}: Length = ${item.length}`);
  // Let's print out the content
  try {
    const obj = JSON.parse(item.text);
    console.log(`- Type: ${obj.type}`);
    fs.writeFileSync(`scratch/testimonials_match_${index + 1}.txt`, obj.content || JSON.stringify(obj, null, 2));
    console.log(`- Saved scratch/testimonials_match_${index + 1}.txt`);
  } catch (err) {
    console.log("- Error parsing JSON:", err.message);
  }
});
