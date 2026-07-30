import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/FullTripPlannerPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Helper to structurally replace blocks
function replaceBlock(startMarker, endMarker, newBlockContent) {
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);
  if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
    content = content.substring(0, startIndex) + newBlockContent + content.substring(endIndex);
    console.log(`Successfully replaced block: "${startMarker}"`);
  } else {
    console.error(`FAIL: Could not locate markers: "${startMarker}" or "${endMarker}"`);
  }
}

// 1. ADD travelerCurrency STATE
const oldStates = `  const [energyLevel, setEnergyLevel] = useState('Balanced'); // Relaxed, Balanced, Fast-Paced
  const [preferences, setPreferences] = useState(['Halal Food Only', 'Family Friendly']);`;

const newStates = `  const [energyLevel, setEnergyLevel] = useState('Balanced'); // Relaxed, Balanced, Fast-Paced
  const [preferences, setPreferences] = useState(['Halal Food Only', 'Family Friendly']);
  const [travelerCurrency, setTravelerCurrency] = useState('USD');`;

if (content.includes(oldStates)) {
  content = content.replace(oldStates, newStates);
  console.log("Successfully added travelerCurrency state");
} else {
  console.error("FAIL: Could not find old states block");
}

// 2. OVERWRITE formatCost
const oldFormatCost = `  const formatCost = (usdAmount) => {
    if (isNaN(usdAmount)) return '$0';
    const localAmount = Math.round(usdAmount * displayRates.rate);
    if (displayRates.code === 'USD') return \`$\${usdAmount.toLocaleString()}\`;
    return \`$\${usdAmount.toLocaleString()} (\${displayRates.symbol}\${localAmount.toLocaleString()} \${displayRates.code})\`;
  };`;

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
  };`;

if (content.includes(oldFormatCost)) {
  content = content.replace(oldFormatCost, newFormatCost);
  console.log("Successfully updated formatCost function");
} else {
  console.error("FAIL: Could not find oldFormatCost block");
}

// 3. OVERWRITE displayVisa to handle restrictive Pakistan <-> India visa rules
const oldDisplayVisa = `  const displayVisa = useMemo(() => {
    if (customPlan?.visa) return customPlan.visa;
    const origin = originCountry.toLowerCase();
    const dest = destCountry.toLowerCase();
    
    if (dest.includes('saudi') || dest.includes('arabia')) {
      return {
        requirement: 'e-Visa Required',
        duration: '90 Days Max',
        criticalInfo: 'Ensure passport has minimum 6 months validity from date of entry.'
      };
    }
    if (dest.includes('japan')) {
      if (origin.includes('states') || origin.includes('kingdom') || origin.includes('canada') || origin.includes('europe')) {
        return {
          requirement: 'Visa Free Transit',
          duration: '90 Days allowed',
          criticalInfo: 'Must hold onward return ticket documentation upon arrival.'
        };
      }
      return {
        requirement: 'Pre-Approved Entry Visa',
        duration: '15/30 Days allowed',
        criticalInfo: 'Must submit official tourist visa forms at local Japanese consulate.'
      };
    }
    return {
      requirement: 'Check eVisa provisions',
      duration: '30 Days average',
      criticalInfo: 'Confirm specific requirements based on your national passport guidelines.'
    };
  }, [customPlan, originCountry, destCountry]);`;

const newDisplayVisa = `  const displayVisa = useMemo(() => {
    if (customPlan?.visa) return customPlan.visa;
    const origin = originCountry.toLowerCase();
    const dest = destCountry.toLowerCase();
    
    // Strict bilateral restricted routing (Pakistan <-> India)
    if ((origin.includes('pakistan') && dest.includes('india')) || (origin.includes('india') && dest.includes('pakistan'))) {
      return {
        requirement: 'Bilateral Embassy Visa Required',
        duration: '30-45 Days Single Entry',
        criticalInfo: 'E-Visa NOT available for this routing due to bilateral restrictions. Travelers must submit original physical sponsor sponsorship papers, verified bank statements, and biometric records at the local consulate.'
      };
    }
    
    if (dest.includes('saudi') || dest.includes('arabia')) {
      return {
        requirement: 'e-Visa Required',
        duration: '90 Days Max',
        criticalInfo: 'Ensure passport has minimum 6 months validity from date of entry.'
      };
    }
    if (dest.includes('japan')) {
      if (origin.includes('states') || origin.includes('kingdom') || origin.includes('canada') || origin.includes('europe')) {
        return {
          requirement: 'Visa Free Transit',
          duration: '90 Days allowed',
          criticalInfo: 'Must hold onward return ticket documentation upon arrival.'
        };
      }
      return {
        requirement: 'Pre-Approved Entry Visa',
        duration: '15/30 Days allowed',
        criticalInfo: 'Must submit official tourist visa forms at local Japanese consulate.'
      };
    }
    return {
      requirement: 'Check eVisa provisions',
      duration: '30 Days average',
      criticalInfo: 'Confirm specific requirements based on your national passport guidelines.'
    };
  }, [customPlan, originCountry, destCountry]);`;

if (content.includes(oldDisplayVisa)) {
  content = content.replace(oldDisplayVisa, newDisplayVisa);
  console.log("Successfully updated displayVisa logic");
} else {
  console.error("FAIL: Could not find oldDisplayVisa block");
}

fs.writeFileSync(filePath, content, 'utf-8');
