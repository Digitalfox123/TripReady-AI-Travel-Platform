import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/FullTripPlannerPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const targetBlock = `                {/* Budget Scale */}
                <div className="space-y-3 pt-4 border-t border-luxury-border dark:border-white/[0.04]">
                  <span className="block text-[10px] uppercase tracking-widest font-extrabold text-[var(--accent)]">
                    Target Budget Tier
                  </span>
                  
                  <div className="grid grid-cols-4 gap-2">`;

const replacement = `                {/* Traveler Currency Selection */}
                <div className="space-y-3 pt-4 border-t border-luxury-border dark:border-white/[0.04]">
                  <span className="block text-[10px] uppercase tracking-widest font-extrabold text-[var(--accent)]">
                    Traveler Currency Selection
                  </span>
                  <p className="text-[11px] text-slate-450 dark:text-slate-400 font-light mt-0.5">
                    Select your preferred billing currency. All estimated costs and budgets will automatically be converted using real-time rates.
                  </p>
                  <select
                    value={travelerCurrency}
                    onChange={(e) => setTravelerCurrency(e.target.value)}
                    className="w-full sm:w-1/2 bg-white dark:bg-white/[0.02] text-[var(--text-primary)] border border-luxury-border dark:border-white/[0.05] px-4 py-3 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[var(--accent)] font-medium text-xs transition-all shadow-sm"
                  >
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="PKR">PKR (Rs) - Pakistani Rupee</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="AED">AED (د.إ) - UAE Dirham</option>
                  </select>
                </div>

                {/* Budget Scale */}
                <div className="space-y-3 pt-4 border-t border-luxury-border dark:border-white/[0.04]">
                  <span className="block text-[10px] uppercase tracking-widest font-extrabold text-[var(--accent)]">
                    Target Budget Tier
                  </span>
                  
                  <div className="grid grid-cols-4 gap-2">`;

if (content.includes(targetBlock)) {
  content = content.replace(targetBlock, replacement);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log("Successfully inserted Traveler Currency Selection select dropdown!");
} else {
  console.error("Could not find target budget scale block");
}
