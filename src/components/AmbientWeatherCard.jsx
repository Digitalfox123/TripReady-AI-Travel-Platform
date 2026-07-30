import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, Sunrise, Sunset } from 'lucide-react';

// ── CSS Keyframes (injected via <style> tag) ───────────────────────────────────
const KEYFRAMES_CSS = `
  @keyframes awcFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(14px, -20px) scale(1.06); }
    50% { transform: translate(-10px, 10px) scale(0.94); }
    75% { transform: translate(18px, 14px) scale(1.03); }
  }
  @keyframes awcTwinkle {
    0%, 100% { opacity: 0.08; transform: scale(0.7); }
    50% { opacity: 1; transform: scale(1.3); }
  }
  @keyframes awcRainFall {
    0% { transform: translateY(-12px) translateX(0); opacity: 0; }
    4% { opacity: 1; }
    92% { opacity: 0.7; }
    100% { transform: translateY(500px) translateX(18px); opacity: 0; }
  }
  @keyframes awcSnowDrift {
    0% { transform: translateY(-12px) translateX(0); opacity: 0; }
    4% { opacity: 1; }
    50% { transform: translateY(230px) translateX(22px); }
    100% { transform: translateY(500px) translateX(-12px); opacity: 0; }
  }
  @keyframes awcFlash {
    0%, 84%, 100% { opacity: 0; }
    86% { opacity: 0.85; }
    88% { opacity: 0.05; }
    90% { opacity: 0.55; }
    92% { opacity: 0; }
  }
  @keyframes awcCloudDrift {
    0% { transform: translateX(-200px); opacity: 0; }
    8% { opacity: 1; }
    92% { opacity: 1; }
    100% { transform: translateX(420px); opacity: 0; }
  }
  @keyframes awcPulseRing {
    0% { transform: scale(0.3); opacity: 0.5; border-width: 2px; }
    100% { transform: scale(3); opacity: 0; border-width: 0.3px; }
  }
  @keyframes awcDawnSweep {
    0% { transform: translateX(-120%) skewX(-15deg); opacity: 0; }
    25% { opacity: 0.28; }
    100% { transform: translateX(240%) skewX(-15deg); opacity: 0; }
  }
  @keyframes awcSheen {
    0% { transform: translateX(-150%) rotate(-25deg); }
    100% { transform: translateX(400%) rotate(-25deg); }
  }
  @keyframes awcLensFlare {
    0% { left: -30%; opacity: 0; }
    18% { opacity: 0.65; }
    82% { opacity: 0.4; }
    100% { left: 135%; opacity: 0; }
  }
  @keyframes awcAurora {
    0%, 100% { opacity: 0.1; background-position: 0% 50%; }
    50% { opacity: 0.38; background-position: 100% 50%; }
  }
  @keyframes awcMoonPulse {
    0%, 100% { transform: scale(1); opacity: 0.45; box-shadow: 0 0 40px 16px rgba(180,200,255,0.12); }
    50% { transform: scale(1.14); opacity: 0.78; box-shadow: 0 0 65px 28px rgba(180,200,255,0.22); }
  }
  @keyframes awcRaysSpin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
  @keyframes awcGradientPan {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes awcSunRise {
    0% { transform: translateY(30px); opacity: 0.3; }
    100% { transform: translateY(0px); opacity: 1; }
  }
  @keyframes awcSunDescend {
    0% { transform: translateY(-10px); opacity: 1; }
    100% { transform: translateY(20px); opacity: 0.5; }
  }
`;

// ── Theme Configuration Per Time Period ────────────────────────────────────────
const THEMES = {
  dawn: {
    gradient: 'linear-gradient(135deg, #1a1040 0%, #3d1b4e 22%, #7a2e5a 45%, #c06080 72%, #e8a0a0 100%)',
    orbColors: ['rgba(255,182,193,0.22)', 'rgba(255,215,0,0.16)', 'rgba(255,160,180,0.18)', 'rgba(255,200,150,0.14)', 'rgba(230,150,200,0.12)', 'rgba(255,180,120,0.1)'],
    orbCount: 6,
    orbSizeRange: [28, 62],
    orbSpeedRange: [22, 34],
    ambientGlow: 'radial-gradient(ellipse at 18% 82%, rgba(255,150,100,0.14) 0%, transparent 58%)',
  },
  morning: {
    gradient: 'linear-gradient(135deg, #b86e18 0%, #d8a020 22%, #78b0d8 58%, #4888c0 100%)',
    orbColors: ['rgba(255,215,0,0.26)', 'rgba(255,200,50,0.2)', 'rgba(255,230,100,0.16)', 'rgba(255,180,40,0.14)', 'rgba(255,210,80,0.18)', 'rgba(255,240,130,0.1)', 'rgba(250,190,50,0.12)', 'rgba(255,220,70,0.15)'],
    orbCount: 8,
    orbSizeRange: [16, 46],
    orbSpeedRange: [11, 19],
    ambientGlow: 'radial-gradient(ellipse at 88% 12%, rgba(255,200,50,0.22) 0%, transparent 52%)',
  },
  afternoon: {
    gradient: 'linear-gradient(135deg, #084e8a 0%, #1575b8 28%, #22a0d8 60%, #38c8f0 100%)',
    orbColors: ['rgba(255,255,255,0.16)', 'rgba(120,190,255,0.14)', 'rgba(200,230,255,0.1)', 'rgba(180,220,255,0.12)', 'rgba(140,200,255,0.1)', 'rgba(220,240,255,0.08)'],
    orbCount: 6,
    orbSizeRange: [20, 40],
    orbSpeedRange: [14, 23],
    ambientGlow: 'radial-gradient(ellipse at 50% 2%, rgba(255,255,255,0.16) 0%, transparent 48%)',
  },
  goldenHour: {
    gradient: 'linear-gradient(135deg, #b83200 0%, #a01848 32%, #681880 62%, #381060 100%)',
    orbColors: ['rgba(255,165,0,0.2)', 'rgba(255,100,130,0.16)', 'rgba(200,80,60,0.13)', 'rgba(255,200,80,0.18)', 'rgba(230,120,100,0.12)'],
    orbCount: 5,
    orbSizeRange: [38, 78],
    orbSpeedRange: [26, 40],
    ambientGlow: 'radial-gradient(ellipse at 28% 72%, rgba(255,120,50,0.16) 0%, transparent 52%)',
  },
  night: {
    gradient: 'linear-gradient(135deg, #08081a 0%, #0c1030 28%, #101840 62%, #0a1228 100%)',
    orbColors: ['rgba(100,150,255,0.1)', 'rgba(80,120,200,0.07)', 'rgba(120,140,220,0.06)'],
    orbCount: 3,
    orbSizeRange: [38, 72],
    orbSpeedRange: [30, 48],
    ambientGlow: 'radial-gradient(ellipse at 50% 55%, rgba(70,100,180,0.07) 0%, transparent 52%)',
  },
};

const CONDITIONS = ['CLEAR', 'RAIN', 'SNOW', 'STORM', 'CLOUDY'];
const CONDITION_LABELS = {
  CLEAR: 'CLEAR SKIES',
  RAIN: 'RAINY',
  SNOW: 'SNOWFALL',
  STORM: 'THUNDERSTORM',
  CLOUDY: 'OVERCAST',
};

// ── Animated Weather Characters ──────────────────────────────────────────────
const ArabicManCharacter = () => (
  <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      @keyframes headBob {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(2px) rotate(1.5deg); }
      }
      @keyframes armSway {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(-3.5deg); }
      }
      @keyframes sweat {
        0% { transform: translateY(0); opacity: 0; }
        30% { opacity: 0.85; }
        80% { transform: translateY(22px); opacity: 0; }
        100% { transform: translateY(22px); opacity: 0; }
      }
      @keyframes heatLine {
        0% { transform: translateY(8px) scaleX(0.85); opacity: 0; }
        50% { opacity: 0.3; }
        100% { transform: translateY(-24px) scaleX(1.15); opacity: 0; }
      }
      .char-head { animation: headBob 3.8s ease-in-out infinite; transform-origin: 100px 95px; }
      .char-arm { animation: armSway 4.8s ease-in-out infinite; transform-origin: 75px 120px; }
      .char-sweat { animation: sweat 2.8s linear infinite; }
      .char-heat-1 { animation: heatLine 2.2s ease-in-out infinite; }
      .char-heat-2 { animation: heatLine 2.2s ease-in-out infinite; animation-delay: 1.1s; }
    `}</style>

    {/* Heat waves */}
    <path className="char-heat-1" d="M35 150 Q45 130 35 110" stroke="rgba(251,191,36,0.25)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path className="char-heat-2" d="M165 140 Q175 120 165 100" stroke="rgba(251,191,36,0.25)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path className="char-heat-1" d="M150 160 Q158 145 150 130" stroke="rgba(251,191,36,0.2)" strokeWidth="1.2" strokeLinecap="round" fill="none" />

    {/* Body / Thobe */}
    <path d="M65 130 C65 115 75 108 100 108 C125 108 135 115 135 130 L145 190 H55 L65 130 Z" fill="#F8FAFC" />
    <path d="M100 108 V135" stroke="#E2E8F0" strokeWidth="1.5" />
    
    {/* Head Group */}
    <g className="char-head">
      {/* Ghutrah Back (white headscarf draping down) */}
      <path d="M52 90 C50 120 60 165 72 175 L85 170 C72 145 68 115 70 90 Z" fill="#F1F5F9" />
      <path d="M148 90 C150 120 140 165 128 175 L115 170 C128 145 132 115 130 90 Z" fill="#F1F5F9" />
      
      {/* Face */}
      <circle cx="100" cy="95" r="32" fill="#FED7AA" />
      
      {/* Friendly Beard & Mustache */}
      <path d="M68 95 C68 122 82 132 100 132 C118 132 132 122 132 95 C132 95 126 100 100 100 C74 100 68 95 68 95 Z" fill="#1E293B" />
      <path d="M88 106 C92 103 98 103 100 106 C102 103 108 103 112 106" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Sunglasses (hot weather essential!) */}
      <rect x="76" y="86" width="20" height="12" rx="4" fill="#0F172A" />
      <rect x="104" y="86" width="20" height="12" rx="4" fill="#0F172A" />
      <line x1="96" y1="92" x2="104" y2="92" stroke="#0F172A" strokeWidth="2.5" />
      {/* Sunglasses reflection */}
      <line x1="80" y1="89" x2="88" y2="89" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <line x1="108" y1="89" x2="116" y2="89" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

      {/* Mouth */}
      <path d="M94 116 C94 120 106 120 106 116" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

      {/* Ghutrah Top & Igal (Black rings) */}
      <path d="M66 85 C66 60 134 60 134 85 Z" fill="#FFFFFF" />
      {/* Igal rings */}
      <path d="M72 73 C85 67 115 67 128 73" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M74 78 C86 73 114 73 126 78" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Sweat drop animation */}
      <path className="char-sweat" d="M73 98 C73 98 71 101 73 104 C74.5 104 75 102 75 100 Z" fill="#38BDF8" />
    </g>

    {/* Left Arm holding cold drink */}
    <g className="char-arm">
      <path d="M65 130 C45 135 48 160 62 162" stroke="#F8FAFC" strokeWidth="12" strokeLinecap="round" fill="none" />
      {/* Hand */}
      <circle cx="62" cy="162" r="6" fill="#FED7AA" />
      {/* Cup with straw */}
      <rect x="52" y="145" width="20" height="28" rx="2" fill="#38BDF8" opacity="0.75" />
      {/* Straw */}
      <line x1="62" y1="135" x2="62" y2="152" stroke="#EF4444" strokeWidth="2" />
      {/* Ice cubes */}
      <rect x="56" y="155" width="5" height="5" fill="#FFFFFF" opacity="0.8" />
      <rect x="64" y="162" width="5" height="5" fill="#FFFFFF" opacity="0.8" />
    </g>
  </svg>
);

const FootballBoyCharacter = () => (
  <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      @keyframes runPose {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-4px) rotate(2deg); }
      }
      @keyframes ball {
        0%, 100% { transform: translate(128px, 148px) rotate(0deg); }
        50% { transform: translate(142px, 92px) rotate(180deg); }
      }
      @keyframes legKick {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(-15deg); }
      }
      .boy-body { animation: runPose 0.75s ease-in-out infinite; transform-origin: 90px 100px; }
      .boy-leg-right { animation: legKick 0.75s ease-in-out infinite; transform-origin: 95px 125px; }
      .soccer-ball { animation: ball 1.5s ease-in-out infinite; transform-origin: center; }
    `}</style>

    {/* Grass Floor */}
    <path d="M20 165 C60 160 140 160 180 165 C190 166.5 190 175 180 175 C140 178 60 178 20 175 C10 175 10 166.5 20 165 Z" fill="rgba(34,197,94,0.35)" />
    
    {/* Boy character */}
    <g className="boy-body">
      {/* Head */}
      <circle cx="90" cy="70" r="18" fill="#FED7AA" />
      {/* Curly Hair */}
      <path d="M78 62 C74 58 84 48 94 52 C104 48 108 58 102 64 C98 68 82 68 78 62 Z" fill="#78350F" />
      {/* Cap */}
      <path d="M78 64 C76 56 86 52 98 56 L108 58" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
      {/* Face details */}
      <circle cx="95" cy="70" r="2" fill="#1E293B" />
      <path d="M94 76 C94 76 96 78 98 76" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Torso / T-Shirt */}
      <path d="M74 88 C74 88 78 84 90 84 C102 84 106 88 106 108 H74 V88 Z" fill="#3B82F6" />
      {/* Collar */}
      <path d="M84 84 C84 86 96 86 96 84" stroke="#FFFFFF" strokeWidth="2" fill="none" />
      
      {/* Left arm */}
      <path d="M74 90 C62 95 58 108 66 112" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" fill="none" />
      
      {/* Left leg */}
      <path d="M82 108 V132 L74 145" stroke="#FED7AA" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Left Shoe */}
      <path d="M74 145 L66 148 C64 149 64 144 68 142 Z" fill="#EF4444" />

      {/* Right leg */}
      <g className="boy-leg-right">
        <path d="M98 108 V125 L112 138" stroke="#FED7AA" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Right Shoe */}
        <path d="M112 138 L122 141 C124 142 124 137 120 135 Z" fill="#EF4444" />
      </g>
    </g>

    {/* Soccer Ball */}
    <g className="soccer-ball">
      <circle cx="0" cy="0" r="12" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
      <path d="M0 -5 L4 -2 L2 3 H-2 L-4 -2 Z" fill="#1E293B" />
      <line x1="0" y1="-5" x2="0" y2="-12" stroke="#1E293B" strokeWidth="1.5" />
      <line x1="4" y1="-2" x2="10" y2="-5" stroke="#1E293B" strokeWidth="1.5" />
      <line x1="2" y1="3" x2="8" y2="8" stroke="#1E293B" strokeWidth="1.5" />
      <line x1="-2" y1="3" x2="-8" y2="8" stroke="#1E293B" strokeWidth="1.5" />
      <line x1="-4" y1="-2" x2="-10" y2="-5" stroke="#1E293B" strokeWidth="1.5" />
    </g>
  </svg>
);

const SleepingBabyCharacter = () => (
  <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      @keyframes breathe {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(1.04); }
      }
      @keyframes zzz1 {
        0% { transform: translate(125px, 85px) scale(0.6); opacity: 0; }
        30% { opacity: 0.85; }
        80% { transform: translate(140px, 45px) scale(1); opacity: 0; }
        100% { transform: translate(140px, 45px) scale(1); opacity: 0; }
      }
      @keyframes zzz2 {
        0% { transform: translate(135px, 80px) scale(0.5); opacity: 0; }
        30% { opacity: 0.85; }
        80% { transform: translate(155px, 35px) scale(0.9); opacity: 0; }
        100% { transform: translate(155px, 35px) scale(0.9); opacity: 0; }
      }
      .baby-chest { animation: breathe 3.6s ease-in-out infinite; transform-origin: 100px 140px; }
      .zzz-letter-1 { animation: zzz1 3.8s ease-in-out infinite; }
      .zzz-letter-2 { animation: zzz2 3.8s ease-in-out infinite; animation-delay: 1.9s; }
    `}</style>

    {/* Bed Frame */}
    <rect x="35" y="120" width="130" height="42" rx="6" fill="#78350F" />
    <rect x="30" y="90" width="10" height="75" rx="3" fill="#5B21B6" opacity="0.3" />
    <rect x="30" y="90" width="10" height="75" rx="3" fill="#78350F" />
    <rect x="160" y="110" width="10" height="55" rx="3" fill="#78350F" />

    {/* Pillow */}
    <rect x="42" y="105" width="45" height="25" rx="6" fill="#F8FAFC" />
    <path d="M42 115 C52 117 72 117 87 115" stroke="#E2E8F0" strokeWidth="1.5" />

    {/* Sleeping Baby Head */}
    <circle cx="82" cy="110" r="16" fill="#FED7AA" />
    <path d="M82 110 C84 112 88 112 90 110" stroke="#7C2D12" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <circle cx="88" cy="116" r="3" fill="#F43F5E" opacity="0.4" />
    <path d="M72 100 Q76 92 80 98" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />

    {/* Blanket */}
    <g className="baby-chest">
      <path d="M84 120 H160 V158 H60 L84 120 Z" fill="#06B6D4" />
      <path d="M96 120 L120 158" stroke="#22D3EE" strokeWidth="1" opacity="0.5" />
      <path d="M120 120 L144 158" stroke="#22D3EE" strokeWidth="1" opacity="0.5" />
      <path d="M144 120 L160 145" stroke="#22D3EE" strokeWidth="1" opacity="0.5" />
      <path d="M140 120 L110 158" stroke="#22D3EE" strokeWidth="1" opacity="0.5" />
      <path d="M115 120 L85 158" stroke="#22D3EE" strokeWidth="1" opacity="0.5" />
      <path d="M60 125 C74 125 78 120 84 120 C90 120 100 125 110 125" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
    </g>

    {/* Zzzs */}
    <text className="zzz-letter-1" fill="#A78BFA" fontSize="16" fontWeight="bold" fontFamily="monospace">Z</text>
    <text className="zzz-letter-2" fill="#C084FC" fontSize="11" fontWeight="bold" fontFamily="monospace">z</text>
  </svg>
);

const WeatherCharacter = ({ type }) => {
  switch (type) {
    case 'sleepingBaby':
      return <SleepingBabyCharacter />;
    case 'footballBoy':
      return <FootballBoyCharacter />;
    case 'arabicMan':
    default:
      return <ArabicManCharacter />;
  }
};

// ── Helper: Parse UTC offset from timezone string like 'EST (UTC-5)' or 'JST (UTC+9)' ──
function parseUtcOffset(tzString) {
  if (!tzString) return 0;
  const match = tzString.match(/UTC([+-]?)(\d+\.?\d*)/i);
  if (!match) return 0;
  const sign = match[1] === '-' ? -1 : 1;
  return sign * parseFloat(match[2]);
}

// ── Helper: Get a Date object adjusted to a specific UTC offset ──
function getDestinationDate(utcOffsetHours) {
  const now = new Date();
  // Get current UTC time in ms, then add the destination offset
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + utcOffsetHours * 3600000);
}

// ── Component ──────────────────────────────────────────────────────────────────
const AmbientWeatherCard = ({
  location = 'Andes Trail Climate',
  temperature = 17,
  feelsLike = 17,
  condition = 'CLEAR',
  sunriseTime = '06:12 AM',
  sunsetTime = '06:48 PM',
  unit = 'C',
  timezone = '',
}) => {
  const [conditionIdx, setConditionIdx] = useState(() => {
    const idx = CONDITIONS.indexOf(condition.toUpperCase());
    return idx >= 0 ? idx : 0;
  });
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentHour, setCurrentHour] = useState(() => {
    const offset = parseUtcOffset(timezone);
    return getDestinationDate(offset).getHours();
  });
  const [tzLabel, setTzLabel] = useState(() => {
    // Extract short label like 'EST' from 'EST (UTC-5)'
    const match = timezone.match(/^([A-Z]{2,5})/i);
    return match ? match[1].toUpperCase() : '';
  });

  // Parse the UTC offset from the timezone prop
  const utcOffset = useMemo(() => parseUtcOffset(timezone), [timezone]);

  // Tick the clock every second — using destination's local time
  useEffect(() => {
    const tick = () => {
      const destNow = getDestinationDate(utcOffset);
      setCurrentHour(destNow.getHours());
      const h = destNow.getHours() % 12 || 12;
      const m = destNow.getMinutes().toString().padStart(2, '0');
      const s = destNow.getSeconds().toString().padStart(2, '0');
      const ampm = destNow.getHours() >= 12 ? 'PM' : 'AM';
      setCurrentTime(`${h}:${m}:${s} ${ampm}`);
    };
    // Update tz label when timezone prop changes
    const match = timezone.match(/^([A-Z]{2,5})/i);
    setTzLabel(match ? match[1].toUpperCase() : '');
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [utcOffset, timezone]);

  // Determine time period from DESTINATION hour
  const timePeriod = useMemo(() => {
    if (currentHour >= 5 && currentHour < 7) return 'dawn';
    if (currentHour >= 7 && currentHour < 12) return 'morning';
    if (currentHour >= 12 && currentHour < 17) return 'afternoon';
    if (currentHour >= 17 && currentHour < 20) return 'goldenHour';
    return 'night';
  }, [currentHour]);

  const theme = THEMES[timePeriod];
  const activeCondition = CONDITIONS[conditionIdx];
  const isDay = currentHour >= 6 && currentHour < 19;

  const characterType = useMemo(() => {
    if (timePeriod === 'night') {
      return 'sleepingBaby';
    }
    if (timePeriod === 'afternoon') {
      return 'footballBoy';
    }
    // Default to Arabic man for hot weather, morning, or golden hour
    if (temperature >= 25 || activeCondition === 'CLEAR') {
      return 'arabicMan';
    }
    return 'footballBoy';
  }, [timePeriod, temperature, activeCondition]);

  const cycleCondition = useCallback(() => {
    setConditionIdx((prev) => (prev + 1) % CONDITIONS.length);
  }, []);

  // ── Memoized Random Data ──────────────────────────────────────────────────
  const orbs = useMemo(() => {
    return Array.from({ length: theme.orbCount }, (_, i) => ({
      x: 8 + Math.random() * 78,
      y: 4 + Math.random() * 72,
      size: theme.orbSizeRange[0] + Math.random() * (theme.orbSizeRange[1] - theme.orbSizeRange[0]),
      color: theme.orbColors[i % theme.orbColors.length],
      duration: theme.orbSpeedRange[0] + Math.random() * (theme.orbSpeedRange[1] - theme.orbSpeedRange[0]),
      delay: -(Math.random() * 22),
    }));
  }, [timePeriod]); // eslint-disable-line react-hooks/exhaustive-deps

  const stars = useMemo(() => {
    return Array.from({ length: 55 }, () => ({
      x: Math.random() * 96 + 2,
      y: Math.random() * 58 + 2,
      size: Math.random() * 1.6 + 0.4,
      delay: Math.random() * 7,
      duration: Math.random() * 3.5 + 1.8,
    }));
  }, []);

  const rainDrops = useMemo(() => {
    return Array.from({ length: 30 }, () => ({
      x: Math.random() * 115 - 8,
      delay: Math.random() * 2.8,
      duration: Math.random() * 0.45 + 0.45,
      width: Math.random() * 0.5 + 0.4,
      height: Math.random() * 24 + 12,
      opacity: Math.random() * 0.28 + 0.1,
    }));
  }, []);

  const snowFlakes = useMemo(() => {
    return Array.from({ length: 38 }, () => ({
      x: Math.random() * 100,
      delay: Math.random() * 12,
      duration: Math.random() * 5 + 6,
      size: Math.random() * 3.5 + 1,
      opacity: Math.random() * 0.45 + 0.25,
    }));
  }, []);

  const clouds = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      y: 10 + i * 24 + Math.random() * 14,
      delay: i * 8 + Math.random() * 5,
      duration: 22 + Math.random() * 14,
      width: 85 + Math.random() * 65,
      height: 26 + Math.random() * 20,
      opacity: Math.random() * 0.13 + 0.05,
    }));
  }, []);

  // ── Condition Icon ────────────────────────────────────────────────────────
  const ConditionIcon = useMemo(() => {
    switch (activeCondition) {
      case 'RAIN': return CloudRain;
      case 'SNOW': return CloudSnow;
      case 'STORM': return CloudLightning;
      case 'CLOUDY': return Cloud;
      default: return isDay ? Sun : Moon;
    }
  }, [activeCondition, isDay]);

  const iconColor = useMemo(() => {
    switch (activeCondition) {
      case 'RAIN': return '#60a5fa';
      case 'SNOW': return '#a5f3fc';
      case 'STORM': return '#c084fc';
      case 'CLOUDY': return '#94a3b8';
      default: return isDay ? '#fbbf24' : '#c4b5fd';
    }
  }, [activeCondition, isDay]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{KEYFRAMES_CSS}</style>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: '360px',
          height: '520px',
          borderRadius: '28px',
          overflow: 'hidden',
          cursor: 'default',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          color: '#fff',
          userSelect: 'none',
          transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s ease',
          transform: isHovered ? 'scale(1.02) translateY(-5px)' : 'scale(1) translateY(0)',
          boxShadow: isHovered
            ? '0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1) inset'
            : '0 16px 44px rgba(0,0,0,0.38), 0 0 0 1px rgba(255,255,255,0.06) inset',
        }}
      >
        {/* ═══ BACKGROUND GRADIENT ═══ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: theme.gradient,
            transition: 'background 1.2s ease',
            ...(timePeriod === 'goldenHour'
              ? { backgroundSize: '200% 200%', animation: 'awcGradientPan 14s ease infinite' }
              : {}),
          }}
        />

        {/* ═══ AMBIENT GLOW OVERLAY ═══ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: theme.ambientGlow,
            transition: 'background 1.2s ease',
            pointerEvents: 'none',
          }}
        />

        {/* ═══ TIME-OF-DAY SPECIFIC EFFECTS ═══ */}

        {/* DAWN: horizontal light ray sweep */}
        {timePeriod === 'dawn' && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '55%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,200,150,0.14), rgba(255,180,130,0.06), transparent)',
                animation: 'awcDawnSweep 11s ease-in-out infinite',
              }}
            />
            {/* Rising sun ambient glow at bottom */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20%',
                left: '20%',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,180,100,0.2) 0%, transparent 65%)',
                animation: 'awcSunRise 6s ease-out forwards',
              }}
            />
          </div>
        )}

        {/* MORNING: pulsing golden halo rings */}
        {timePeriod === 'morning' && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={`halo-${i}`}
                style={{
                  position: 'absolute',
                  top: '12%',
                  right: '6%',
                  width: '55px',
                  height: '55px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255,200,50,0.3)',
                  animation: `awcPulseRing ${2.6 + i * 0.5}s ease-out infinite`,
                  animationDelay: `${i * 0.9}s`,
                }}
              />
            ))}
            {/* Warm golden top-right glow */}
            <div
              style={{
                position: 'absolute',
                top: '-22%',
                right: '-18%',
                width: '210px',
                height: '210px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,200,50,0.28) 0%, transparent 62%)',
              }}
            />
          </div>
        )}

        {/* AFTERNOON: rotating rays from top-center + diagonal sheen */}
        {timePeriod === 'afternoon' && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <div
              style={{
                position: 'absolute',
                top: '-32%',
                left: '50%',
                width: '420px',
                height: '420px',
                animation: 'awcRaysSpin 50s linear infinite',
                opacity: 0.1,
              }}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={`ray-${i}`}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '2.5px',
                    height: '210px',
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.85), transparent)',
                    transformOrigin: '50% 0%',
                    transform: `rotate(${i * 36}deg)`,
                  }}
                />
              ))}
            </div>
            {/* Directional diagonal sheen */}
            <div
              style={{
                position: 'absolute',
                top: '-55%',
                left: 0,
                width: '35px',
                height: '220%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)',
                animation: 'awcSheen 9s ease-in-out infinite',
                animationDelay: '2.5s',
              }}
            />
          </div>
        )}

        {/* GOLDEN HOUR: warm sweep + lens flare + descending sun */}
        {timePeriod === 'goldenHour' && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {/* Warm horizontal glow band */}
            <div
              style={{
                position: 'absolute',
                bottom: '22%',
                left: '-12%',
                width: '124%',
                height: '55px',
                background: 'linear-gradient(90deg, transparent, rgba(255,150,50,0.11), rgba(255,100,80,0.07), transparent)',
                filter: 'blur(22px)',
              }}
            />
            {/* Lens flare streak */}
            <div
              style={{
                position: 'absolute',
                top: '38%',
                width: '75px',
                height: '2.5px',
                background: 'linear-gradient(90deg, transparent, rgba(255,200,100,0.55), rgba(255,150,80,0.35), transparent)',
                animation: 'awcLensFlare 9s ease-in-out infinite',
                animationDelay: '1.5s',
                filter: 'blur(1px)',
              }}
            />
            {/* Descending sun warm glow */}
            <div
              style={{
                position: 'absolute',
                bottom: '8%',
                left: '30%',
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,160,60,0.16) 0%, transparent 60%)',
                animation: 'awcSunDescend 20s ease-in-out infinite',
              }}
            />
          </div>
        )}

        {/* NIGHT: stars + moon glow + aurora shimmer */}
        {timePeriod === 'night' && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {/* Star particles */}
            {stars.map((star, i) => (
              <div
                key={`star-${i}`}
                style={{
                  position: 'absolute',
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.88)',
                  animation: `awcTwinkle ${star.duration}s ease-in-out infinite`,
                  animationDelay: `${star.delay}s`,
                }}
              />
            ))}
            {/* Moon glow orb */}
            <div
              style={{
                position: 'absolute',
                top: '10%',
                right: '14%',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(200,210,255,0.45) 0%, rgba(150,170,255,0.08) 50%, transparent 68%)',
                animation: 'awcMoonPulse 7s ease-in-out infinite',
              }}
            />
            {/* Aurora shimmer band at top */}
            <div
              style={{
                position: 'absolute',
                top: '2%',
                left: 0,
                width: '100%',
                height: '32px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.13) 18%, rgba(52,211,153,0.1) 38%, rgba(34,211,238,0.06) 58%, rgba(167,139,250,0.08) 78%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'awcAurora 9s ease-in-out infinite',
                filter: 'blur(8px)',
              }}
            />
            {/* Cold blue-silver ambient */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 48% 58%, rgba(70,100,180,0.06) 0%, transparent 52%)',
              }}
            />
          </div>
        )}

        {/* ═══ FLOATING ORBS (all time periods) ═══ */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {orbs.map((orb, i) => (
            <div
              key={`orb-${timePeriod}-${i}`}
              style={{
                position: 'absolute',
                left: `${orb.x}%`,
                top: `${orb.y}%`,
                width: `${orb.size}px`,
                height: `${orb.size}px`,
                borderRadius: '50%',
                backgroundColor: orb.color,
                filter: `blur(${orb.size * 0.32}px)`,
                animation: `awcFloat ${orb.duration}s ease-in-out infinite`,
                animationDelay: `${orb.delay}s`,
              }}
            />
          ))}
        </div>

        {/* ═══ WEATHER CONDITION OVERLAYS ═══ */}

        {/* RAIN */}
        {activeCondition === 'RAIN' && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {rainDrops.map((drop, i) => (
              <div
                key={`rain-${i}`}
                style={{
                  position: 'absolute',
                  left: `${drop.x}%`,
                  top: '-4%',
                  width: `${drop.width}px`,
                  height: `${drop.height}px`,
                  background: `rgba(180,200,235,${drop.opacity})`,
                  borderRadius: '2px',
                  transform: 'rotate(12deg)',
                  animation: `awcRainFall ${drop.duration}s linear infinite`,
                  animationDelay: `${drop.delay}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* SNOW */}
        {activeCondition === 'SNOW' && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {snowFlakes.map((flake, i) => (
              <div
                key={`snow-${i}`}
                style={{
                  position: 'absolute',
                  left: `${flake.x}%`,
                  top: '-2%',
                  width: `${flake.size}px`,
                  height: `${flake.size}px`,
                  borderRadius: '50%',
                  backgroundColor: `rgba(255,255,255,${flake.opacity})`,
                  boxShadow: `0 0 ${flake.size * 2.2}px rgba(255,255,255,${flake.opacity * 0.45})`,
                  animation: `awcSnowDrift ${flake.duration}s linear infinite`,
                  animationDelay: `${flake.delay}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* STORM (heavy rain + lightning flash) */}
        {activeCondition === 'STORM' && (
          <>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              {rainDrops.slice(0, 22).map((drop, i) => (
                <div
                  key={`storm-rain-${i}`}
                  style={{
                    position: 'absolute',
                    left: `${drop.x}%`,
                    top: '-4%',
                    width: `${drop.width * 1.3}px`,
                    height: `${drop.height * 1.4}px`,
                    background: `rgba(160,180,215,${drop.opacity * 1.3})`,
                    borderRadius: '2px',
                    transform: 'rotate(16deg)',
                    animation: `awcRainFall ${drop.duration * 0.65}s linear infinite`,
                    animationDelay: `${drop.delay}s`,
                  }}
                />
              ))}
            </div>
            {/* Lightning flash overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(255,255,255,0.82)',
                pointerEvents: 'none',
                animation: 'awcFlash 7s ease-in-out infinite',
                animationDelay: '1.2s',
              }}
            />
          </>
        )}

        {/* CLOUDY */}
        {activeCondition === 'CLOUDY' && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {clouds.map((cloud, i) => (
              <div
                key={`cloud-${i}`}
                style={{
                  position: 'absolute',
                  top: `${cloud.y}%`,
                  left: '-55px',
                  width: `${cloud.width}px`,
                  height: `${cloud.height}px`,
                  borderRadius: '50%',
                  backgroundColor: `rgba(200,210,228,${cloud.opacity})`,
                  filter: `blur(${cloud.height * 0.55}px)`,
                  animation: `awcCloudDrift ${cloud.duration}s linear infinite`,
                  animationDelay: `${cloud.delay}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* ═══ GLASS VIGNETTE OVERLAY ═══ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.18) 35%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.78) 100%)',
            backdropFilter: 'blur(0.5px)',
            pointerEvents: 'none',
          }}
        />

        {/* ═══ CONTENT LAYER ═══ */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            height: '100%',
            padding: '30px 28px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* ── TOP ROW ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 500,
                  letterSpacing: '2.8px',
                  color: 'rgba(255,255,255,0.42)',
                  textTransform: 'uppercase',
                  fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                }}
              >
                AMBIENT FEED
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.9)',
                  marginTop: '7px',
                  letterSpacing: '-0.3px',
                  lineHeight: 1.3,
                }}
              >
                {location}
              </h3>
            </div>

            {/* Condition icon button */}
            <button
              onClick={cycleCondition}
              title="Click to cycle weather"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.16)',
                backgroundColor: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(14px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.35s ease',
                outline: 'none',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)';
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ConditionIcon size={20} color={iconColor} strokeWidth={1.8} />
            </button>
          </div>

          {/* ── CENTER AREA: Weather mascot graphic ── */}
          <div 
            style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative',
              height: '170px',
              margin: '10px 0',
              pointerEvents: 'none',
              zIndex: 5
            }}
          >
            <WeatherCharacter type={characterType} />
          </div>

          {/* ── CENTER: Temperature Display ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '6px' }}>
            <div
              style={{
                fontSize: '98px',
                fontWeight: 100,
                lineHeight: 0.95,
                letterSpacing: '-5px',
                color: 'rgba(255,255,255,0.95)',
                WebkitFontSmoothing: 'antialiased',
              }}
            >
              {temperature}°{unit}
            </div>

            {/* Condition badge + feels like */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.18)',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  fontSize: '8.5px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.78)',
                  transition: 'all 0.6s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {CONDITION_LABELS[activeCondition]}
              </span>
              <span
                style={{
                  fontSize: '12.5px',
                  color: 'rgba(255,255,255,0.45)',
                  fontWeight: 400,
                  whiteSpace: 'nowrap',
                }}
              >
                Feels like{' '}
                <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.68)' }}>
                  {feelsLike}°{unit}
                </span>
              </span>
            </div>
          </div>

          {/* ── BOTTOM ROW: Sunrise + Time + Sunset ── */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              paddingTop: '16px',
              marginTop: '14px',
            }}
          >
            {/* Sunrise */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <Sunrise size={14} color="rgba(255,200,80,0.65)" strokeWidth={2} />
              <div>
                <div
                  style={{
                    fontSize: '7.5px',
                    fontWeight: 600,
                    letterSpacing: '1.6px',
                    color: 'rgba(255,255,255,0.38)',
                    textTransform: 'uppercase',
                  }}
                >
                  Sunrise
                </div>
                <div style={{ fontSize: '11.5px', fontWeight: 500, color: 'rgba(255,255,255,0.72)', marginTop: '2px' }}>
                  {sunriseTime}
                </div>
              </div>
            </div>

            {/* Live clock — destination local time */}
            <div
              style={{
                fontSize: '8.5px',
                fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
                color: 'rgba(255,255,255,0.22)',
                letterSpacing: '0.6px',
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              {currentTime}
              {tzLabel && (
                <div style={{ fontSize: '7px', letterSpacing: '1.2px', color: 'rgba(255,255,255,0.15)', marginTop: '1px' }}>
                  {tzLabel}
                </div>
              )}
            </div>

            {/* Sunset */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', textAlign: 'right' }}>
              <div>
                <div
                  style={{
                    fontSize: '7.5px',
                    fontWeight: 600,
                    letterSpacing: '1.6px',
                    color: 'rgba(255,255,255,0.38)',
                    textTransform: 'uppercase',
                  }}
                >
                  Sunset
                </div>
                <div style={{ fontSize: '11.5px', fontWeight: 500, color: 'rgba(255,255,255,0.72)', marginTop: '2px' }}>
                  {sunsetTime}
                </div>
              </div>
              <Sunset size={14} color="rgba(255,150,80,0.65)" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AmbientWeatherCard;
