import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, MapPin, 
  Sunrise, Sunset, Sparkles, Droplets, Wind, Gauge, 
  Thermometer, Activity, Eye, Umbrella, X, Compass, Heart, LayoutGrid, Clock
} from 'lucide-react';

// ── CSS Stylesheet classes for Luxury Theme, Shadows & Light/Dark Modes ──────
const STYLES_CSS = `
  @keyframes udRainFall {
    0% { transform: translateY(-10px) translateX(0) rotate(12deg); opacity: 0; }
    10% { opacity: 0.7; }
    90% { opacity: 0.7; }
    100% { transform: translateY(140px) translateX(30px) rotate(12deg); opacity: 0; }
  }
  @keyframes udSnowDrift {
    0% { transform: translateY(-10px) translateX(0) rotate(0deg); opacity: 0; }
    10% { opacity: 0.8; }
    50% { transform: translateY(70px) translateX(12px) rotate(180deg); }
    100% { transform: translateY(140px) translateX(-8px) rotate(360deg); opacity: 0; }
  }
  @keyframes udFlash {
    0%, 93%, 100% { opacity: 0; }
    95% { opacity: 0.85; }
    96% { opacity: 0.05; }
    97% { opacity: 0.55; }
    98% { opacity: 0; }
  }
  @keyframes udSunSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes udSunPulse {
    0%, 100% { transform: scale(1); opacity: 0.9; }
    50% { transform: scale(1.06); opacity: 1; }
  }
  @keyframes udCloudDrift {
    0%, 100% { transform: translateX(0px); }
    50% { transform: translateX(10px); }
  }
  @keyframes udCloudDriftBack {
    0%, 100% { transform: translateX(0px); }
    50% { transform: translateX(-6px); }
  }
  @keyframes udTwinkle {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.8; }
  }

  /* ═══ LUXURY THEMING CLASSES ═══ */

  /* Main unified card container */
  .unified-dashboard-card {
    border: 1px solid rgba(2, 8, 19, 0.08);
    box-shadow: 0 16px 44px rgba(2, 8, 19, 0.03);
    transition: all 0.4s ease;
  }
  .dark .unified-dashboard-card {
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 24px 72px rgba(0, 0, 0, 0.45);
  }

  /* Left Panel Always Dark elements */
  .left-panel-text-primary {
    color: #ffffff;
  }
  .left-panel-text-secondary {
    color: rgba(255, 255, 255, 0.7);
  }
  .left-panel-text-muted {
    color: rgba(255, 255, 255, 0.45);
  }

  /* Metric Glass Sub-Cards (Adapts dynamically between Light/Dark) */
  .glass-sub-card {
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    background: rgba(255, 255, 255, 0.55);
    border: 1px solid rgba(2, 8, 19, 0.06);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 8px 24px rgba(2, 8, 19, 0.02);
    transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .dark .glass-sub-card {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 20px 80px rgba(0, 0, 0, 0.35);
  }

  .sub-card-title {
    color: rgba(15, 23, 42, 0.45);
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 750;
    letter-spacing: 0.05em;
  }
  .dark .sub-card-title {
    color: rgba(255, 255, 255, 0.4);
  }

  .sub-card-value {
    color: #0f172a;
    font-weight: 700;
  }
  .dark .sub-card-value {
    color: #ffffff;
  }

  .sub-card-caption {
    color: rgba(15, 23, 42, 0.55);
    font-size: 10px;
    font-weight: 300;
  }
  .dark .sub-card-caption {
    color: rgba(255, 255, 255, 0.45);
  }

  /* Right Panel: Minimal Forecast Rail (Fixes white-text light-mode invisibility) */
  .forecast-title {
    color: rgba(15, 23, 42, 0.45);
  }
  .dark .forecast-title {
    color: rgba(255, 255, 255, 0.45);
  }

  .forecast-row-btn {
    color: rgba(15, 23, 42, 0.6);
    background: transparent;
    border: 1px solid transparent;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .dark .forecast-row-btn {
    color: rgba(255, 255, 255, 0.5);
  }
  
  .forecast-row-btn:hover {
    color: #0f172a;
    background: rgba(15, 23, 42, 0.04);
  }
  .dark .forecast-row-btn:hover {
    color: rgba(255, 255, 255, 0.85);
    background: rgba(255, 255, 255, 0.05);
  }
  
  .forecast-row-btn.active {
    color: #0f172a;
    background: rgba(255, 255, 255, 0.88);
    border-color: rgba(2, 8, 19, 0.08);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 6px 18px rgba(2, 8, 19, 0.02);
  }
  .dark .forecast-row-btn.active {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .forecast-rec-title {
    color: rgba(15, 23, 42, 0.4);
  }
  .dark .forecast-rec-title {
    color: rgba(255, 255, 255, 0.3);
  }

  .forecast-rec-body {
    color: rgba(15, 23, 42, 0.6);
  }
  .dark .forecast-rec-body {
    color: rgba(255, 255, 255, 0.5);
  }
`;

// Time-of-day dynamic gradient configurations
const THEMES = {
  dawn: {
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #311042 25%, #581c87 50%, #701a75 75%, #f43f5e 100%)',
    ambientGlow: 'radial-gradient(circle at 15% 85%, rgba(244,63,94,0.18) 0%, transparent 60%)',
  },
  morning: {
    gradient: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 30%, #38bdf8 65%, #bae6fd 100%)',
    ambientGlow: 'radial-gradient(circle at 85% 15%, rgba(253,224,71,0.22) 0%, transparent 55%)',
  },
  afternoon: {
    gradient: 'linear-gradient(135deg, #075985 0%, #0369a1 30%, #0ea5e9 65%, #38bdf8 100%)',
    ambientGlow: 'radial-gradient(circle at 50% 10%, rgba(255,255,255,0.15) 0%, transparent 50%)',
  },
  goldenHour: {
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 25%, #ea580c 55%, #f97316 80%, #fde047 100%)',
    ambientGlow: 'radial-gradient(circle at 30% 70%, rgba(253,224,71,0.2) 0%, transparent 55%)',
  },
  night: {
    gradient: 'linear-gradient(135deg, #030712 0%, #0f172a 40%, #1e1b4b 75%, #0c0a09 100%)',
    ambientGlow: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 60%)',
  },
};

// ── Animated Weather SVG Illustrations ─────────────────────────────────────────
const ClearIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="28" fill="rgba(251,191,36,0.12)" style={{ animation: 'udSunPulse 4s ease-in-out infinite' }} />
    <circle cx="60" cy="60" r="20" fill="rgba(251,191,36,0.25)" style={{ animation: 'udSunPulse 4s ease-in-out infinite', animationDelay: '1s' }} />
    <circle cx="60" cy="60" r="14" fill="url(#sunGrad)" />
    <g style={{ transformOrigin: '60px 60px', animation: 'udSunSpin 28s linear infinite' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1="60"
          y1="22"
          x2="60"
          y2="32"
          stroke="#fbbf24"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${i * 45} 60 60)`}
          style={{ animation: 'udSunPulse 2.5s ease-in-out infinite', animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </g>
    <defs>
      <linearGradient id="sunGrad" x1="46" y1="46" x2="74" y2="74" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="40%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
  </svg>
);

const RainIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .rain-drop-1 { animation: udRainFall 0.8s linear infinite; }
      .rain-drop-2 { animation: udRainFall 0.8s linear infinite; animation-delay: 0.25s; }
      .rain-drop-3 { animation: udRainFall 0.8s linear infinite; animation-delay: 0.5s; }
    `}</style>
    <path d="M40 66 C40 54 50 47 60 47 C67 47 74 50 78 57 C85 57 90 62 90 69 C90 76 85 81 78 81 H40 C33 81 28 76 28 69 C28 62 33 66 40 66 Z" fill="rgba(148,163,184,0.25)" style={{ animation: 'udCloudDriftBack 6s ease-in-out infinite' }} />
    <line className="rain-drop-1" x1="42" y1="81" x2="42" y2="93" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
    <line className="rain-drop-2" x1="56" y1="81" x2="56" y2="96" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
    <line className="rain-drop-3" x1="70" y1="81" x2="70" y2="91" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
    <line className="rain-drop-1" x1="80" y1="81" x2="80" y2="94" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
    <path d="M35 71 C35 60 44 53 54 53 C61 53 66 57 70 62 C75 62 80 67 80 74 C80 81 75 86 70 86 H35 C28 86 23 81 23 74 C23 67 28 71 35 71 Z" fill="url(#rainCloudGrad)" style={{ animation: 'udCloudDrift 6s ease-in-out infinite' }} />
    <defs>
      <linearGradient id="rainCloudGrad" x1="23" y1="53" x2="80" y2="86" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
  </svg>
);

const SnowIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .flake-1 { animation: udSnowDrift 2s linear infinite; }
      .flake-2 { animation: udSnowDrift 2s linear infinite; animation-delay: 0.6s; }
      .flake-3 { animation: udSnowDrift 2s linear infinite; animation-delay: 1.2s; }
    `}</style>
    <path d="M35 68 C35 57 44 50 54 50 C61 50 66 54 70 60 C75 60 80 65 80 72 C80 79 75 84 70 84 H35 C28 84 23 79 23 72 C23 65 28 68 35 68 Z" fill="url(#snowCloudGrad)" style={{ animation: 'udCloudDrift 7s ease-in-out infinite' }} />
    <g className="flake-1" style={{ transformOrigin: '36px 84px' }}><circle cx="36" cy="92" r="2.5" fill="#e2e8f0" /></g>
    <g className="flake-2" style={{ transformOrigin: '52px 84px' }}><path d="M52 89 v6 M49 92 h6" stroke="#f1f5f9" strokeWidth="1" strokeLinecap="round" /></g>
    <g className="flake-3" style={{ transformOrigin: '68px 84px' }}><circle cx="68" cy="94" r="2" fill="#ffffff" /></g>
    <defs>
      <linearGradient id="snowCloudGrad" x1="23" y1="50" x2="80" y2="84" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
    </defs>
  </svg>
);

const StormIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .lightning-bolt { animation: udFlash 3.5s ease-in-out infinite; }
      .storm-rain-1 { animation: udRainFall 0.5s linear infinite; }
      .storm-rain-2 { animation: udRainFall 0.5s linear infinite; animation-delay: 0.18s; }
    `}</style>
    <path d="M40 62 C40 50 50 43 60 43 C67 43 74 47 78 54 C85 54 90 59 90 66 C90 73 85 78 78 78 H40 C33 78 28 73 28 66 C28 59 33 62 40 62 Z" fill="#1e293b" style={{ animation: 'udCloudDriftBack 5s ease-in-out infinite' }} />
    <line className="storm-rain-1" x1="38" y1="78" x2="38" y2="90" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <line className="storm-rain-2" x1="52" y1="78" x2="52" y2="93" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
    <path className="lightning-bolt" d="M58 72 L46 92 H56 L49 112 L70 86 H60 L65 72 Z" fill="#facc15" filter="drop-shadow(0 0 6px #f59e0b)" />
    <path d="M35 68 C35 57 44 50 54 50 C61 50 66 54 70 60 C75 60 80 65 80 72 C80 79 75 84 70 84 H35 C28 84 23 79 23 72 C23 65 28 68 35 68 Z" fill="url(#stormCloudGrad)" style={{ animation: 'udCloudDrift 5s ease-in-out infinite' }} />
    <defs>
      <linearGradient id="stormCloudGrad" x1="23" y1="50" x2="80" y2="84" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>
  </svg>
);

const CloudyIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M44 60 C44 49 53 42 64 42 C71 42 76 45 80 50 C87 50 92 55 92 62 C92 69 87 74 82 74 H44 C37 74 32 69 32 62 C32 55 37 60 44 60 Z" fill="rgba(191,219,254,0.35)" style={{ animation: 'udCloudDriftBack 8s ease-in-out infinite' }} />
    <path d="M30 72 C30 63 37 56 46 56 C51 56 56 59 60 64 C65 64 70 69 70 76 C70 83 65 88 60 88 H30 C23 88 18 83 18 76 C18 69 23 72 30 72 Z" fill="rgba(241,245,249,0.25)" style={{ animation: 'udCloudDrift 8s ease-in-out infinite', animationDelay: '1s' }} />
    <path d="M37 68 C37 57 46 50 56 50 C63 50 68 54 72 59 C77 59 82 64 82 71 C82 78 77 83 72 83 H37 C30 83 25 78 25 71 C25 64 30 68 37 68 Z" fill="url(#cloudyGrad)" style={{ animation: 'udCloudDrift 7s ease-in-out infinite' }} />
    <defs>
      <linearGradient id="cloudyGrad" x1="25" y1="50" x2="82" y2="83" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#cbd5e1" />
        <stop offset="60%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>
    </defs>
  </svg>
);

const WeatherIllustration = ({ condition }) => {
  switch (condition.toUpperCase()) {
    case 'RAIN': return <RainIllustration />;
    case 'SNOW': return <SnowIllustration />;
    case 'STORM': return <StormIllustration />;
    case 'CLOUDY': return <CloudyIllustration />;
    case 'CLEAR':
    default:
      return <ClearIllustration />;
  }
};

// SVG Curve Points
const getCurvePointLarge = (t) => {
  const x0 = 50, y0 = 175;
  const x1 = 250, y1 = 30;
  const x2 = 450, y2 = 175;
  const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2;
  const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2;
  return { x, y };
};

// ── Helper: Get Offset for Country/City (Fallback for 'Local Time') ───────────
function getOffsetForCountryOrCity(name, country) {
  const n = (name || '').toLowerCase();
  const c = (country || '').toLowerCase();

  // Check specific cities first
  if (n.includes('tokyo') || n.includes('kyoto') || n.includes('osaka')) return 9;
  if (n.includes('sydney') || n.includes('melbourne')) return 10;
  if (n.includes('auckland') || n.includes('queenstown') || n.includes('rotorua')) return 12;
  if (n.includes('london') || n.includes('edinburgh')) return 1;
  if (n.includes('paris') || n.includes('rome') || n.includes('berlin') || n.includes('madrid') || n.includes('amsterdam') || n.includes('zurich') || n.includes('geneva')) return 1;
  if (n.includes('dubai') || n.includes('abu dhabi')) return 4;
  if (n.includes('mecca') || n.includes('medina') || n.includes('riyadh') || n.includes('jeddah')) return 3;
  if (n.includes('delhi') || n.includes('mumbai') || n.includes('bangalore')) return 5.5;
  if (n.includes('karachi') || n.includes('lahore') || n.includes('islamabad') || n.includes('hunza')) return 5;
  if (n.includes('new york') || n.includes('miami') || n.includes('boston') || n.includes('toronto')) return -5;
  if (n.includes('chicago') || n.includes('houston')) return -6;
  if (n.includes('denver')) return -7;
  if (n.includes('los angeles') || n.includes('san francisco') || n.includes('seattle') || n.includes('vancouver')) return -8;
  if (n.includes('cairo')) return 3;
  if (n.includes('cape town') || n.includes('johannesburg')) return 2;
  if (n.includes('singapore')) return 8;
  if (n.includes('bangkok') || n.includes('phuket')) return 7;
  if (n.includes('kuala lumpur')) return 8;
  if (n.includes('bali') || n.includes('jakarta')) return 8;

  // Fallback to country matching
  if (c.includes('japan') || c.includes('south korea')) return 9;
  if (c.includes('china') || c.includes('singapore') || c.includes('malaysia') || c.includes('philippines') || c.includes('taiwan')) return 8;
  if (c.includes('vietnam') || c.includes('thailand') || c.includes('cambodia') || c.includes('indonesia')) return 7;
  if (c.includes('bangladesh')) return 6;
  if (c.includes('india') || c.includes('sri lanka')) return 5.5;
  if (c.includes('pakistan') || c.includes('maldives')) return 5;
  if (c.includes('uae') || c.includes('united arab emirates') || c.includes('oman') || c.includes('georgia') || c.includes('armenia')) return 4;
  if (c.includes('saudi arabia') || c.includes('turkey') || c.includes('qatar') || c.includes('kuwait') || c.includes('bahrain') || c.includes('iraq') || c.includes('yemen') || c.includes('east africa') || c.includes('kenya') || c.includes('tanzania') || c.includes('madagascar') || c.includes('uganda') || c.includes('ethiopia')) return 3;
  if (c.includes('greece') || c.includes('egypt') || c.includes('south africa') || c.includes('finland') || c.includes('romania') || c.includes('ukraine') || c.includes('bulgaria') || c.includes('israel') || c.includes('jordan') || c.includes('lebanon') || c.includes('syria') || c.includes('cyprus')) return 2;
  if (c.includes('france') || c.includes('germany') || c.includes('italy') || c.includes('spain') || c.includes('switzerland') || c.includes('austria') || c.includes('netherlands') || c.includes('belgium') || c.includes('sweden') || c.includes('norway') || c.includes('poland') || c.includes('czech') || c.includes('hungary') || c.includes('slovakia') || c.includes('croatia')) return 1;
  if (c.includes('uk') || c.includes('united kingdom') || c.includes('ireland') || c.includes('portugal') || c.includes('iceland') || c.includes('morocco')) return 0;
  if (c.includes('cape verde') || c.includes('azores')) return -1;
  if (c.includes('brazil') || c.includes('argentina') || c.includes('uruguay') || c.includes('chile')) return -3;
  if (c.includes('venezuela') || c.includes('bolivia') || c.includes('paraguay')) return -4;
  if (c.includes('peru') || c.includes('ecuador') || c.includes('colombia') || c.includes('panama') || c.includes('cuba') || c.includes('jamaica')) return -5;
  if (c.includes('mexico') || c.includes('costa rica') || c.includes('guatemala') || c.includes('honduras') || c.includes('nicaragua')) return -6;
  if (c.includes('canada') || c.includes('usa') || c.includes('united states')) return -5;
  if (c.includes('australia')) return 10;
  if (c.includes('new zealand') || c.includes('fiji')) return 12;

  return 0;
}

// ── Helper: Parse UTC offset ──────────────────────────────────────────────────
function parseUtcOffset(tzString) {
  if (!tzString) return 0;
  const match = tzString.match(/(?:GMT|UTC)?([+-])(\d+\.?\d*)/i);
  if (!match) {
    const simpleMatch = tzString.match(/([+-])(\d+\.?\d*)/);
    if (!simpleMatch) return 0;
    const sign = simpleMatch[1] === '-' ? -1 : 1;
    return sign * parseFloat(simpleMatch[2]);
  }
  const sign = match[1] === '-' ? -1 : 1;
  return sign * parseFloat(match[2]);
}


// ── Helper: Get destination adjusted local date ────────────────────────────────
function getDestinationDate(utcOffsetHours) {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + utcOffsetHours * 3600000);
}

// ── Helper: Get clean time/date display ─────────────────────────────────────────
function getCleanDateDisplay(utcOffsetHours) {
  const destNow = getDestinationDate(utcOffsetHours);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return destNow.toLocaleDateString('en-US', options);
}

// ── Helper: getMetricsForDay ──────────────────────────────────────────────────
function getMetricsForDay(tempStr, conditionStr, dayIndex) {
  const temp = parseInt(tempStr) || 20;
  const cond = (conditionStr || 'CLEAR').toUpperCase();
  const idx = dayIndex || 0;

  let aqi = 32;
  let aqiStatus = 'Good';
  let cloud = 10;
  let cloudStatus = 'Sunny';
  let humidity = 45;
  let precipitation = 0;
  let wind = 12;
  let pressure = 1013;
  let feelsLike = temp;
  let visibility = 10;

  if (cond === 'RAIN') {
    aqi = 18 + (idx * 3) % 15;
    cloud = 85 + (idx * 2) % 12;
    humidity = 82 + (idx * 1) % 12;
    precipitation = 75 + (idx * 5) % 20;
    wind = 16 + (idx * 3) % 10;
    pressure = 1006 - (idx * 2) % 6;
    feelsLike = Math.round(temp - 2);
    visibility = 6 - (idx % 2);
  } else if (cond === 'SNOW') {
    aqi = 12 + (idx * 2) % 10;
    cloud = 78 + (idx * 3) % 15;
    humidity = 74 + (idx * 2) % 12;
    precipitation = 60 + (idx * 6) % 25;
    wind = 14 + (idx * 4) % 12;
    pressure = 1009 - (idx * 1) % 5;
    feelsLike = Math.round(temp - 4);
    visibility = 5 - (idx % 3);
  } else if (cond === 'STORM') {
    aqi = 45 + (idx * 5) % 25;
    cloud = 92 + (idx * 1) % 8;
    humidity = 88 + (idx * 1) % 8;
    precipitation = 90 + (idx * 2) % 10;
    wind = 26 + (idx * 6) % 20;
    pressure = 994 - (idx * 3) % 8;
    feelsLike = Math.round(temp - 3);
    visibility = 3 - (idx % 2);
  } else if (cond === 'CLOUDY') {
    aqi = 38 + (idx * 4) % 20;
    cloud = 68 + (idx * 5) % 22;
    humidity = 58 + (idx * 3) % 15;
    precipitation = 15 + (idx * 4) % 15;
    wind = 11 + (idx * 2) % 8;
    pressure = 1011 - (idx * 2) % 4;
    feelsLike = temp;
    visibility = 8 - (idx % 3);
  } else { // CLEAR
    aqi = 25 + (idx * 6) % 30;
    cloud = 8 + (idx * 2) % 10;
    humidity = 40 + (idx * 4) % 15;
    precipitation = 0;
    wind = 9 + (idx * 3) % 8;
    pressure = 1016 + (idx * 1) % 4;
    feelsLike = Math.round(temp + 1);
    visibility = 10;
  }

  // Determine AQI Status
  if (aqi <= 50) aqiStatus = 'Good';
  else if (aqi <= 100) aqiStatus = 'Moderate';
  else aqiStatus = 'Sensitive';

  // Determine Cloud Status
  if (cloud < 20) cloudStatus = 'Clear';
  else if (cloud < 50) cloudStatus = 'Partly Cloudy';
  else if (cloud < 80) cloudStatus = 'Mostly Cloudy';
  else cloudStatus = 'Overcast';

  return {
    aqi,
    aqiStatus,
    cloud,
    cloudStatus,
    humidity,
    precipitation,
    wind,
    pressure,
    feelsLike,
    visibility
  };
}

// ── Helper: getTravelScore ────────────────────────────────────────────────────
function getTravelScore(temp, cond, humidity, wind, precipitation) {
  let score = 9.2;
  let text = 'Excellent';

  const t = parseInt(temp) || 20;
  const c = (cond || 'CLEAR').toUpperCase();
  const h = humidity || 50;
  const w = wind || 12;
  const p = precipitation || 0;

  // Deduct for extreme temps
  if (t > 35) score -= (t - 35) * 0.4;
  if (t < 10) score -= (10 - t) * 0.3;

  // Deduct for humidity
  if (h > 75) score -= (h - 75) * 0.05;

  // Deduct for wind
  if (w > 25) score -= (w - 25) * 0.1;

  // Deduct for precipitation
  if (p > 10) score -= (p * 0.04);

  // Condition adjustments
  if (c === 'STORM') score -= 3.5;
  else if (c === 'RAIN') score -= 2.0;
  else if (c === 'SNOW') score -= 2.5;
  else if (c === 'CLOUDY') score -= 0.5;

  score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));

  if (score >= 8.5) text = 'Excellent';
  else if (score >= 7.0) text = 'Very Good';
  else if (score >= 5.5) text = 'Fair';
  else text = 'Poor';

  return { score, text };
}

// ── Helper: getBestTimeText ───────────────────────────────────────────────────
function getBestTimeText(temp, cond, sunsetTime) {
  const c = (cond || 'CLEAR').toUpperCase();
  if (c === 'STORM') return 'Stay indoors; unsafe conditions';
  if (c === 'RAIN') return 'Between showers (late morning)';
  if (c === 'SNOW') return 'Mid-day (11 AM - 2 PM)';
  
  const t = parseInt(temp) || 20;
  if (t > 32) return 'Early morning (6 AM - 9 AM) or sunset';
  if (t < 12) return 'Early afternoon (12 PM - 3 PM)';
  
  return 'Ideal all day (especially golden hour)';
}

// ── Component ──────────────────────────────────────────────────────────────────
const UnifiedWeatherDashboard = ({
  location = 'Destination Climate',
  currentWeather = {},
  dailyForecast = [],
  destination = {},
  activeDayIdx = 0,
  setActiveDayIdx = () => {}
}) => {
  const [activeTab, setActiveTab] = useState(0); // 0: Overview, 1: Moisture, 2: Wind, 3: Comfort
  const [showAiSentinel, setShowAiSentinel] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentHour, setCurrentHour] = useState(12);

  const timezone = currentWeather.timezone || destination.timezone || 'EST (UTC-5)';
  const utcOffset = useMemo(() => {
    if (!timezone || timezone.toLowerCase() === 'local time') {
      return getOffsetForCountryOrCity(destination.name, destination.country);
    }
    return parseUtcOffset(timezone);
  }, [timezone, destination]);

  // Handle local clock updates
  useEffect(() => {
    const tick = () => {
      const destNow = getDestinationDate(utcOffset);
      setCurrentHour(destNow.getHours());
      
      const h = destNow.getHours() % 12 || 12;
      const m = destNow.getMinutes().toString().padStart(2, '0');
      const ampm = destNow.getHours() >= 12 ? 'PM' : 'AM';
      setCurrentTime(`${h}:${m} ${ampm}`);
    };
    
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [utcOffset, timezone]);

  // Selected Day Information
  const activeDay = useMemo(() => {
    if (dailyForecast.length > 0 && dailyForecast[activeDayIdx]) {
      return dailyForecast[activeDayIdx];
    }
    return {
      day: 'Today',
      temp: currentWeather.temp || '22°C',
      condition: currentWeather.condition || 'Clear',
      suggestions: 'Normal clothing'
    };
  }, [dailyForecast, activeDayIdx, currentWeather]);

  // Dynamic Date string matching selected offset
  const displayDateStr = useMemo(() => {
    // If today is active, show timezone-adjusted date.
    // Otherwise, simulate forecast calendar dates (relative to today).
    if (activeDayIdx === 0) {
      return getCleanDateDisplay(utcOffset);
    }
    const offsetDate = getDestinationDate(utcOffset);
    offsetDate.setDate(offsetDate.getDate() + activeDayIdx);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return offsetDate.toLocaleDateString('en-US', options);
  }, [activeDayIdx, utcOffset]);

  // Map condition text
  const activeConditionCode = useMemo(() => {
    const lower = activeDay.condition.toLowerCase();
    if (lower.includes('rain') || lower.includes('drizzle') || lower.includes('tropical') || lower.includes('wet')) return 'RAIN';
    if (lower.includes('snow') || lower.includes('crisp') || lower.includes('ice') || lower.includes('freeze')) return 'SNOW';
    if (lower.includes('storm') || lower.includes('thunder')) return 'STORM';
    if (lower.includes('cloud') || lower.includes('fog') || lower.includes('mist') || lower.includes('overcast') || lower.includes('grey')) return 'CLOUDY';
    return 'CLEAR';
  }, [activeDay]);

  // Time period background
  const timePeriod = useMemo(() => {
    if (currentHour >= 5 && currentHour < 7) return 'dawn';
    if (currentHour >= 7 && currentHour < 12) return 'morning';
    if (currentHour >= 12 && currentHour < 17) return 'afternoon';
    if (currentHour >= 17 && currentHour < 20) return 'goldenHour';
    return 'night';
  }, [currentHour]);

  const theme = THEMES[timePeriod];
  const isDay = currentHour >= 6 && currentHour < 19;

  // Derive metrics
  const metrics = useMemo(() => {
    const baseTemp = activeDay.temp.includes('/') ? activeDay.temp.split('/')[0] : activeDay.temp;
    const computed = getMetricsForDay(baseTemp, activeConditionCode, activeDayIdx);
    // Merge actual API stats if today is active
    if (activeDayIdx === 0 && currentWeather.humidity) {
      computed.humidity = parseInt(currentWeather.humidity) || computed.humidity;
    }
    
    return computed;
  }, [activeDay, activeConditionCode, activeDayIdx, currentWeather]);

  // Derive travel score & explorer windows
  const travelScoreObj = useMemo(() => {
    const tempVal = activeDay.temp.includes('/') ? activeDay.temp.split('/')[0] : activeDay.temp;
    return getTravelScore(
      tempVal,
      activeConditionCode,
      metrics.humidity,
      metrics.wind,
      metrics.precipitation
    );
  }, [activeDay, activeConditionCode, metrics]);

  const bestTimeText = useMemo(() => {
    const tempVal = activeDay.temp.includes('/') ? activeDay.temp.split('/')[0] : activeDay.temp;
    return getBestTimeText(tempVal, activeConditionCode, '6:51 PM');
  }, [activeDay, activeConditionCode]);

  // Trajectory curve node position
  const sunPosition = useMemo(() => {
    let t = 0.5;
    if (isDay) {
      t = (currentHour - 6) / 12;
    } else {
      if (currentHour >= 18) {
        t = (currentHour - 18) / 12;
      } else {
        t = (currentHour + 6) / 12;
      }
    }
    t = Math.max(0, Math.min(1, t));
    return getCurvePointLarge(t);
  }, [currentHour, isDay]);

  // Particles
  const stars = useMemo(() => {
    return Array.from({ length: 25 }, () => ({
      x: Math.random() * 96 + 2,
      y: Math.random() * 50 + 2,
      size: Math.random() * 1.4 + 0.3,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 1.5,
    }));
  }, []);

  const rainDrops = useMemo(() => {
    return Array.from({ length: 18 }, () => ({
      x: Math.random() * 105 - 2,
      delay: Math.random() * 1.5,
      duration: Math.random() * 0.4 + 0.35,
      width: Math.random() * 0.4 + 0.3,
      height: Math.random() * 16 + 8,
      opacity: Math.random() * 0.2 + 0.08,
    }));
  }, []);

  const snowFlakes = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: Math.random() * 3 + 4,
      size: Math.random() * 2.5 + 1,
      opacity: Math.random() * 0.35 + 0.15,
    }));
  }, []);

  const clouds = useMemo(() => {
    return Array.from({ length: 2 }, (_, i) => ({
      y: 12 + i * 18 + Math.random() * 8,
      delay: i * 8 + Math.random() * 3,
      duration: 16 + Math.random() * 8,
      width: 65 + Math.random() * 45,
      height: 18 + Math.random() * 12,
      opacity: Math.random() * 0.08 + 0.03,
    }));
  }, []);

  const intelligentPackingList = useMemo(() => {
    const items = [];
    const conditionText = activeDay.condition.toLowerCase();
    const tempVal = parseInt(activeDay.temp) || 20;

    if (conditionText.includes('rain') || conditionText.includes('drizzle')) {
      items.push('Waterproof shoes recommended');
      items.push('Light rain expected; pack travel umbrella');
    } else if (conditionText.includes('storm')) {
      items.push('Severe storm warning; restrict outdoor commutes');
      items.push('Heavy downpours; carry rain shield items');
    } else if (conditionText.includes('snow') || conditionText.includes('freeze')) {
      items.push('Sub-zero weather; layer heavy thermal fleece');
      items.push('Slippery conditions; wear snow-grip boots');
    } else {
      if (tempVal > 28) {
        items.push('UV index high; apply SPF 50+ sunscreen');
        items.push('Intense sun; carry active hydration');
      } else {
        items.push('Optimal lighting; great window for landscape photos');
        items.push('Calm winds; ideal parameters for outdoor strolls');
      }
    }

    if (tempVal < 16) {
      items.push('Chilly evening drafts; pack insulated outerwear');
    } else if (tempVal > 24) {
      items.push('Warm afternoon; wear loose breathable linen');
    }

    items.push(activeDay.suggestions);
    return items;
  }, [activeDay]);

  const renderTwoMetrics = () => {
    switch (activeTab) {
      case 1: // Moisture
        return (
          <>
            {/* Card A: Humidity */}
            <div className="flex-1 p-6 rounded-3xl flex flex-col justify-between text-left h-[130px] glass-sub-card">
              <div className="flex items-center justify-between">
                <span className="sub-card-title">Humidity</span>
                <Droplets size={16} className="text-cyan-400" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold font-heading sub-card-value">{metrics.humidity}%</div>
                <div className="mt-2 text-[10px] sub-card-caption flex items-center justify-between">
                  <span>Relative moisture</span>
                  <div className="w-16 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${metrics.humidity}%` }} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card B: Precipitation */}
            <div className="flex-1 p-6 rounded-3xl flex flex-col justify-between text-left h-[130px] glass-sub-card">
              <div className="flex items-center justify-between">
                <span className="sub-card-title">Precipitation</span>
                <Umbrella size={16} className="text-blue-400" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold font-heading sub-card-value">{metrics.precipitation}%</div>
                <div className="mt-2 text-[10px] sub-card-caption flex items-center justify-between">
                  <span>Probability of rain</span>
                  <div className="w-16 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${metrics.precipitation}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 2: // Wind
        return (
          <>
            {/* Card A: Wind Speed */}
            <div className="flex-1 p-6 rounded-3xl flex flex-col justify-between text-left h-[130px] glass-sub-card">
              <div className="flex items-center justify-between">
                <span className="sub-card-title">Wind Speed</span>
                <Wind size={16} className="text-teal-400" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold font-heading sub-card-value">{metrics.wind} km/h</div>
                <div className="mt-2 text-[10px] sub-card-caption flex items-center justify-between">
                  <span>Current air velocity</span>
                  <div className="w-16 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: `${Math.min(100, (metrics.wind / 50) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card B: Pressure */}
            <div className="flex-1 p-6 rounded-3xl flex flex-col justify-between text-left h-[130px] glass-sub-card">
              <div className="flex items-center justify-between">
                <span className="sub-card-title">Pressure</span>
                <Gauge size={16} className="text-rose-400" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold font-heading sub-card-value">{metrics.pressure} hPa</div>
                <div className="mt-2 text-[10px] sub-card-caption flex items-center justify-between">
                  <span>Barometric forces</span>
                  <div className="w-16 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: `${Math.max(10, Math.min(100, ((metrics.pressure - 970) / 60) * 100))}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 3: // Comfort
        return (
          <>
            {/* Card A: Feels Like */}
            <div className="flex-1 p-6 rounded-3xl flex flex-col justify-between text-left h-[130px] glass-sub-card">
              <div className="flex items-center justify-between">
                <span className="sub-card-title">Feels Like</span>
                <Thermometer size={16} className="text-orange-400" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold font-heading sub-card-value">{metrics.feelsLike}°C</div>
                <div className="mt-2 text-[10px] sub-card-caption flex items-center justify-between">
                  <span>Thermal sensation</span>
                  <div className="w-16 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${Math.max(10, Math.min(100, ((metrics.feelsLike + 10) / 55) * 100))}%` }} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card B: Visibility */}
            <div className="flex-1 p-6 rounded-3xl flex flex-col justify-between text-left h-[130px] glass-sub-card">
              <div className="flex items-center justify-between">
                <span className="sub-card-title">Visibility</span>
                <Eye size={16} className="text-purple-400" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold font-heading sub-card-value">{metrics.visibility} km</div>
                <div className="mt-2 text-[10px] sub-card-caption flex items-center justify-between">
                  <span>Optical sight limit</span>
                  <div className="w-16 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full" style={{ width: `${(metrics.visibility / 12) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 0: // Overview (AQI + Cloud Cover)
      default:
        return (
          <>
            {/* Card A: Air Quality (dynamic rainbow spectrum slider matching Reference) */}
            <div className="flex-1 p-6 rounded-3xl flex flex-col justify-between text-left h-[130px] glass-sub-card">
              <div className="flex items-center justify-between">
                <span className="sub-card-title">Air Quality Index</span>
                <Activity size={16} className="text-emerald-400" />
              </div>
              
              <div className="mt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-heading sub-card-value">{metrics.aqi}</span>
                  <span className="text-[10px] font-medium sub-card-caption">{metrics.aqiStatus}</span>
                </div>
                
                {/* Horizontal color spectrum slider bar (just like Image 1) */}
                <div className="mt-3 relative h-1.5 w-full rounded-full" style={{ background: 'linear-gradient(90deg, #10b981 0%, #facc15 35%, #f97316 65%, #ef4444 100%)' }}>
                  <div 
                    className="absolute -top-1 w-3.5 h-3.5 bg-white border border-slate-900 rounded-full shadow-lg transition-all duration-1000"
                    style={{ left: `calc(${getAqiProgressPercent(metrics.aqi)}% - 7px)` }}
                  />
                </div>
              </div>
            </div>

            {/* Card B: Cloud Cover */}
            <div className="flex-1 p-6 rounded-3xl flex flex-col justify-between text-left h-[130px] glass-sub-card">
              <div className="flex items-center justify-between">
                <span className="sub-card-title">Cloud Cover</span>
                <Cloud size={16} className="text-sky-300" />
              </div>
              
              <div className="mt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-heading sub-card-value">{metrics.cloud}%</span>
                  <span className="text-[10px] font-medium sub-card-caption">{metrics.cloudStatus}</span>
                </div>
                
                {/* Slider progress bar */}
                <div className="mt-3 relative h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-400 rounded-full transition-all duration-1000" 
                    style={{ width: `${metrics.cloud}%` }} 
                  />
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  const getAqiProgressPercent = (val) => {
    return Math.min(96, (val / 150) * 100);
  };

  return (
    <>
      <style>{STYLES_CSS}</style>
      <div 
        className="w-full grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[36px] unified-dashboard-card relative text-left"
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
        }}
      >
        {/* =========================================================================
             LEFT PANEL: Minimal Atmospheric View (col-span-8)
           ========================================================================= */}
        <div 
          className="col-span-1 lg:col-span-8 p-4 sm:p-8 relative flex flex-col justify-between overflow-hidden min-h-[560px] sm:min-h-[640px] w-full max-w-full"
          style={{ transition: 'all 0.5s ease' }}
        >
          {/* Dynamic Background Gradients */}
          <div className="absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none" style={{ background: theme.gradient }} />
          <div className="absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none" style={{ background: theme.ambientGlow }} />

          {/* Particle Systems overlays */}
          {/* NIGHT STARS */}
          {timePeriod === 'night' && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {stars.map((star, i) => (
                <div
                  key={`star-${i}`}
                  className="absolute rounded-full bg-white animate-pulse"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    animationDelay: `${star.delay}s`,
                    animationDuration: `${star.duration}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* RAIN */}
          {activeConditionCode === 'RAIN' && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {rainDrops.map((drop, i) => (
                <div
                  key={`rain-${i}`}
                  className="absolute rounded-sm"
                  style={{
                    left: `${drop.x}%`,
                    top: '-5%',
                    width: `${drop.width}px`,
                    height: `${drop.height}px`,
                    background: `rgba(255,255,255,${drop.opacity})`,
                    animation: `udRainFall ${drop.duration}s linear infinite`,
                    animationDelay: `${drop.delay}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* SNOW */}
          {activeConditionCode === 'SNOW' && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {snowFlakes.map((flake, i) => (
                <div
                  key={`snow-${i}`}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${flake.x}%`,
                    top: '-5%',
                    width: `${flake.size}px`,
                    height: `${flake.size}px`,
                    opacity: flake.opacity,
                    animation: `udSnowDrift ${flake.duration}s linear infinite`,
                    animationDelay: `${flake.delay}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* STORM */}
          {activeConditionCode === 'STORM' && (
            <>
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {rainDrops.slice(0, 12).map((drop, i) => (
                  <div
                    key={`storm-rain-${i}`}
                    className="absolute rounded-sm"
                    style={{
                      left: `${drop.x}%`,
                      top: '-5%',
                      width: `${drop.width * 1.2}px`,
                      height: `${drop.height * 1.3}px`,
                      background: `rgba(255,255,255,${drop.opacity})`,
                      animation: `udRainFall ${drop.duration * 0.65}s linear infinite`,
                      animationDelay: `${drop.delay}s`,
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 bg-white pointer-events-none" style={{ animation: 'udFlash 5s ease-in-out infinite' }} />
            </>
          )}

          {/* CLOUDY */}
          {activeConditionCode === 'CLOUDY' && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {clouds.map((cloud, i) => (
                <div
                  key={`cloud-${i}`}
                  className="absolute rounded-full bg-slate-300"
                  style={{
                    top: `${cloud.y}%`,
                    left: '-60px',
                    width: `${cloud.width}px`,
                    height: `${cloud.height}px`,
                    filter: `blur(${cloud.height * 0.5}px)`,
                    opacity: cloud.opacity,
                    animation: `udCloudDrift ${cloud.duration}s linear infinite`,
                    animationDelay: `${cloud.delay}s`,
                  }}
                />
              ))}
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/45 pointer-events-none" />

          {/* Content Frame */}
          <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
            
            {/* Top Row: Location & Date Info */}
            <div className="flex items-center justify-between left-panel-text-primary">
              <span className="text-[11px] font-light opacity-90 tracking-wide block">
                <MapPin className="inline-block mr-1 text-sky-400" size={11} />{destination.name}, {destination.country || 'Global'}
              </span>
              <span className="text-[11px] font-light opacity-80 tracking-wide font-mono">
                {displayDateStr}
              </span>
            </div>

            {/* Massive Sun/Moon Trajectory Curve Hero (40% space) */}
            <div className="relative w-full h-[180px] flex items-center justify-center select-none overflow-visible">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 220" fill="none">
                {/* 3x Larger Dashed Arc */}
                <path 
                  d="M 50 175 Q 250 30 450 175" 
                  stroke="rgba(255,255,255,0.22)" 
                  strokeDasharray="4,6" 
                  strokeWidth="1.5" 
                  fill="none" 
                />
                
                {/* Embedded Labels on Path */}
                <text x="60" y="195" fill="rgba(255,255,255,0.45)" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  🌅 Sunrise 5:48 AM
                </text>
                <text x="350" y="195" fill="rgba(255,255,255,0.45)" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  🌇 Sunset 6:51 PM
                </text>
              </svg>

              {/* Minimal Weather Illustration */}
              <div className="absolute top-[35px] flex items-center justify-center pointer-events-none scale-[1.05]">
                <WeatherIllustration condition={activeConditionCode} />
              </div>
              
              {/* Dynamic Sun/Moon Node */}
              <div 
                className="absolute w-7 h-7 rounded-full flex items-center justify-center pointer-events-none transition-all duration-500"
                style={{
                  left: `calc(50% - 250px + ${sunPosition.x}px - 14px)`,
                  top: `${sunPosition.y - 14}px`,
                  filter: isDay ? 'drop-shadow(0 0 10px #fbbf24)' : 'drop-shadow(0 0 10px #818cf8)'
                }}
              >
                <div className="absolute inset-0 w-full h-full rounded-full bg-white/20 animate-ping" style={{ animationDuration: '3s' }} />
                {isDay ? (
                  <Sun size={18} className="text-amber-400 animate-spin-slow" fill="#fbbf24" />
                ) : (
                  <Moon size={15} className="text-indigo-200" fill="#c7d2fe" />
                )}
              </div>
            </div>

            {/* Bottom Section of Hero: Temperature & Info */}
            <div className="flex items-end justify-between left-panel-text-primary select-none">
              {/* Temperature & Condition */}
              <div className="space-y-1">
                <div className="text-7xl font-thin tracking-tighter leading-none">
                  {activeDay.temp.includes('/') ? activeDay.temp.split('/')[0].trim() : activeDay.temp}
                </div>
                <div className="text-sm font-light opacity-90 tracking-wide mt-1">
                  {activeDay.condition}
                </div>
              </div>

              {/* Time display at the bottom center of curve */}
              <div className="text-right font-mono text-sm opacity-80">
                {currentTime}
              </div>
            </div>

            {/* Active Two Metrics side-by-side on tablet/desktop, stacked on narrow mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-full">
              {renderTwoMetrics()}
            </div>

            {/* Bottom Tab Control Bar (Frosted glass navigation, dark/light styles) */}
            <div className="flex items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-1.5 flex-1 py-2 px-3 rounded-full bg-white/90 dark:bg-slate-900/90 border border-white/20 dark:border-slate-800/60 shadow-lg">
                {[
                  { label: 'Overview', icon: LayoutGrid },
                  { label: 'Moisture', icon: Droplets },
                  { label: 'Wind', icon: Wind },
                  { label: 'Comfort', icon: Heart }
                ].map((tab, idx) => {
                  const TabIcon = tab.icon;
                  const isActive = activeTab === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(idx)}
                      className={`flex-1 py-2.5 rounded-full flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
                        isActive 
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <TabIcon size={12} />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Elevated circular Sparkles button */}
              <button
                onClick={() => setShowAiSentinel(!showAiSentinel)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer flex-shrink-0 ${
                  showAiSentinel 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rotate-90 scale-95 border border-transparent'
                    : 'bg-white text-slate-900 hover:scale-105 border border-slate-200/50 dark:border-slate-750/30'
                }`}
                title="AI Travel Assistant"
              >
                {showAiSentinel ? <X size={16} /> : <Sparkles size={16} />}
              </button>
            </div>

          </div>

          {/* =========================================================================
               AI ASSISTANT FULL-PANEL MODAL (z-30 stacks on top of Content Frame)
             ========================================================================= */}
          <div 
            className={`absolute inset-0 z-30 p-8 flex flex-col justify-between transition-all duration-500 ease-out ${
              showAiSentinel 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-full opacity-0 pointer-events-none'
            } bg-white/80 dark:bg-slate-900/85 border border-white/45 dark:border-slate-800/60 shadow-2xl shadow-slate-950/10`}
            style={{ 
              backdropFilter: 'blur(30px)', 
              WebkitBackdropFilter: 'blur(30px)',
              borderRadius: 'inherit'
            }}
          >
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/20 dark:border-slate-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/15">
                    <Sparkles size={16} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white leading-none">
                      AI Climate Sentinel
                    </h4>
                    <span className="text-[9px] text-slate-600 dark:text-slate-400 block font-mono mt-1 select-none font-semibold">
                      {destination.name} • {activeDay.day} Outlook
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAiSentinel(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:border dark:border-white/10 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto py-6 space-y-6 no-scrollbar">
                
                {/* Travel Score & Exploration Window Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Travel Score Card */}
                  <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-800/30 border border-white/60 dark:border-slate-800/50 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full flex items-center justify-center bg-slate-100/30 dark:bg-white/5 border border-slate-250/10 dark:border-white/10 shadow-inner shrink-0">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-200 dark:text-white/5"
                          strokeWidth="2.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-amber-500"
                          strokeWidth="2.5"
                          strokeDasharray={`${travelScoreObj.score * 10}, 100`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="text-sm font-bold font-mono text-slate-800 dark:text-amber-400">
                        {travelScoreObj.score}
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 block">
                        Travel Score
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white block mt-0.5">
                        {travelScoreObj.text}
                      </span>
                      <span className="text-[9px] text-slate-600 dark:text-slate-400 font-medium block mt-0.5 leading-relaxed">
                        Comfort suitability index
                      </span>
                    </div>
                  </div>

                  {/* Exploration Window Card */}
                  <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-800/30 border border-white/60 dark:border-slate-800/50 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                      <Clock size={18} />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 block">
                        Best Explore Window
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white block mt-0.5">
                        {bestTimeText}
                      </span>
                      <span className="text-[9px] text-slate-600 dark:text-slate-400 font-medium block mt-0.5 leading-relaxed">
                        Hourly exploration peak
                      </span>
                    </div>
                  </div>

                </div>

                {/* Narrative Summary */}
                <div className="p-5 rounded-2xl bg-white/30 dark:bg-slate-800/20 border border-white/40 dark:border-slate-800/40 text-left">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 block mb-2">
                    Meteorological Advisory
                  </span>
                  <p className="text-[11.5px] leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
                    {activeConditionCode === 'STORM' ? (
                      <span>Unstable barometric system detected ({metrics.pressure} hPa) with lightning stroke potential. Ideal photometrics are zero. Keep battery packs insulated and secure local lodgings before 4:00 PM.</span>
                    ) : activeConditionCode === 'RAIN' ? (
                      <span>Microclimate moisture release probability stands at {metrics.precipitation}%. Light precipitation waves expected after 4:00 PM. Indoor architectural explorations are optimal.</span>
                    ) : activeConditionCode === 'SNOW' ? (
                      <span>Thermal scales dropping to freezing. Ground conditions are slippery. Perfect afternoon to visit covered local markets and enjoy hot local delicacies.</span>
                    ) : (
                      <span>High sun angle provides spectacular daylight clarity. Winds are extremely calm ({metrics.wind} km/h), making this the perfect timeline for aerial shots or drone loops over {destination.name}.</span>
                    )}
                  </p>
                </div>

                {/* Suggestions Grid */}
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 block mb-3 text-left">
                    Specific Suggestions
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {intelligentPackingList.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="p-3 rounded-xl bg-white/20 dark:bg-slate-800/15 border border-white/30 dark:border-slate-800/30 flex items-start gap-2.5 hover:bg-white/40 dark:hover:bg-slate-800/20 transition-colors duration-200"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold">✓</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 leading-relaxed text-left">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Footer button */}
            <div className="pt-4 border-t border-slate-200/20 dark:border-slate-800/40">
              <button
                onClick={() => setShowAiSentinel(false)}
                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold uppercase tracking-wider text-center transition-all duration-300 shadow-lg cursor-pointer"
              >
                Return to Climate Dashboard
              </button>
            </div>
          </div>

        </div>

        {/* =========================================================================
             RIGHT PANEL: Minimal vertical Forecast Rail (col-span-4)
           ========================================================================= */}
          <div className="col-span-1 lg:col-span-4 p-8 flex flex-col justify-between bg-slate-500/[0.01] border-t lg:border-t-0 lg:border-l border-[var(--border)] overflow-hidden min-h-[500px]">
          
          <div className="pb-4 mb-4 border-b border-[var(--border)]">
            <h4 className="text-[10px] font-heading uppercase tracking-widest font-bold forecast-title">
              Forecast outlook
            </h4>
          </div>

          {/* Simple scrollable vertical rail */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 max-h-[360px] lg:max-h-[420px]">
            {dailyForecast.map((day, idx) => {
              const isActive = activeDayIdx === idx;
              
              const dayLower = day.condition.toLowerCase();
              let RowIcon = Sun;
              let rowColor = 'text-amber-500';
              if (dayLower.includes('rain') || dayLower.includes('drizzle')) {
                RowIcon = CloudRain;
                rowColor = 'text-sky-400';
              } else if (dayLower.includes('snow') || dayLower.includes('ice')) {
                RowIcon = CloudSnow;
                rowColor = 'text-cyan-300';
              } else if (dayLower.includes('storm')) {
                RowIcon = CloudLightning;
                rowColor = 'text-yellow-400';
              } else if (dayLower.includes('cloud') || dayLower.includes('fog') || dayLower.includes('mist') || dayLower.includes('overcast') || dayLower.includes('grey')) {
                RowIcon = Cloud;
                rowColor = 'text-slate-400';
              }

              const shortDayName = day.day.substring(0, 3).toUpperCase();
              const displayTemp = day.temp.includes('/') ? day.temp.split('/')[0].trim() : day.temp;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveDayIdx(idx)}
                  className={`w-full py-3.5 px-5 rounded-2xl flex items-center justify-between text-left forecast-row-btn ${
                    isActive ? 'active' : ''
                  }`}
                >
                  <span className="text-sm font-bold tracking-wider font-mono w-12">{shortDayName}</span>
                  <RowIcon size={18} className={`${rowColor} shrink-0`} />
                  <span className="text-sm font-semibold font-mono text-right w-12">{displayTemp}</span>
                </button>
              );
            })}
          </div>

          {/* Simple info strip at the bottom of forecast */}
          <div className="mt-4 pt-3 border-t border-[var(--border)] text-left">
            <span className="text-[8.5px] uppercase tracking-wider font-bold block mb-1 forecast-rec-title">Explore Window</span>
            <p className="text-[10px] leading-relaxed font-light forecast-rec-body">
              Outdoor exploration conditions are {activeConditionCode === 'STORM' || activeConditionCode === 'RAIN' ? 'poor' : 'optimal'} for {activeDay.day}. {activeDay.suggestions}
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default UnifiedWeatherDashboard;
