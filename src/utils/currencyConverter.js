// Live exchange rate service with local robust fallbacks

const fallbackRates = {
  USD: 1.0,
  PKR: 278.5,
  AED: 3.67,
  SAR: 3.75,
  EUR: 0.92,
  GBP: 0.78,
  INR: 83.5,
  JPY: 157.0
};

const currencySymbols = {
  USD: '$',
  PKR: 'Rs. ',
  AED: 'AED ',
  SAR: 'SR ',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥'
};

// Fetch latest rates relative to USD
export async function getLiveExchangeRates() {
  try {
    const cached = localStorage.getItem('tripready_live_rates');
    if (cached) {
      const parsed = JSON.parse(cached);
      const isFresh = (new Date().getTime() - parsed.timestamp) < 3600000; // 1 hour cache
      if (isFresh) return parsed.rates;
    }

    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    
    if (data && data.rates) {
      const rates = {};
      Object.keys(fallbackRates).forEach(code => {
        rates[code] = data.rates[code] || fallbackRates[code];
      });
      
      localStorage.setItem('tripready_live_rates', JSON.stringify({
        rates,
        timestamp: new Date().getTime()
      }));
      return rates;
    }
  } catch (err) {
    console.warn("Using fallback currency exchange rates:", err);
  }
  return fallbackRates;
}

// Convert a price from USD to the target currency
export function convertCurrency(usdAmount, targetCurrency, customRates = null) {
  const rates = customRates || fallbackRates;
  const rate = rates[targetCurrency] || fallbackRates[targetCurrency] || 1.0;
  return Math.round(usdAmount * rate);
}

// Convert and format price text
export function formatConvertedPrice(usdAmount, targetCurrency, customRates = null) {
  const rates = customRates || fallbackRates;
  const rate = rates[targetCurrency] || fallbackRates[targetCurrency] || 1.0;
  const converted = Math.round(usdAmount * rate);
  const symbol = currencySymbols[targetCurrency] || '$';
  
  return `${symbol}${converted.toLocaleString()}`;
}
