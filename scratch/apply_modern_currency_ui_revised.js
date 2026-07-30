import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/DestinationPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Normalize carriage returns first
const normalizedContent = content.replace(/\r\n/g, '\n');

const startMarker = '            {/* Currency Converter Mockup */}';
const endMarker = '            </div>\n\n          </div>\n        </div>\n      </section>';

const startIndex = normalizedContent.indexOf(startMarker);
const endIndex = normalizedContent.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
  const before = normalizedContent.substring(0, startIndex);
  const after = normalizedContent.substring(endIndex);

  const newCurrencyUI = `            {/* Overhauled Modern Currency Converter UI */}
            <div className="lg:w-1/2 w-full text-left">
              <div className="glass-card p-6 sm:p-8 relative overflow-hidden border border-white/[0.08] dark:bg-black/40 bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl">
                {/* Glow effects */}
                <div className="absolute top-[-30px] right-[-30px] w-28 h-28 rounded-full bg-[var(--accent)]/10 blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
                  <div>
                    <h3 className="text-base font-heading font-semibold text-[var(--text-primary)]">Real-Time Currency Broker</h3>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Live Interbank Exchange Rates</p>
                  </div>
                  {lastUpdatedTime && (
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
                      Synced
                    </span>
                  )}
                </div>

                <div className="space-y-4 relative">
                  {/* From Card */}
                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-white/[0.08] flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-[9px] uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-bold">You Pay</label>
                      <input
                        type="number"
                        value={fromAmount}
                        onChange={(e) => setFromAmount(Number(e.target.value))}
                        className="w-full bg-transparent text-[var(--text-primary)] font-bold font-mono text-2xl outline-none border-none p-0 focus:ring-0 focus:outline-none"
                      />
                    </div>
                    
                    <div className="shrink-0">
                      <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-white/[0.08] px-3.5 py-2 rounded-xl focus:outline-none font-semibold text-xs sm:text-sm shadow-sm transition-all"
                      >
                        {currencies.map((c) => (
                          <option key={c.code} value={c.code}>{c.code}</option>
                        ))}
                      </select>
                      <span className="block text-right text-[10px] text-[var(--text-secondary)] mt-1 font-mono">{getSymbol(fromCurrency)}</span>
                    </div>
                  </div>

                  {/* Swap Line & Live Rate Pill */}
                  <div className="relative flex items-center justify-center my-[-10px] z-10">
                    <div className="absolute inset-x-0 h-px bg-white/[0.08]" />
                    <div className="relative px-4 py-1.5 rounded-full bg-[var(--bg-primary)] border border-white/[0.08] text-[10px] font-mono text-[var(--text-secondary)] font-semibold shadow-md flex items-center gap-1.5">
                      <span>1 {fromCurrency}</span>
                      <span className="text-[var(--accent)] font-bold">➜</span>
                      <span>{((1 / getRate(fromCurrency)) * getRate(toCurrency)).toFixed(4)} {toCurrency}</span>
                    </div>
                  </div>

                  {/* To Card */}
                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-white/[0.08] flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-[9px] uppercase tracking-wider text-[var(--text-secondary)] mb-1 font-bold">You Receive</label>
                      <div className="text-2xl font-bold font-mono text-[var(--accent)] select-all truncate">
                        {convertedAmount}
                      </div>
                    </div>
                    
                    <div className="shrink-0">
                      <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-white/[0.08] px-3.5 py-2 rounded-xl focus:outline-none font-semibold text-xs sm:text-sm shadow-sm transition-all"
                      >
                        {currencies.map((c) => (
                          <option key={c.code} value={c.code}>{c.code}</option>
                        ))}
                      </select>
                      <span className="block text-right text-[10px] text-[var(--text-secondary)] mt-1 font-mono">{getSymbol(toCurrency)}</span>
                    </div>
                  </div>

                  {/* Metadata and Sync Times */}
                  {lastUpdatedTime && (
                    <div className="pt-2 text-center text-[10px] text-slate-450 dark:text-slate-550 font-mono flex items-center justify-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Rates Sync: {lastUpdatedTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>`;

  fs.writeFileSync(filePath, before + newCurrencyUI + after, 'utf-8');
  console.log("Successfully replaced Currency converter UI with modern sleek layout (Revised)!");
} else {
  console.error("FAIL: Could not locate currency converter markup in DestinationPage.jsx", { startIndex, endIndex });
}
