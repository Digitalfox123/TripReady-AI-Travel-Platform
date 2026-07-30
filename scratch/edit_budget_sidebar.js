import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/FullTripPlannerPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const targetLine = `<span className="font-light text-slate-450 uppercase text-[10px] tracking-wider">Flights / Transit:</span>
                        <span className="font-medium">\${budgetBreakdown.flights}</span>`;

const replacement = `<span className="font-light text-slate-450 uppercase text-[10px] tracking-wider">Flights / Transit:</span>
                        <span className="font-medium">{formatCost(budgetBreakdown.flights)}</span>`;

if (content.includes(targetLine)) {
  content = content.replace(targetLine, replacement);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log("Successfully replaced Flight budget Spent sidebar line!");
} else {
  // Let's try matching with different whitespaces
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normTarget = targetLine.replace(/\r\n/g, '\n').replace(/\s+/g, ' ');
  
  // Find substring by token comparison
  let matched = false;
  const lines = normalizedContent.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    const combined = (lines[i].trim() + ' ' + lines[i+1].trim()).replace(/\s+/g, ' ');
    if (combined.includes('Flights / Transit:') && combined.includes('${budgetBreakdown.flights}')) {
      lines[i+1] = lines[i+1].replace('${budgetBreakdown.flights}', '{formatCost(budgetBreakdown.flights)}');
      content = lines.join('\n');
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log("Successfully replaced Flight budget Spent sidebar line (Whitespace normalized)!");
      matched = true;
      break;
    }
  }
  if (!matched) {
    console.error("FAIL: Could not locate flights spent sidebar line");
  }
}
