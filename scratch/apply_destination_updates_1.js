import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/DestinationPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. UPDATE STATES DECLARATION
const oldStates = `  // Live Translation / Phrasebook states
  const [translationInput, setTranslationInput] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [translationPhonetic, setTranslationPhonetic] = useState('');
  const [activePhraseCat, setActivePhraseCat] = useState('greetings');
  const [audioPlayingIndex, setAudioPlayingIndex] = useState(null);`;

const newStates = `  // Live Translation / Phrasebook states
  const [translationInput, setTranslationInput] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [translationPhonetic, setTranslationPhonetic] = useState('');
  const [activePhraseCat, setActivePhraseCat] = useState('greetings');
  const [audioPlayingIndex, setAudioPlayingIndex] = useState(null);
  const [detectedLang, setDetectedLang] = useState('');
  const [originalLang, setOriginalLang] = useState('Auto-Detect');
  const [targetLang, setTargetLang] = useState('');
  const [lastUpdatedTime, setLastUpdatedTime] = useState('');
  const [conversionHistory, setConversionHistory] = useState([]);`;

if (content.includes(oldStates)) {
  content = content.replace(oldStates, newStates);
  console.log("Successfully updated Translation & Currency states in DestinationPage.jsx");
} else {
  console.error("COULD NOT FIND STATES BLOCK IN DestinationPage.jsx");
}

// 2. UPDATE LIVE RATES useEffect
const oldRatesEffect = `  // Fetch live exchange rates from ExchangeRate-API
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('ExchangeRate-API failed');
      })
      .then(data => {
        if (data && data.rates) {
          const rates = { ...data.rates, USD: 1.0 };
          rates['SAR'] = 3.7515; // Pegged
          rates['AED'] = 3.6725; // Pegged
          rates['PKR'] = 278.45;
          rates['IDR'] = 16225.00;
          rates['THB'] = 36.45;
          rates['EGP'] = 47.15;
          setLiveRates(rates);
        }
      })
      .catch(err => {
        console.warn("Could not load live rates, utilizing database fallback:", err);
      });
  }, []);`;

const newRatesEffect = `  // Fetch live exchange rates from ExchangeRate-API
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('ExchangeRate-API failed');
      })
      .then(data => {
        if (data && data.rates) {
          const rates = { ...data.rates, USD: 1.0 };
          setLiveRates(rates);
          if (data.time_last_update_utc) {
            setLastUpdatedTime(new Date(data.time_last_update_utc).toLocaleString());
          } else {
            setLastUpdatedTime(new Date().toLocaleString());
          }
        }
      })
      .catch(err => {
        console.warn("Could not load live rates, utilizing database fallback:", err);
      });
  }, []);`;

if (content.includes(oldRatesEffect)) {
  content = content.replace(oldRatesEffect, newRatesEffect);
  console.log("Successfully updated Live Rates fetch hook in DestinationPage.jsx");
} else {
  // Let's search with relaxed whitespace
  console.error("COULD NOT FIND RATES EFFECT IN DestinationPage.jsx");
}

// 3. UPDATE CURRENCY CONVERSION HISTORY EFFECT
const oldConversionEffect = `  useEffect(() => {
    const fromRate = getRate(fromCurrency);
    const toRate = getRate(toCurrency);
    const converted = (fromAmount / fromRate) * toRate;
    setConvertedAmount(converted.toFixed(2));
  }, [fromAmount, fromCurrency, toCurrency, destination, liveRates]);`;

const newConversionEffect = `  useEffect(() => {
    const fromRate = getRate(fromCurrency);
    const toRate = getRate(toCurrency);
    const converted = (fromAmount / fromRate) * toRate;
    const finalVal = converted.toFixed(2);
    setConvertedAmount(finalVal);
    
    if (fromAmount > 0) {
      setConversionHistory(prev => {
        const record = \`\${fromAmount} \${fromCurrency} = \${getSymbol(toCurrency)} \${finalVal} \${toCurrency} (Rate: \${(toRate/fromRate).toFixed(4)})\`;
        if (prev.length > 0 && prev[0].split(' = ')[0] === \`\${fromAmount} \${fromCurrency}\`) {
          return prev;
        }
        return [record, ...prev].slice(0, 5);
      });
    }
  }, [fromAmount, fromCurrency, toCurrency, liveRates]);`;

if (content.includes(oldConversionEffect)) {
  content = content.replace(oldConversionEffect, newConversionEffect);
  console.log("Successfully updated Currency Conversion History hook in DestinationPage.jsx");
} else {
  console.error("COULD NOT FIND CONVERSION EFFECT IN DestinationPage.jsx");
}

// Write the modified content back
fs.writeFileSync(filePath, content, 'utf-8');
