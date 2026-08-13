import React from 'react';

export default function CustomSlider({
  min = 1,
  max = 30,
  step = 1,
  value = 7,
  onChange,
  label,
  unit = '',
  prefix = '',
  ticks = null,
  presets = null,
  formatTooltip = null,
  showTooltip = true,
  className = '',
  accentColor = 'blue'
}) {
  const numericValue = Number(value) || min;
  const percentage = Math.max(0, Math.min(100, ((numericValue - min) / (max - min)) * 100));

  const displayValue = formatTooltip 
    ? formatTooltip(numericValue) 
    : `${prefix}${numericValue}${unit ? ' ' + unit : ''}`;

  return (
    <div className={`w-full select-none ${className}`}>
      {/* Optional Top Label Header */}
      {label && (
        <div className="flex justify-between items-center mb-1">
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-heading">
            {label}
          </label>
        </div>
      )}

      {/* Main Slider Container with Tooltip */}
      <div className="relative w-full pt-7 pb-1">
        {/* Floating Tooltip Badge above thumb (Reference Image 2 UI/UX) */}
        {showTooltip && (
          <div 
            className="absolute top-0 -translate-x-1/2 z-20 pointer-events-none transition-all duration-75 ease-out"
            style={{ left: `${percentage}%` }}
          >
            <div className="relative bg-[#0A192F] dark:bg-[#060D1A] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-lg flex items-center justify-center whitespace-nowrap border border-blue-500/30">
              <span>{displayValue}</span>
              {/* Tooltip Downward Arrow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0A192F] dark:bg-[#060D1A] rotate-45 border-r border-b border-blue-500/30" />
            </div>
          </div>
        )}

        {/* Custom Slider Track */}
        <div className="relative w-full h-2.5 rounded-full flex items-center bg-slate-100 dark:bg-white/[0.08] overflow-hidden">
          {/* Active Filled Progress Track */}
          <div 
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Native Transparent Overlay Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={numericValue}
          onChange={(e) => onChange && onChange(Number(e.target.value))}
          className="absolute bottom-1 left-0 w-full h-2.5 opacity-0 cursor-pointer z-10"
        />

        {/* Custom Circular Thumb Handle (Reference Image 2 UI/UX) */}
        <div 
          className="absolute bottom-1 -translate-y-[-1px] -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-blue-600 shadow-md shadow-blue-600/30 pointer-events-none transition-transform duration-75 hover:scale-110 flex items-center justify-center z-15"
          style={{ left: `${percentage}%` }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
        </div>
      </div>

      {/* Optional Ticks row */}
      {ticks && ticks.length > 0 && (
        <div className="flex justify-between text-[9px] font-semibold text-slate-400 dark:text-slate-500 px-1 mt-1.5 font-mono">
          {ticks.map((tick, idx) => (
            <span key={idx}>{tick}</span>
          ))}
        </div>
      )}

      {/* Optional Preset Quick Select Pills */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {presets.map((presetVal) => {
            const isActive = numericValue === presetVal;
            return (
              <button
                key={presetVal}
                type="button"
                onClick={() => onChange && onChange(presetVal)}
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-tight border cursor-pointer hover:scale-105 active:scale-95 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.25)]'
                    : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-slate-350 border-slate-200 dark:border-white/10 hover:border-blue-400/50'
                }`}
              >
                {presetVal}{unit ? unit.charAt(0).toLowerCase() : ''}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
