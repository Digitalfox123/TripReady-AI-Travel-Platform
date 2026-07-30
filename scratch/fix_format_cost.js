import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/FullTripPlannerPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const startMarker = '  const formatCost = (usdAmount) => {';
const endMarker = '  const displayVisa = useMemo(() => {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
  const before = content.substring(0, startIndex);
  const after = content.substring(endIndex);
  
  const newFormatCost = `  const formatCost = (usdAmount) => {
    if (isNaN(usdAmount)) return '$0';
    
    // Support traveler selected currency conversion
    const travCurrObj = currencies.find(c => c.code === travelerCurrency) || { code: 'USD', symbol: '$', rate: 1.0 };
    const activeRate = (liveRates && liveRates[travelerCurrency]) ? liveRates[travelerCurrency] : travCurrObj.rate;
    const convertedTrav = Math.round(usdAmount * activeRate);
    
    if (travelerCurrency === 'USD') {
      return \`$\${usdAmount.toLocaleString()} USD\`;
    }
    return \`\${travCurrObj.symbol}\${convertedTrav.toLocaleString()} \${travelerCurrency}\`;
  };

`;

  fs.writeFileSync(filePath, before + newFormatCost + after, 'utf-8');
  console.log("Successfully fixed formatCost function!");
} else {
  console.error("FAIL: Could not locate formatCost function boundaries in FullTripPlannerPage.jsx");
}
