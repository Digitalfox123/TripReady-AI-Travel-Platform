import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  ArrowRightLeft,
  TrendingUp,
  CreditCard,
  Banknote,
  Coins,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';
import { useLiveRates, staticRates } from '../../utils/currencyService';

// Common country to currency mapping helper
const COUNTRY_CURRENCIES = {
  pakistan: { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', flag: '🇵🇰' },
  india: { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  bangladesh: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', flag: '🇧🇩' },
  nepal: { code: 'NPR', symbol: 'रू', name: 'Nepalese Rupee', flag: '🇳🇵' },
  srilanka: { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', flag: '🇱🇰' },
  'united states': { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  usa: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  'united kingdom': { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  uk: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  france: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇫🇷' },
  germany: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇩🇪' },
  italy: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇮🇹' },
  spain: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇸' },
  switzerland: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  japan: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  china: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
  'saudi arabia': { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal', flag: '🇸🇦' },
  uae: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  'united arab emirates': { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  singapore: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
  turkey: { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷' },
  thailand: { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭' },
  malaysia: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', flag: '🇲🇾' },
  indonesia: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩' },
  australia: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  canada: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  mexico: { code: 'MXN', symbol: '$', name: 'Mexican Peso', flag: '🇲🇽' },
  egypt: { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', flag: '🇪🇬' },
  brazil: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷' },
  southafrica: { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦' }
};

export function getCurrencyForCountry(countryName) {
  if (!countryName) return { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' };
  const clean = countryName.toLowerCase().trim().replace(/[^a-z ]/g, '');
  for (const [k, v] of Object.entries(COUNTRY_CURRENCIES)) {
    if (clean === k || clean.includes(k) || k.includes(clean)) {
      return v;
    }
  }
  return { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🌐' };
}

export default function TripCurrencyDesk({
  destCountry = 'United States',
  destName = 'Destination',
  originCountry = 'Pakistan',
  destCurrencyCode = null
}) {
  const { rates, loading, convert } = useLiveRates();

  // 1. Resolve Origin and Destination Currency Objects
  const originCurr = useMemo(() => {
    return getCurrencyForCountry(originCountry);
  }, [originCountry]);

  const destCurr = useMemo(() => {
    if (destCurrencyCode) {
      const found = Object.values(COUNTRY_CURRENCIES).find(c => c.code === destCurrencyCode);
      if (found) return found;
      return { code: destCurrencyCode, symbol: destCurrencyCode, name: `${destCurrencyCode} Currency`, flag: '📍' };
    }
    return getCurrencyForCountry(destCountry);
  }, [destCountry, destCurrencyCode]);

  // 2. State for Converter
  const [fromCode, setFromCode] = useState(destCurr.code);
  const [toCode, setToCode] = useState(originCurr.code);
  const [amount, setAmount] = useState('100');

  // Sync if destination/origin changes
  React.useEffect(() => {
    setFromCode(destCurr.code);
    setToCode(originCurr.code);
  }, [destCurr.code, originCurr.code]);

  // 3. Compute Direct Exchange Rate (1 Dest Currency = ? Origin Currency)
  const directRate = useMemo(() => {
    const fromRate = rates[destCurr.code] || staticRates[destCurr.code] || 1;
    const toRate = rates[originCurr.code] || staticRates[originCurr.code] || 1;
    return (1 / fromRate) * toRate;
  }, [rates, destCurr.code, originCurr.code]);

  // 4. Converted Amount Calculation
  const convertedValue = useMemo(() => {
    const num = parseFloat(amount);
    if (isNaN(num) || num < 0) return 0;
    return convert(num, fromCode, toCode);
  }, [amount, fromCode, toCode, rates]);

  // Swap handler
  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  // Quick Preset Chips
  const presetChips = [10, 50, 100, 500, 1000];

  return (
    <section className="bg-white dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200/80 dark:border-white/[0.06] shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.04] pb-4">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            LIVE CURRENCY DESK & TRIP BUDGET
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-500" />
            <span>EXCHANGE RATES: {destCurr.code} ⇄ {originCurr.code}</span>
          </h2>
        </div>

        {/* Live Rate Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>1 {destCurr.code} = {directRate.toFixed(2)} {originCurr.code}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Converter Card (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/60 dark:border-white/[0.04] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Interactive Travel Calculator
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {originCountry} ({originCurr.code}) ⇄ {destCountry} ({destCurr.code})
            </span>
          </div>

          {/* Amount Input Row */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Enter Amount
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-sm text-slate-400">
                {fromCode}
              </span>
            </div>
          </div>

          {/* Quick Amount Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-400 font-mono mr-1">Quick:</span>
            {presetChips.map(chip => (
              <button
                key={chip}
                type="button"
                onClick={() => setAmount(chip.toString())}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  amount === chip.toString()
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {chip} {fromCode}
              </button>
            ))}
          </div>

          {/* Currencies Row with Swap Button */}
          <div className="flex items-center gap-3 pt-2">
            {/* From Card */}
            <div className="flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="block text-[10px] uppercase font-mono text-slate-400">From</span>
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                <span>{fromCode === destCurr.code ? destCurr.flag : originCurr.flag}</span>
                <span>{fromCode}</span>
              </span>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              title="Swap Currencies"
              className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 transition-all cursor-pointer active:scale-95 flex-shrink-0"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            {/* To Card */}
            <div className="flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="block text-[10px] uppercase font-mono text-slate-400">To</span>
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                <span>{toCode === destCurr.code ? destCurr.flag : originCurr.flag}</span>
                <span>{toCode}</span>
              </span>
            </div>
          </div>

          {/* Calculated Output Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 dark:border-emerald-400/15 flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Converted Total
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {convertedValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCode}
              </span>
            </div>
            <div className="text-right text-[10px] font-mono text-slate-400">
              <span>{amount || 0} {fromCode}</span>
              <span className="block text-emerald-500 font-semibold">Zero Commission Rate</span>
            </div>
          </div>
        </div>

        {/* Right: Daily Travel Expense Cheat Sheet (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/60 dark:border-white/[0.04] space-y-3.5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Estimated Expenses in {destName}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Typical travel spending converted into your home currency ({originCurr.code}):
            </p>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { item: 'Coffee / Espresso', destVal: 4.5, icon: '☕' },
              { item: 'Street Food / Quick Lunch', destVal: 15.0, icon: '🥪' },
              { item: 'City Metro / Taxi Ride', destVal: 22.0, icon: '🚖' },
              { item: 'Casual Sit-Down Dinner', destVal: 45.0, icon: '🍽️' },
              { item: 'Midrange Hotel (Per Night)', destVal: 130.0, icon: '🏨' }
            ].map((exp, idx) => {
              const convertedHome = (exp.destVal * directRate).toLocaleString(undefined, { maximumFractionDigits: 0 });
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800"
                >
                  <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                    <span>{exp.icon}</span>
                    <span>{exp.item}</span>
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {destCurr.symbol}{exp.destVal.toFixed(exp.destVal % 1 === 0 ? 0 : 2)}
                    </span>
                    <span className="block text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      ≈ {convertedHome} {originCurr.code}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-mono">
            <span>Interbank Mid-Market</span>
            <span>Refreshes dynamically</span>
          </div>
        </div>
      </div>
    </section>
  );
}
