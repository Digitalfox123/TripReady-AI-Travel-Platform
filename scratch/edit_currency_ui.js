import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/DestinationPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const oldBlock = `                  <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center text-xs text-[var(--text-secondary)]">
                    Calculated Exchange Rate: <span className="font-bold text-[var(--text-primary)] font-mono">1 {fromCurrency} = {((1 / getRate(fromCurrency)) * getRate(toCurrency)).toFixed(4)} {toCurrency}</span>
                  </div>`;

const newBlock = `                  <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center text-xs text-[var(--text-secondary)] space-y-2">
                    <div>
                      Calculated Exchange Rate: <span className="font-bold text-[var(--text-primary)] font-mono">1 {fromCurrency} ({getSymbol(fromCurrency)}) = {((1 / getRate(fromCurrency)) * getRate(toCurrency)).toFixed(4)} {toCurrency} ({getSymbol(toCurrency)})</span>
                    </div>
                    {lastUpdatedTime && (
                      <div className="text-[10px] text-slate-450 dark:text-slate-500 font-mono">
                        Last Updated: {lastUpdatedTime}
                      </div>
                    )}
                  </div>
                  
                  {conversionHistory && conversionHistory.length > 0 && (
                    <div className="pt-3 border-t border-[var(--border)] space-y-1.5">
                      <span className="block text-[9px] uppercase tracking-wider text-slate-450 font-bold font-mono">Conversion History Ledger</span>
                      <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
                        {conversionHistory.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px] font-mono bg-slate-50/50 dark:bg-white/[0.01] border border-[var(--border)] px-3 py-1.5 rounded-lg text-[var(--text-secondary)]">
                            <span>{item}</span>
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.2 rounded font-bold uppercase tracking-tight">Success</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}`;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log("Successfully updated Currency broker Dashboard UI!");
} else {
  console.error("Could not find old currency block");
}
