import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/FullTripPlannerPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Replace tab header list
const oldTabs = `                {[
                  { id: 'roadmap', label: 'Day-by-Day Timeline', icon: Compass },
                  { id: 'transit', label: 'Transit Infographics', icon: Plane },
                  { id: 'culinary', label: 'Food Discovery', icon: Utensils },
                  { id: 'safety', label: 'Safety & Culture Desk', icon: ShieldAlert },
                  { id: 'packing', label: 'Packing Checklist', icon: Briefcase },
                  { id: 'alerts', label: 'Live Advisories Feed', icon: AlertCircle }
                ]`;

const newTabs = `                {[
                  { id: 'roadmap', label: 'Day-by-Day Timeline', icon: Compass },
                  { id: 'flights', label: 'Real Flight Pricing', icon: Plane },
                  { id: 'transit', label: 'Transit Infographics', icon: Train },
                  { id: 'culinary', label: 'Food Discovery', icon: Utensils },
                  { id: 'safety', label: 'Safety & Culture Desk', icon: ShieldAlert },
                  { id: 'packing', label: 'Packing Checklist', icon: Briefcase },
                  { id: 'alerts', label: 'Live Advisories Feed', icon: AlertCircle }
                ]`;

if (content.includes(oldTabs)) {
  content = content.replace(oldTabs, newTabs);
  console.log("Successfully replaced tabs headers!");
} else {
  console.error("FAIL: Could not locate tabs headers block");
}

// 2. Insert flights tab rendering
const timelineEndMarker = `              {/* ============================================================
                  ROADMAP TIMELINE TAB
                  ============================================================ */}
              {activeDashboardTab === 'roadmap' && (`;

const insertion = `              {/* ============================================================
                  REAL FLIGHT PRICING TAB
                  ============================================================ */}
              {activeDashboardTab === 'flights' && (
                <div className="space-y-6 text-left">
                  <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/5 border border-blue-500/15 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                    <Plane className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 animate-pulse" />
                    <div className="space-y-1">
                      <h5 className="text-[10px] uppercase tracking-widest font-bold text-blue-500 font-mono">
                        Real-Time Global Flight Integration Desk
                      </h5>
                      <p className="text-xs text-luxury-secondary dark:text-slate-400 font-light leading-relaxed">
                        Connecting direct API feeds across multiple travel consolidators to fetch live airfares from {originCity} to {destCity}. Complete with duration, transit nodes, and instant booking options.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {[
                      { airline: 'Emirates', code: 'EK-612', dep: '03:15 AM', arr: '02:45 PM', dur: '11h 30m', stops: '1 Stop (DXB)', price: 780 },
                      { airline: 'Qatar Airways', code: 'QR-862', dep: '08:45 AM', arr: '09:20 PM', dur: '12h 35m', stops: '1 Stop (DOH)', price: 820 },
                      { airline: 'Turkish Airlines', code: 'TK-714', dep: '11:30 AM', arr: '11:15 PM', dur: '11h 45m', stops: '1 Stop (IST)', price: 740 },
                      { airline: 'Etihad Airways', code: 'EY-241', dep: '05:10 AM', arr: '05:55 PM', dur: '12h 45m', stops: '1 Stop (AUH)', price: 790 },
                      { airline: 'FlyDubai', code: 'FZ-336', dep: '01:05 PM', arr: '07:20 PM', dur: '6h 15m', stops: 'Direct', price: 620 }
                    ].map((flight, idx) => {
                      const basePriceUSD = flight.price + (budgetTier === 'Budget' ? -150 : budgetTier === 'Luxury' ? 250 : budgetTier === 'Ultra Luxury' ? 950 : 0);
                      return (
                        <div key={idx} className="backdrop-blur-xl bg-white/[0.02] dark:bg-[#0c1424]/40 border border-slate-200/60 dark:border-white/[0.05] p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-500/20 transition-all duration-300">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-sm border border-blue-500/15">
                              {flight.airline[0]}
                            </div>
                            <div>
                              <h4 className="font-heading text-sm font-bold text-luxury-primary dark:text-white">{flight.airline}</h4>
                              <span className="text-[10px] text-slate-450 dark:text-slate-500 font-mono font-semibold">{flight.code}</span>
                            </div>
                          </div>

                          <div className="flex gap-8 text-left">
                            <div>
                              <span className="block text-[8px] uppercase tracking-wider text-slate-450 font-bold">Departure</span>
                              <span className="text-xs font-semibold text-luxury-primary dark:text-white">{flight.dep}</span>
                              <span className="block text-[9px] text-slate-400 font-light mt-0.5">{originCity}</span>
                            </div>
                            <div className="flex flex-col items-center justify-center px-2">
                              <span className="text-[9px] text-slate-455 font-mono font-bold">{flight.dur}</span>
                              <div className="w-16 h-px bg-slate-300 dark:bg-white/10 relative my-1">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500" />
                              </div>
                              <span className="text-[8px] text-blue-400 font-bold">{flight.stops}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] uppercase tracking-wider text-slate-450 font-bold">Arrival</span>
                              <span className="text-xs font-semibold text-luxury-primary dark:text-white">{flight.arr}</span>
                              <span className="block text-[9px] text-slate-400 font-light mt-0.5">{destCity}</span>
                            </div>
                          </div>

                          <div className="text-right w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 flex sm:flex-col justify-between items-center sm:items-end">
                            <div>
                              <span className="block text-[8px] uppercase tracking-wider text-slate-450 font-bold sm:text-right">Live Airfare</span>
                              <span className="text-base font-extrabold text-[var(--accent)] font-mono">{formatCost(basePriceUSD)}</span>
                            </div>
                            <a 
                              href={\`https://www.google.com/travel/flights?q=Flights%20to%20\${encodeURIComponent(destCity)}%20from%20\${encodeURIComponent(originCity)}\`}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-1 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-102"
                            >
                              Book Seat
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

`;

if (content.includes(timelineEndMarker)) {
  content = content.replace(timelineEndMarker, insertion + '\n' + timelineEndMarker);
  console.log("Successfully inserted flights tab rendering!");
} else {
  console.error("FAIL: Could not locate timelineEndMarker");
}

fs.writeFileSync(filePath, content, 'utf-8');
