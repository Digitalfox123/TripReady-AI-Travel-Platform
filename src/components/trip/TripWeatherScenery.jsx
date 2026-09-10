import React, { useMemo, useState } from 'react';
import {
  MapPin,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Cloud,
  Zap,
  Wind,
  Droplets,
  Gauge,
  Eye,
  Thermometer,
  ArrowRight
} from 'lucide-react';

export default function TripWeatherScenery({
  weatherData,
  destName = 'Destination',
  destCountry = '',
  destTimezone = null
}) {
  // ── 1. Determine Time & Period in Destination City ───────────────────────────
  const { timePeriod, destHour, formattedDate, formattedTime } = useMemo(() => {
    let hour = 12;
    let timeStr = '07:24 AM';
    let dateStr = 'Wed, 4 Jun 2026';
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
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).format(now);

        dateStr = new Intl.DateTimeFormat('en-US', {
          timeZone: destTimezone,
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }).format(now);
      } catch {
        hour = now.getHours();
        timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        dateStr = now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
      }
    } else {
      hour = now.getHours();
      timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      dateStr = now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    }

    let period = 'Morning';
    if (hour >= 5 && hour < 12) period = 'Morning';
    else if (hour >= 12 && hour < 17) period = 'Afternoon';
    else if (hour >= 17 && hour < 21) period = 'Evening';
    else period = 'Night';

    return {
      timePeriod: period,
      destHour: hour,
      formattedDate: dateStr,
      formattedTime: timeStr
    };
  }, [destTimezone]);

  // ── 2. Weather Condition Categorization ─────────────────────────────────────
  const condition = (weatherData?.condition || 'Sunny').toLowerCase();
  const isRain = condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower');
  const isSnow = condition.includes('snow') || condition.includes('flurry') || condition.includes('ice');
  const isThunder = condition.includes('thunder') || condition.includes('storm');
  const isCloudy = condition.includes('cloud') || condition.includes('overcast') || condition.includes('fog') || condition.includes('mist');
  const isNight = timePeriod === 'Night';

  // ── 3. High-Definition Curated Background Photo ─────────────────────────────
  const backgroundImage = useMemo(() => {
    if (isSnow) {
      // Snowy Alpine Lake & Chalets
      return 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1600&q=85';
    }
    if (isRain || isThunder) {
      // Moody Atmospheric Rain Over Scenic Lake & Mountains
      return 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1600&q=85';
    }
    if (isNight) {
      // Starlit Midnight Mountains & Calm Lake
      return 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=1600&q=85';
    }
    if (timePeriod === 'Morning') {
      // Golden Sunrise Lake & Hills
      return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=85';
    }
    // Sunny Afternoon / Day
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=85';
  }, [isSnow, isRain, isThunder, isNight, timePeriod]);

  // ── 4. Natural Contextual Weather Description ───────────────────────────────
  const weatherAdvisory = useMemo(() => {
    if (isSnow) {
      return 'Light snow is falling. Roads may be slippery, so drive carefully.';
    }
    if (isRain || isThunder) {
      return 'Light to moderate rain expected throughout the day.';
    }
    if (isNight) {
      return 'Cool and calm evening with clear starry skies.';
    }
    if (isCloudy) {
      return 'Gentle cloud cover with pleasant seasonal temperatures.';
    }
    if (timePeriod === 'Morning') {
      return 'Clear skies with bright morning sunshine throughout the day.';
    }
    return 'Sunny and comfortable outdoor conditions across the city.';
  }, [isSnow, isRain, isThunder, isNight, isCloudy, timePeriod]);

  // ── 5. Hourly Forecast Generation (6 Hours) ────────────────────────────────
  const hourlyForecast = useMemo(() => {
    if (weatherData?.hourly && Array.isArray(weatherData.hourly) && weatherData.hourly.length >= 6) {
      return weatherData.hourly.slice(0, 6);
    }
    // Fallback computed hourly progression based on current temp
    const baseTemp = weatherData?.temp ?? 24;
    const currentH = destHour;
    return Array.from({ length: 6 }).map((_, i) => {
      const h = (currentH + i) % 24;
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const tempDiff = i === 0 ? 0 : (i <= 3 ? i * 2 : (6 - i) * 2);
      return {
        time: `${displayH} ${period}`,
        temp: baseTemp + tempDiff,
        isRain,
        isSnow,
        isCloudy
      };
    });
  }, [weatherData, destHour, isRain, isSnow, isCloudy]);

  // ── 6. State for active hourly selection ───────────────────────────────────
  const [activeHourIdx, setActiveHourIdx] = useState(0);

  return (
    <div className="relative overflow-hidden rounded-[32px] sm:rounded-[36px] shadow-2xl border border-white/20 p-5 sm:p-7 text-white select-none transition-all">
      {/* Background Photographic Scenery */}
      <img
        src={backgroundImage}
        alt={`${destName} weather landscape`}
        className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
        loading="eager"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=85';
        }}
      />

      {/* Cinematic Scrim Gradient: Ensures white typography & frosted glass remain 100% crisp */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-sky-950/20 pointer-events-none" />

      {/* Animated Rain Effects (when rainy) */}
      {isRain && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-cyan-200 to-white animate-pulse"
              style={{
                height: `${24 + (i % 5) * 8}px`,
                left: `${(i * 6.5) % 100}%`,
                top: `${(i * 12) % 80}%`,
                transform: 'rotate(15deg)',
                animationDuration: `${0.8 + (i % 4) * 0.2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Animated Snow Effects (when snowy) */}
      {isSnow && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/80 blur-[0.5px] animate-ping"
              style={{
                left: `${(i * 5.8) % 96}%`,
                top: `${(i * 10) % 90}%`,
                animationDuration: `${2 + (i % 3)}s`
              }}
            />
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TOP BAR: LOCATION & TIME
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        {/* Left: Location Pin & Destination */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight drop-shadow-md leading-snug">
              {destName}
            </h3>
            <p className="text-[11px] text-white/80 font-medium drop-shadow-sm truncate max-w-[160px] sm:max-w-xs">
              {destCountry || 'International'}
            </p>
          </div>
        </div>

        {/* Right: Date, Time & Small Condition Icon */}
        <div className="flex items-center gap-2.5 text-right">
          <div>
            <span className="block text-[11px] text-white/80 font-medium drop-shadow-sm">
              {formattedDate}
            </span>
            <span className="block text-sm sm:text-base font-bold text-white font-mono tracking-tight drop-shadow-md">
              {formattedTime}
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
            {isSnow ? (
              <CloudSnow className="w-4 h-4 text-cyan-200" />
            ) : isRain ? (
              <CloudRain className="w-4 h-4 text-cyan-300" />
            ) : isNight ? (
              <Moon className="w-4 h-4 text-amber-200" />
            ) : (
              <Sun className="w-4 h-4 text-amber-300" />
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN HERO WEATHER & 3D CELESTIAL GRAPHIC
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex items-center justify-between gap-4 mt-6 sm:mt-8">
        {/* Left Hero Details */}
        <div className="space-y-1 sm:space-y-1.5">
          {/* Period Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-wider shadow-sm">
            {isSnow ? (
              <CloudSnow className="w-3.5 h-3.5 text-cyan-200" />
            ) : isRain ? (
              <CloudRain className="w-3.5 h-3.5 text-cyan-300" />
            ) : isNight ? (
              <Moon className="w-3.5 h-3.5 text-amber-200" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span>{isSnow ? 'Snow' : isRain ? 'Rainy' : timePeriod}</span>
          </div>

          {/* Giant Temperature */}
          <div className="flex items-baseline">
            <span className="text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter leading-none drop-shadow-2xl">
              {weatherData?.temp ?? 24}
            </span>
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white/90 ml-1.5 align-top drop-shadow-lg">
              °C
            </span>
          </div>

          {/* Condition Name */}
          <h4 className="text-lg sm:text-2xl font-bold text-white drop-shadow-md">
            {weatherData?.condition || (isSnow ? 'Snow' : isRain ? 'Rainy' : 'Sunny')}
          </h4>

          {/* Feels Like Row */}
          <div className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm font-medium drop-shadow-sm pt-0.5">
            <Thermometer className="w-4 h-4 text-white/80" />
            <span>Feels like {weatherData?.feelsLike ?? weatherData?.temp ?? 26}°C</span>
          </div>

          {/* Advisory Sentence */}
          <p className="text-[11px] sm:text-xs text-white/85 font-light max-w-sm drop-shadow leading-relaxed pt-1">
            {weatherAdvisory}
          </p>
        </div>

        {/* Right: 3D Glowing Celestial Element */}
        <div className="relative flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
          {isSnow ? (
            /* 3D Snowcloud */
            <div className="relative flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-cyan-400/20 blur-2xl absolute inset-0" />
              <CloudSnow className="w-20 h-20 sm:w-24 sm:h-24 text-cyan-100 drop-shadow-2xl filter" />
            </div>
          ) : isRain ? (
            /* 3D Raincloud */
            <div className="relative flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-blue-500/25 blur-2xl absolute inset-0" />
              <CloudRain className="w-20 h-20 sm:w-24 sm:h-24 text-blue-100 drop-shadow-2xl filter" />
            </div>
          ) : isNight ? (
            /* 3D Crescent Moon */
            <div className="relative flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-amber-300/20 blur-2xl absolute inset-0" />
              <Moon className="w-20 h-20 sm:w-24 sm:h-24 text-amber-200 fill-amber-200/90 drop-shadow-2xl filter" />
            </div>
          ) : (
            /* 3D Golden Sun with Radiating Corona Flare */
            <div className="relative flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-amber-400/35 blur-2xl absolute inset-0 animate-pulse" />
              <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-2xl" viewBox="0 0 100 100">
                <defs>
                  <radialGradient id="sun3dGrad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FFF9C4" />
                    <stop offset="45%" stopColor="#FDD835" />
                    <stop offset="85%" stopColor="#F57C00" />
                    <stop offset="100%" stopColor="#E65100" />
                  </radialGradient>
                  <filter id="sunGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                {/* Corona Rays */}
                {Array.from({ length: 8 }).map((_, rIdx) => (
                  <rect
                    key={rIdx}
                    x="47"
                    y="8"
                    width="6"
                    height="12"
                    rx="3"
                    fill="#FFD54F"
                    opacity="0.9"
                    transform={`rotate(${rIdx * 45} 50 50)`}
                  />
                ))}
                {/* Sun Sphere */}
                <circle cx="50" cy="50" r="26" fill="url(#sun3dGrad)" filter="url(#sunGlow)" />
                {/* Specular Highlight */}
                <ellipse cx="43" cy="42" rx="8" ry="4" fill="white" opacity="0.4" transform="rotate(-30 43 42)" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          FROSTED GLASS TELEMETRY PILL (4 COLUMNS)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 mt-6 sm:mt-8 p-4 sm:p-5 rounded-2xl bg-black/40 dark:bg-black/55 backdrop-blur-xl border border-white/15 shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 sm:divide-x divide-white/15">
          {/* Metric 1: Humidity */}
          <div className="flex items-center gap-3 px-2 sm:px-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-cyan-300 flex-shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] sm:text-[11px] text-white/70 font-medium">Humidity</span>
              <span className="block text-sm sm:text-base font-bold text-white font-mono">
                {weatherData?.humidity ?? 62}%
              </span>
            </div>
          </div>

          {/* Metric 2: Wind */}
          <div className="flex items-center gap-3 px-2 sm:px-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-cyan-300 flex-shrink-0">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] sm:text-[11px] text-white/70 font-medium">Wind</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm sm:text-base font-bold text-white font-mono">
                  {weatherData?.windSpeed ?? 8} km/h
                </span>
                <span className="text-[10px] text-white/60 font-mono">
                  {weatherData?.windDirection || 'NNE'}
                </span>
              </div>
            </div>
          </div>

          {/* Metric 3: Pressure */}
          <div className="flex items-center gap-3 px-2 sm:px-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-cyan-300 flex-shrink-0">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] sm:text-[11px] text-white/70 font-medium">Pressure</span>
              <span className="block text-sm sm:text-base font-bold text-white font-mono">
                {weatherData?.pressure ?? 1012} hPa
              </span>
            </div>
          </div>

          {/* Metric 4: Visibility */}
          <div className="flex items-center gap-3 px-2 sm:px-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-cyan-300 flex-shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] sm:text-[11px] text-white/70 font-medium">Visibility</span>
              <span className="block text-sm sm:text-base font-bold text-white font-mono">
                {weatherData?.visibility ?? 10} km
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          FROSTED GLASS HOURLY FORECAST BAR (6 HOURS)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 mt-3 p-4 sm:p-5 rounded-2xl bg-black/40 dark:bg-black/55 backdrop-blur-xl border border-white/15 shadow-xl space-y-3">
        {/* Forecast Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isSnow ? (
              <CloudSnow className="w-4 h-4 text-cyan-300" />
            ) : isRain ? (
              <CloudRain className="w-4 h-4 text-cyan-300" />
            ) : (
              <Sun className="w-4 h-4 text-amber-300" />
            )}
            <h5 className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Hourly Forecast
            </h5>
          </div>

          <span className="text-[11px] text-white/75 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium">
            <span>More Details</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* 6 Hourly Slot Pills */}
        <div className="grid grid-cols-6 gap-2 pt-1 text-center">
          {hourlyForecast.map((slot, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveHourIdx(idx)}
              className={`flex flex-col items-center justify-between py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                activeHourIdx === idx
                  ? 'border-b-2 border-cyan-400 bg-white/10 font-bold'
                  : 'hover:bg-white/5 opacity-80 hover:opacity-100'
              }`}
            >
              <span className="text-[10px] sm:text-[11px] text-white/80 font-medium">
                {slot.time}
              </span>

              <div className="my-1.5 flex items-center justify-center text-white">
                {isSnow ? (
                  <CloudSnow className="w-4 h-4 text-cyan-200" />
                ) : isRain ? (
                  <CloudRain className="w-4 h-4 text-cyan-300" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-300" />
                )}
              </div>

              <span className="text-xs sm:text-sm font-bold text-white font-mono">
                {slot.temp}°
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
