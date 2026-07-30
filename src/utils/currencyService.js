import { useState, useEffect } from 'react';
import { fetchWithTimeout } from './rapidApiService';

const API_URL = 'https://api.frankfurter.app/latest?from=USD';
const CACHE_KEY = 'tripready_live_currency_rates_v2';
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

// Static fallbacks in case API fails or is rate-limited
export const staticRates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  AED: 3.67,
  AUD: 1.53,
  CAD: 1.36,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83.12,
  PKR: 278.50,
  THB: 35.20,
  TRY: 27.80,
  SGD: 1.34,
  KRW: 1320.0,
  MYR: 4.72,
  BRL: 4.97,
  ZAR: 18.90,
  NZD: 1.65,
  SEK: 10.82
};

export async function fetchLiveRates() {
  try {
    // Check localStorage cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { rates, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return { rates, source: 'cache', timestamp };
      }
    }

    // Fetch fresh rates from Frankfurter API (with a 2.5s timeout for speed)
    const response = await fetchWithTimeout(API_URL, { timeout: 2500 });
    if (response.ok) {
      const data = await response.json();
      if (data && data.rates) {
        // Merge with staticRates to retain AED, PKR, etc. which aren't in ECB's list
        const rates = { ...staticRates };
        Object.keys(data.rates).forEach(code => {
          rates[code.toUpperCase()] = parseFloat(data.rates[code]);
        });
        rates.USD = 1.0; // Base rate constraint

        // Save to cache
        const cacheData = { rates, timestamp: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        return { rates, source: 'api', timestamp: cacheData.timestamp };
      }
    }
    throw new Error('Invalid response from Frankfurter');
  } catch (error) {
    console.warn('Frankfurter API failed, using cached or static fallbacks:', error);
    
    // Attempt to return expired cache as fallback before using hardcoded statics
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { rates, timestamp } = JSON.parse(cached);
      return { rates, source: 'expired_cache', timestamp };
    }
    
    return { rates: staticRates, source: 'static', timestamp: null };
  }
}

export function useLiveRates() {
  const [rates, setRates] = useState(staticRates);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('static');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadRates() {
      setLoading(true);
      const res = await fetchLiveRates();
      if (isMounted) {
        setRates(res.rates);
        setSource(res.source);
        setLastUpdated(res.timestamp);
        setLoading(false);
      }
    }
    loadRates();
    return () => {
      isMounted = false;
    };
  }, []);

  // Convert amount from one currency to another using USD as base
  const convert = (amount, fromCode, toCode) => {
    const fromNormalized = fromCode ? fromCode.toUpperCase() : 'USD';
    const toNormalized = toCode ? toCode.toUpperCase() : 'USD';
    
    const fromRate = rates[fromNormalized] || staticRates[fromNormalized] || 1;
    const toRate = rates[toNormalized] || staticRates[toNormalized] || 1;
    
    // USD is the base (rate = 1)
    // Convert to USD first: amount / fromRate
    // Convert USD to target: (amount / fromRate) * toRate
    const amountInUSD = amount / fromRate;
    return amountInUSD * toRate;
  };

  return { rates, loading, source, lastUpdated, convert };
}
