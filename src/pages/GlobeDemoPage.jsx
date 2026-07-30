import React, { useState, useMemo } from "react"
import { Globe } from "../components/ui/cobe-globe"
import { 
  Compass, 
  MapPin, 
  Layers, 
  Info, 
  Settings, 
  Navigation,
  Globe2,
  Sparkles,
  TrendingUp
} from "lucide-react"

const INITIAL_MARKERS = [
  { id: "sf", location: [37.7595, -122.4367], label: "San Francisco" },
  { id: "nyc", location: [40.7128, -74.006], label: "New York" },
  { id: "tokyo", location: [35.6762, 139.6503], label: "Tokyo" },
  { id: "london", location: [51.5074, -0.1278], label: "London" },
  { id: "sydney", location: [-33.8688, 151.2093], label: "Sydney" },
  { id: "capetown", location: [-33.9249, 18.4241], label: "Cape Town" },
  { id: "dubai", location: [25.2048, 55.2708], label: "Dubai" },
  { id: "paris", location: [48.8566, 2.3522], label: "Paris" },
  { id: "saopaulo", location: [-23.5505, -46.6333], label: "São Paulo" },
]

const INITIAL_ARCS = [
  { id: "sf-tokyo", from: [37.7595, -122.4367], to: [35.6762, 139.6503], label: "SF → Tokyo" },
  { id: "nyc-london", from: [40.7128, -74.006], to: [51.5074, -0.1278], label: "NYC → London" },
  { id: "london-dubai", from: [51.5074, -0.1278], to: [25.2048, 55.2708], label: "London → Dubai" },
  { id: "dubai-tokyo", from: [25.2048, 55.2708], to: [35.6762, 139.6503], label: "Dubai → Tokyo" },
]

export default function GlobeDemoPage() {
  const [selectedHotspot, setSelectedHotspot] = useState(INITIAL_MARKERS[2]) // Tokyo default
  const [globeDark, setGlobeDark] = useState(1) // Dark globe default
  const [speed, setSpeed] = useState(0.003) // Rotation speed
  const [showArcs, setShowArcs] = useState(true)

  const activeArcs = useMemo(() => {
    return showArcs ? INITIAL_ARCS : []
  }, [showArcs])

  const activeMarkers = useMemo(() => {
    return INITIAL_MARKERS
  }, [])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 pt-28 pb-20 overflow-hidden relative">
      {/* Editorial space grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.012)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none z-0 opacity-70" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[var(--accent)]/[0.03] filter blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center justify-between">
          
          {/* Left panel - telemetries */}
          <div className="lg:w-[45%] space-y-8 text-left">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-wider select-none">
                <Globe2 className="w-3.5 h-3.5" /> WebGL Interactive Engine
              </span>
              
              <h1 className="font-heading text-4xl sm:text-5xl font-normal leading-[1.1] text-luxury-primary dark:text-white tracking-tight">
                Living global <br />
                <span className="italic font-light text-luxury-secondary dark:text-slate-400">coordinate tracker.</span>
              </h1>
              
              <p className="text-sm font-light leading-relaxed text-luxury-secondary dark:text-slate-400 font-body">
                Experience high-performance mathematical modeling of Earth's topology. Spin, pan, and click our vector-plotted 3D canvas globe to test latitudinal pathways and connection transits.
              </p>
            </div>

            {/* Simulated Live telemetry board */}
            <div className="glass-card p-6 border border-luxury-border dark:border-white/[0.04] space-y-4 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[var(--accent)]/[0.02] filter blur-xl" />
              <div className="flex justify-between items-center pb-3 border-b border-luxury-border dark:border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[var(--accent)] animate-spin-slow" />
                  <span className="text-xs font-bold uppercase tracking-widest font-heading text-luxury-primary dark:text-white">Active Telemetry Scan</span>
                </div>
                <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" /> System Live
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-0.5">Focus Hotspot</span>
                  <span className="text-luxury-primary dark:text-white font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                    {selectedHotspot.label}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-0.5">Coordinates</span>
                  <span className="text-luxury-primary dark:text-white font-semibold">
                    {selectedHotspot.location[0].toFixed(4)}°N, {selectedHotspot.location[1].toFixed(4)}°E
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-0.5">Atmosphere Type</span>
                  <span className="text-luxury-primary dark:text-white font-semibold">
                    {globeDark ? 'Dark Holographic' : 'Light Wireframe'}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-0.5">Spin Velocity</span>
                  <span className="text-luxury-primary dark:text-white font-semibold">
                    {(speed * 1000).toFixed(1)} rad/s
                  </span>
                </div>
              </div>
            </div>

            {/* Quick action controllers */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-luxury-secondary dark:text-slate-400 font-heading">Interactive Hotspots</h3>
              <div className="flex flex-wrap gap-2">
                {activeMarkers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedHotspot(m)}
                    className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${
                      selectedHotspot.id === m.id
                        ? 'bg-[var(--accent)] border-transparent text-white shadow-md'
                        : 'bg-white dark:bg-white/[0.02] border-luxury-border dark:border-white/[0.04] text-luxury-secondary dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/10 hover:scale-102 active:scale-98 cursor-pointer'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel - globe */}
          <div className="lg:w-[50%] w-full flex flex-col items-center space-y-8">
            <div className="w-full max-w-lg aspect-square relative rounded-[40px] bg-slate-50 dark:bg-white/[0.01] border border-luxury-border dark:border-white/[0.04] shadow-premium p-8 flex items-center justify-center relative select-none">
              
              {/* Floating grid backdrop decoration */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.001)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.001)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none rounded-[40px]" />
              
              <Globe
                markers={activeMarkers}
                arcs={activeArcs}
                markerColor={[249 / 255, 115 / 255, 22 / 255]} // Coral/sunset accent
                baseColor={globeDark ? [8 / 255, 17 / 255, 37 / 255] : [218 / 255, 224 / 255, 238 / 255]}
                arcColor={[46 / 255, 91 / 255, 255 / 255]} // Accent blue
                glowColor={globeDark ? [8 / 255, 17 / 255, 37 / 255] : [218 / 255, 224 / 255, 238 / 255]}
                dark={globeDark}
                mapBrightness={globeDark ? 8 : 12}
                markerSize={0.018}
                markerElevation={0.008}
                speed={speed}
                className="w-full max-w-[420px] mx-auto z-10"
              />
            </div>

            {/* Quick interactive parameters control bar */}
            <div className="w-full max-w-lg glass-card px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-luxury-secondary dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold">Base style:</span>
                <button 
                  onClick={() => setGlobeDark(1)} 
                  className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold border transition-colors cursor-pointer ${globeDark ? 'bg-luxury-primary text-white dark:bg-white dark:text-[#020813] border-transparent' : 'border-luxury-border'}`}
                >
                  Dark
                </button>
                <button 
                  onClick={() => setGlobeDark(0)} 
                  className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold border transition-colors cursor-pointer ${!globeDark ? 'bg-luxury-primary text-white dark:bg-white dark:text-[#020813] border-transparent' : 'border-luxury-border'}`}
                >
                  Light
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold">Spin speed:</span>
                <button 
                  onClick={() => setSpeed(prev => prev === 0 ? 0.003 : 0)} 
                  className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold border transition-colors cursor-pointer ${speed === 0 ? 'bg-orange-500/10 border-orange-500/35 text-orange-600 dark:text-orange-400' : 'border-luxury-border'}`}
                >
                  {speed === 0 ? 'Paused' : 'Auto Rotate'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold">Arcs:</span>
                <button 
                  onClick={() => setShowArcs(!showArcs)} 
                  className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold border transition-colors cursor-pointer ${showArcs ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]' : 'border-luxury-border'}`}
                >
                  {showArcs ? 'Visible' : 'Hidden'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
