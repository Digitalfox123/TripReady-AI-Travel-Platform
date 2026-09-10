import React, { useMemo } from 'react';
import {
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Cloud,
  Zap,
  Wind,
  Droplets
} from 'lucide-react';

export default function TripWeatherScenery({
  weatherData,
  destName = 'Destination',
  destCountry = '',
  destTimezone = null
}) {
  // ── 1. Determine Time of Day in Destination City ───────────────────────────
  const { timePeriod, destHour, formattedLocalTime } = useMemo(() => {
    let hour = 12;
    let timeStr = '';
    const now = new Date();

    if (destTimezone) {
      try {
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: destTimezone,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).formatToParts(now);
        
        const hPart = parts.find(p => p.type === 'hour');
        const dayPeriodPart = parts.find(p => p.type === 'dayPeriod');
        if (hPart) {
          let h = parseInt(hPart.value, 10);
          if (dayPeriodPart && dayPeriodPart.value.toLowerCase() === 'pm' && h < 12) h += 12;
          if (dayPeriodPart && dayPeriodPart.value.toLowerCase() === 'am' && h === 12) h = 0;
          hour = h;
        }
        timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: destTimezone,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).format(now);
      } catch {
        hour = now.getHours();
        timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    } else {
      hour = now.getHours();
      timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    let period = 'day';
    if (hour >= 5 && hour < 8) period = 'dawn';
    else if (hour >= 8 && hour < 17) period = 'day';
    else if (hour >= 17 && hour < 20) period = 'dusk';
    else period = 'night';

    return { timePeriod: period, destHour: hour, formattedLocalTime: timeStr };
  }, [destTimezone]);

  // ── 2. Weather Condition Categorization ───────────────────────────────────
  const condition = (weatherData?.condition || 'Clear Sky').toLowerCase();
  const isRain = condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower');
  const isSnow = condition.includes('snow') || condition.includes('flurry') || condition.includes('ice');
  const isThunder = condition.includes('thunder') || condition.includes('storm');
  const isCloudy = condition.includes('cloud') || condition.includes('overcast') || condition.includes('fog') || condition.includes('mist');
  const isClear = !isRain && !isSnow && !isThunder && !isCloudy;

  // ── 3. Dynamic Sky Background Gradients ───────────────────────────────────
  const skyBackground = useMemo(() => {
    if (isThunder) {
      return 'from-slate-950 via-purple-950 to-slate-900';
    }
    if (isRain) {
      return 'from-slate-800 via-blue-950 to-slate-900';
    }
    if (isSnow) {
      return 'from-slate-800 via-indigo-950 to-slate-900';
    }

    switch (timePeriod) {
      case 'dawn':
        return 'from-amber-600 via-rose-600 to-purple-900';
      case 'dusk':
        return 'from-purple-900 via-rose-800 to-amber-700';
      case 'night':
        return 'from-[#050B18] via-[#0B1730] to-[#122444]';
      case 'day':
      default:
        return isCloudy
          ? 'from-slate-700 via-sky-800 to-slate-800'
          : 'from-sky-500 via-blue-600 to-indigo-700';
    }
  }, [timePeriod, isRain, isSnow, isThunder, isCloudy]);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-b ${skyBackground} text-white shadow-xl border border-white/10 min-h-[380px] flex flex-col justify-between p-6 select-none transition-all duration-700 group`}
    >
      {/* ══════════════════════════════════════════════════════════════════════
          SCENERY LAYER 1: STARS & TWINKLES (NIGHT ONLY)
          ══════════════════════════════════════════════════════════════════════ */}
      {timePeriod === 'night' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Static and twinkling celestial stars */}
          {[
            { t: '12%', l: '15%', s: 2, d: '0ms' },
            { t: '8%', l: '35%', s: 3, d: '300ms' },
            { t: '18%', l: '48%', s: 1.5, d: '700ms' },
            { t: '10%', l: '65%', s: 2.5, d: '200ms' },
            { t: '22%', l: '80%', s: 2, d: '500ms' },
            { t: '15%', l: '92%', s: 3, d: '400ms' },
            { t: '28%', l: '25%', s: 1.5, d: '600ms' },
            { t: '32%', l: '58%', s: 2, d: '100ms' },
            { t: '30%', l: '72%', s: 1.5, d: '800ms' },
            { t: '5%', l: '85%', s: 2, d: '250ms' }
          ].map((star, idx) => (
            <span
              key={idx}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                top: star.t,
                left: star.l,
                width: `${star.s}px`,
                height: `${star.s}px`,
                boxShadow: '0 0 6px rgba(255, 255, 255, 0.9)',
                animationDelay: star.d,
                animationDuration: '2.5s'
              }}
            />
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCENERY LAYER 2: CELESTIAL BODIES (SUN / MOON)
          ══════════════════════════════════════════════════════════════════════ */}
      {/* 1. Luminous Crescent Moon with Silver Ambient Glow (Night) */}
      {timePeriod === 'night' && (
        <div className="absolute top-8 right-10 pointer-events-none z-10 transition-transform duration-1000 group-hover:scale-105">
          {/* Radial Moon Glow */}
          <div className="absolute -inset-6 rounded-full bg-blue-300/15 blur-2xl pointer-events-none" />
          
          <svg className="w-16 h-16 sm:w-20 sm:h-20 text-amber-100 drop-shadow-[0_0_20px_rgba(254,243,199,0.5)]" viewBox="0 0 100 100" fill="none">
            {/* Glowing Crescent Silhouette */}
            <path
              d="M75 50C75 66.5685 61.5685 80 45 80C34.5029 80 25.2936 74.5977 20 66.4251C24.4288 68.708 29.5601 70 35 70C51.5685 70 65 56.5685 65 40C65 30.5601 60.708 22.1288 54 17.5C66.5977 21.7936 75 34.5029 75 50Z"
              fill="url(#moonGradient)"
            />
            {/* Subtle Crater Details */}
            <circle cx="50" cy="50" r="3" fill="#E2E8F0" fillOpacity="0.4" />
            <circle cx="58" cy="42" r="2" fill="#E2E8F0" fillOpacity="0.3" />
            <circle cx="56" cy="58" r="2.5" fill="#E2E8F0" fillOpacity="0.3" />
            <defs>
              <linearGradient id="moonGradient" x1="20" y1="20" x2="75" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFBEB" />
                <stop offset="0.6" stopColor="#FEF3C7" />
                <stop offset="1" stopColor="#FDE68A" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* 2. Radiant Rising Sun (Dawn / Sunrise) */}
      {timePeriod === 'dawn' && (
        <div className="absolute bottom-28 right-12 pointer-events-none z-10 transition-transform duration-1000">
          {/* Huge Rising Sun Flare */}
          <div className="absolute -inset-10 rounded-full bg-amber-400/40 blur-3xl" />
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-300 via-orange-400 to-rose-400 shadow-[0_0_60px_rgba(251,191,36,0.8)] border border-amber-200/50" />
        </div>
      )}

      {/* 3. Golden Sun with Ambient Flare (Daytime) */}
      {timePeriod === 'day' && !isThunder && (
        <div className="absolute top-6 right-10 pointer-events-none z-10 transition-transform duration-1000 group-hover:scale-105">
          {/* Sun Glow */}
          <div className="absolute -inset-8 rounded-full bg-amber-400/25 blur-3xl pointer-events-none animate-pulse" />
          
          <svg className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]" viewBox="0 0 100 100" fill="none">
            {/* Core Sun Disc */}
            <circle cx="50" cy="50" r="22" fill="url(#sunGradient)" />
            {/* Rotating Corona Rays */}
            <g className="animate-[spin_40s_linear_infinite]" style={{ transformOrigin: '50px 50px' }}>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
                <line
                  key={idx}
                  x1="50"
                  y1="18"
                  x2="50"
                  y2="10"
                  stroke="#FDE047"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  transform={`rotate(${angle} 50 50)`}
                  strokeOpacity="0.8"
                />
              ))}
            </g>
            <defs>
              <linearGradient id="sunGradient" x1="30" y1="30" x2="70" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FEF08A" />
                <stop offset="0.5" stopColor="#FACC15" />
                <stop offset="1" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* 4. Golden Crimson Sunset Sun (Dusk) */}
      {timePeriod === 'dusk' && (
        <div className="absolute bottom-24 right-14 pointer-events-none z-10 transition-transform duration-1000">
          <div className="absolute -inset-10 rounded-full bg-rose-500/40 blur-3xl" />
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-400 via-rose-500 to-purple-600 shadow-[0_0_50px_rgba(244,63,94,0.7)]" />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCENERY LAYER 3: CLOUDS & MIST (DYNAMIC DRIFTING)
          ══════════════════════════════════════════════════════════════════════ */}
      {(isCloudy || isRain || isSnow) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {/* Cloud Bank 1 (High layer) */}
          <div className="absolute -top-4 -left-10 w-96 h-28 bg-white/10 dark:bg-white/5 rounded-full blur-xl animate-[pulse_6s_ease-in-out_infinite]" />
          {/* Cloud Bank 2 (Mid layer) */}
          <div className="absolute top-10 right-4 w-80 h-24 bg-white/15 dark:bg-white/10 rounded-full blur-lg" />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCENERY LAYER 4: ANIMATED RAINFALL STREAKS & RIPPLES (IF RAINY)
          ══════════════════════════════════════════════════════════════════════ */}
      {isRain && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {/* 18 Staggered Falling Raindrops passing in front of mountains */}
          {[
            { l: '8%', d: '0ms', dur: '0.8s' },
            { l: '16%', d: '300ms', dur: '0.9s' },
            { l: '24%', d: '150ms', dur: '0.75s' },
            { l: '32%', d: '500ms', dur: '0.85s' },
            { l: '40%', d: '100ms', dur: '0.8s' },
            { l: '48%', d: '450ms', dur: '0.7s' },
            { l: '56%', d: '250ms', dur: '0.9s' },
            { l: '64%', d: '600ms', dur: '0.75s' },
            { l: '72%', d: '50ms', dur: '0.85s' },
            { l: '80%', d: '350ms', dur: '0.8s' },
            { l: '88%', d: '200ms', dur: '0.7s' },
            { l: '95%', d: '550ms', dur: '0.9s' },
            { l: '12%', d: '400ms', dur: '0.85s' },
            { l: '28%', d: '650ms', dur: '0.75s' },
            { l: '44%', d: '180ms', dur: '0.8s' },
            { l: '60%', d: '320ms', dur: '0.7s' },
            { l: '76%', d: '480ms', dur: '0.9s' },
            { l: '92%', d: '120ms', dur: '0.85s' }
          ].map((drop, idx) => (
            <div
              key={idx}
              className="absolute w-[1.5px] h-8 bg-gradient-to-b from-transparent via-blue-200 to-white/90 rounded-full animate-bounce"
              style={{
                left: drop.l,
                top: '-20px',
                animationDelay: drop.d,
                animationDuration: drop.dur,
                animationIterationCount: 'infinite',
                transform: 'rotate(15deg)'
              }}
            />
          ))}

          {/* Water Splash Ripples at bottom */}
          <div className="absolute bottom-6 left-1/4 w-8 h-1 rounded-full bg-blue-300/40 animate-ping" />
          <div className="absolute bottom-4 right-1/3 w-10 h-1 rounded-full bg-blue-200/50 animate-ping" style={{ animationDelay: '400ms' }} />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCENERY LAYER 5: ANIMATED SNOWFLAKES (IF SNOWY)
          ══════════════════════════════════════════════════════════════════════ */}
      {isSnow && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[
            { l: '10%', d: '0ms', dur: '3s', s: 4 },
            { l: '25%', d: '1s', dur: '3.5s', s: 6 },
            { l: '40%', d: '0.5s', dur: '2.8s', s: 3 },
            { l: '60%', d: '1.5s', dur: '3.2s', s: 5 },
            { l: '75%', d: '2s', dur: '2.9s', s: 4 },
            { l: '90%', d: '0.8s', dur: '3.4s', s: 5 }
          ].map((flake, idx) => (
            <div
              key={idx}
              className="absolute rounded-full bg-white/90 shadow-[0_0_8px_white] animate-pulse"
              style={{
                left: flake.l,
                top: '20%',
                width: `${flake.s}px`,
                height: `${flake.s}px`,
                animationDelay: flake.d,
                animationDuration: flake.dur
              }}
            />
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCENERY LAYER 6: MAJESTIC MOUNTAINS, GARDEN MEADOWS & PINE TREES (SVG)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10 select-none overflow-hidden">
        <svg
          className="w-full h-36 sm:h-44 preserve-3d"
          viewBox="0 0 1000 300"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Far Distant Mountain Range (Misty Atmospheric Silhouettes) */}
          <path
            d="M0 200 L120 110 L280 180 L420 80 L580 170 L720 95 L880 160 L1000 120 L1000 300 L0 300 Z"
            fill={timePeriod === 'night' ? '#0A152A' : timePeriod === 'dawn' || timePeriod === 'dusk' ? '#4A1D4E' : '#1E3A5F'}
            fillOpacity="0.55"
          />

          {/* Mid Ridge Peaks (Crisp Alpine Ridges with Snow Highlights) */}
          <path
            d="M0 240 L160 140 L310 210 L480 130 L640 220 L810 150 L1000 230 L1000 300 L0 300 Z"
            fill={timePeriod === 'night' ? '#060E1D' : timePeriod === 'dawn' || timePeriod === 'dusk' ? '#3B133E' : '#162C49'}
            fillOpacity="0.8"
          />

          {/* Mountain Peak Snow/Light Accent Caps */}
          <polygon
            points="480,130 460,150 500,150"
            fill={timePeriod === 'dawn' ? '#FDE68A' : '#FFFFFF'}
            fillOpacity="0.5"
          />
          <polygon
            points="160,140 145,155 175,155"
            fill={timePeriod === 'dawn' ? '#FDE68A' : '#FFFFFF'}
            fillOpacity="0.4"
          />
          <polygon
            points="810,150 795,165 825,165"
            fill={timePeriod === 'dawn' ? '#FDE68A' : '#FFFFFF'}
            fillOpacity="0.4"
          />

          {/* Near Foreground: Rolling Hills & Garden Meadow */}
          <path
            d="M0 260 C150 230 300 275 480 250 C680 225 820 270 1000 245 L1000 300 L0 300 Z"
            fill={timePeriod === 'night' ? '#030812' : timePeriod === 'dawn' || timePeriod === 'dusk' ? '#250B28' : '#0F1F33'}
          />

          {/* Foreground Meadow Garden Grass Silhouette */}
          <path
            d="M0 275 C200 260 400 285 600 270 C800 255 900 275 1000 265 L1000 300 L0 300 Z"
            fill={timePeriod === 'night' ? '#02050B' : timePeriod === 'dawn' || timePeriod === 'dusk' ? '#1A071C' : '#091524'}
          />

          {/* Pine Trees / Cypress Garden Silhouettes along the ridges */}
          {/* Tree Cluster Left */}
          <polygon points="90,240 85,255 95,255" fill="#02050B" fillOpacity="0.9" />
          <polygon points="105,232 100,250 110,250" fill="#02050B" fillOpacity="0.9" />
          <polygon points="120,238 115,255 125,255" fill="#02050B" fillOpacity="0.9" />

          {/* Tree Cluster Center */}
          <polygon points="520,245 515,260 525,260" fill="#02050B" fillOpacity="0.85" />
          <polygon points="535,238 529,258 541,258" fill="#02050B" fillOpacity="0.85" />

          {/* Tree Cluster Right */}
          <polygon points="860,242 854,260 866,260" fill="#02050B" fillOpacity="0.9" />
          <polygon points="875,234 869,255 881,255" fill="#02050B" fillOpacity="0.9" />
          <polygon points="890,240 885,260 895,260" fill="#02050B" fillOpacity="0.9" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SCENERY FOREGROUND: WEATHER TELEMETRY & DATA (FROSTED GLASS PILLS)
          ══════════════════════════════════════════════════════════════════════ */}
      {/* Top Header Row */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/15 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold uppercase tracking-wider text-emerald-300">
            {timePeriod === 'night'
              ? 'NIGHT SKY SCENERY'
              : timePeriod === 'dawn'
              ? 'SUNRISE OVER PEAKS'
              : timePeriod === 'dusk'
              ? 'GOLDEN TWILIGHT'
              : 'SUNNY HORIZON'}
          </span>
          <span className="opacity-40">•</span>
          <span className="text-white/80">{formattedLocalTime}</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium">
          {isRain ? (
            <CloudRain className="w-3.5 h-3.5 text-blue-300 animate-bounce" />
          ) : isSnow ? (
            <CloudSnow className="w-3.5 h-3.5 text-blue-100" />
          ) : isThunder ? (
            <Zap className="w-3.5 h-3.5 text-amber-300" />
          ) : timePeriod === 'night' ? (
            <Moon className="w-3.5 h-3.5 text-amber-200" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span className="capitalize">{weatherData?.condition || 'Clear Sky'}</span>
        </div>
      </div>

      {/* Main Temperature & Destination Display */}
      <div className="relative z-30 my-auto py-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6">
          <div className="flex items-baseline gap-1">
            <span className="text-6xl sm:text-7xl font-black tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              {weatherData?.temp ?? 22}
            </span>
            <span className="text-2xl sm:text-3xl font-light text-white/80">°C</span>
          </div>

          <div className="space-y-1">
            <div className="text-lg sm:text-xl font-bold text-white drop-shadow flex items-center gap-2">
              <span>{destName}</span>
              {destCountry && <span className="text-white/60 text-sm font-normal">({destCountry})</span>}
            </div>
            <div className="text-xs text-white/80 font-medium flex items-center gap-2 drop-shadow">
              <span>Feels like {weatherData?.feelsLike ?? 24}°C</span>
              <span>•</span>
              <span>H: {weatherData?.high ?? 26}° / L: {weatherData?.low ?? 18}°</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sleek Metric Strip (Frosted Glass Surface) */}
      <div className="relative z-30 grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-xs">
        <div className="flex items-center gap-2 px-2">
          <Droplets className="w-4 h-4 text-blue-300 flex-shrink-0" />
          <div>
            <span className="block text-[9px] uppercase font-mono text-white/60">Humidity</span>
            <span className="font-bold text-white text-xs">{weatherData?.humidity ?? 65}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 border-l border-white/10">
          <Wind className="w-4 h-4 text-teal-300 flex-shrink-0" />
          <div>
            <span className="block text-[9px] uppercase font-mono text-white/60">Wind</span>
            <span className="font-bold text-white text-xs">{weatherData?.windSpeed ?? 8} km/h</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 border-l border-white/10">
          <Sun className="w-4 h-4 text-amber-300 flex-shrink-0" />
          <div>
            <span className="block text-[9px] uppercase font-mono text-white/60">UV Index</span>
            <span className="font-bold text-white text-xs">{weatherData?.uvIndex ?? 3} (Moderate)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
