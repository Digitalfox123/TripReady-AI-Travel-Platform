import { useState, useEffect, useRef } from 'react';
import { Map, Layers, Maximize2, Minimize2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

export default function MapPanel({
  geoCoords,
  destination,
  attractions = [],
  hospitals = [],
  mapHotspot,
  setMapHotspot,
  mapHotspots = [] // Fallback static hotspots for Vector map
}) {
  const [activeMapTab, setActiveMapTab] = useState('live'); // 'live' | 'vector'
  const [isFullScreen, setIsFullScreen] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const clusterGroupRef = useRef(null);
  const markersRef = useRef([]);

  // Window resize listener for responsive Leaflet map tile rendering
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize({ animate: false });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Invalidate Leaflet map size on full screen toggle
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize({ animate: true });
      const timer = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize({ animate: true });
        }
      }, 310);
      return () => clearTimeout(timer);
    }
  }, [isFullScreen]);

  // Map mounting & marker clustering
  useEffect(() => {
    if (!geoCoords || activeMapTab !== 'live' || !mapRef.current) return;

    let map = mapInstanceRef.current;
    
    // Initialize Leaflet map
    if (!map) {
      map = L.map(mapRef.current).setView([geoCoords.lat, geoCoords.lng], 13);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);
      mapInstanceRef.current = map;
      window.destinationLeafletMap = map; // Bind to window for focusOnMap coordinates alignment
    } else {
      map.setView([geoCoords.lat, geoCoords.lng], 13);
    }

    // Clean up old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Clean up old cluster layer
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
    }

    // Setup clustering layer
    const clusterGroup = L.markerClusterGroup();
    clusterGroupRef.current = clusterGroup;

    // 1. Center City Hub Marker (Non-clustered)
    const centerIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #4F7CFF; width: 16px; height: 16px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(79,124,255,0.8);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
    const centerMarker = L.marker([geoCoords.lat, geoCoords.lng], { icon: centerIcon })
      .bindPopup(`<strong>${destination.name} City Center</strong>`)
      .addTo(map);
    markersRef.current.push(centerMarker);

    // 2. Attractions markers (Clustered)
    attractions.forEach((spot) => {
      if (spot.lat && spot.lng) {
        const spotIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #8B5CF6; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 8px rgba(139,92,246,0.8);"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });
        const marker = L.marker([spot.lat, spot.lng], { icon: spotIcon })
          .bindPopup(`<strong>${spot.name}</strong><br/><span style="font-size:10px; color:#8B5CF6;">${spot.category || 'Attraction'}</span>`);

        marker.on('click', () => {
          setMapHotspot({
            name: spot.name,
            desc: spot.description || `A highly popular landmark situated in ${spot.address}.`,
            type: spot.category || 'Attraction',
            subway: 'Subway Access: 150m',
            airport: `Proximity: ${spot.distance}`
          });
        });

        clusterGroup.addLayer(marker);
        markersRef.current.push(marker);
      }
    });

    // 3. Healthcare markers (Clustered)
    hospitals.forEach((hosp) => {
      if (hosp.lat && hosp.lng) {
        const hospIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #10B981; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 8px rgba(16,185,129,0.8);"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });
        const marker = L.marker([hosp.lat, hosp.lng], { icon: hospIcon })
          .bindPopup(`<strong>${hosp.name}</strong><br/><span style="font-size:10px; color:#10B981; font-weight:bold;">${hosp.type}</span>`);

        marker.on('click', () => {
          setMapHotspot({
            name: hosp.name,
            desc: `${hosp.type} located at ${hosp.address}. Open 24/7 for emergency dispatches.`,
            type: hosp.type,
            subway: 'Subway Access: 80m',
            airport: `Hotline: ${hosp.phone || '24/7 Dispatch'}`
          });
        });

        clusterGroup.addLayer(marker);
        markersRef.current.push(marker);
      }
    });

    map.addLayer(clusterGroup);
    window.destinationMapMarkers = markersRef.current; // Expose markers for card triggers focus
  }, [geoCoords, attractions, hospitals, activeMapTab, destination.name, setMapHotspot]);

  // Clean up Leaflet instance on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        window.destinationLeafletMap = null;
        window.destinationMapMarkers = [];
      }
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-16 items-center justify-between text-left">
      {/* Left Info Panel */}
      <div className="lg:w-1/2 space-y-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wider">
            <Map className="w-3.5 h-3.5" /> Geo-Coordinates
          </span>
          {/* Tab Selector */}
          <div className="inline-flex rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] p-0.5">
            <button
              onClick={() => setActiveMapTab('live')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeMapTab === 'live' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)]'
              }`}
            >
              Live Map
            </button>
            <button
              onClick={() => setActiveMapTab('vector')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeMapTab === 'vector' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)]'
              }`}
            >
              Vector Guide
            </button>
          </div>
        </div>

        <h2 className="section-title text-left">Interactive Travel Map</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed font-light">
          {activeMapTab === 'live'
            ? `Interact with coordinates, attractions, and hospitals. Select markers to view dynamic address overlays and calculate distances.`
            : `Select coordinate checkpoints on our digital geomap simulation to scan essential transit links, terminal distances, and walking times.`}
        </p>

        {/* Map Hotspot Info Box */}
        <div className="p-5 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border)] text-left min-h-[120px] flex items-center justify-start">
          {mapHotspot ? (
            <div className="space-y-2.5 animate-fade-in w-full">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-[var(--accent)] text-base">
                  {mapHotspot.name}
                </h4>
                <span className="text-[9px] bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-heading">
                  {mapHotspot.type || 'Hotspot Scanned'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light">
                {mapHotspot.desc}
              </p>
              <div className="pt-2 flex items-center gap-4 text-[10px] text-[var(--text-secondary)] border-t border-[var(--border)] font-mono">
                <span>🚇 {mapHotspot.subway || 'Subway Access: 200m'}</span>
                <span>🚗 {mapHotspot.airport || 'Airport Hub: 14 km'}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[var(--text-secondary)] italic font-light">
              Select any marker or checkpoint on the map to display details here...
            </p>
          )}
        </div>
      </div>

      {/* Right Map Visualizer Panel */}
      <div className="lg:w-1/2 w-full max-w-full overflow-hidden">
        {isFullScreen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] transition-opacity duration-300 animate-fade-in"
            onClick={() => setIsFullScreen(false)}
          />
        )}
        <div className={isFullScreen 
          ? "fixed inset-2 sm:inset-10 z-[90] rounded-2xl sm:rounded-[32px] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl transition-all duration-300" 
          : "w-full max-w-full aspect-[4/3] sm:aspect-[4/3] rounded-2xl sm:rounded-[32px] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] relative shadow-premium transition-all duration-500 min-h-[300px] sm:min-h-[400px]"
        }>
          {/* Full Screen Toggle Button */}
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="absolute top-4 right-4 z-[30] p-2.5 rounded-xl bg-white/95 dark:bg-[#081125]/95 backdrop-blur-md border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center cursor-pointer"
            title={isFullScreen ? "Exit Full Screen" : "View Full Screen"}
          >
            {isFullScreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {activeMapTab === 'live' ? (
            // Live Leaflet Map Container
            <div ref={mapRef} className="absolute inset-0 w-full h-full z-10" />
          ) : (
            // SVG Vector Map Mockup
            <>
              {/* Simulated Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-[0.25]" />

              <div className="absolute inset-0 z-0 pointer-events-none select-none">
                <svg className="w-full h-full" viewBox="0 0 400 300" fill="none" stroke="currentColor">
                  <style>{`
                    @keyframes transit-dash {
                      to { stroke-dashoffset: -20; }
                    }
                    .animate-transit-dash {
                      animation: transit-dash 1.2s linear infinite;
                    }
                  `}</style>

                  {/* River vector */}
                  <path
                    d="M -20,120 C 80,100 130,220 230,200 C 300,180 330,300 420,280"
                    fill="none"
                    stroke="rgba(147, 197, 253, 0.12)"
                    strokeWidth="20"
                    strokeLinecap="round"
                  />

                  {/* Ring road */}
                  <path
                    d="M 50,-20 Q 200,80 350,-20"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.3"
                  />

                  {/* Diagonal boulevard */}
                  <path d="M -20,320 L 420,-20" fill="none" stroke="var(--border)" strokeWidth="1.2" opacity="0.25" />

                  {/* Active SVG path animations based on selected vector hotspot */}
                  {mapHotspot?.id === 1 && (
                    <path
                      d="M 200,150 Q 170,145 140,135"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="6 4"
                      className="animate-transit-dash text-[var(--accent)]"
                    />
                  )}
                  {mapHotspot?.id === 2 && (
                    <path
                      d="M 200,150 Q 210,120 220,90"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="6 4"
                      className="animate-transit-dash text-[var(--accent)]"
                    />
                  )}
                  {mapHotspot?.id === 3 && (
                    <path
                      d="M 200,150 Q 240,165 280,180"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="6 4"
                      className="animate-transit-dash text-[var(--accent)]"
                    />
                  )}
                </svg>
              </div>

              {/* Central City Hub */}
              <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <span className="absolute -inset-2.5 rounded-full bg-blue-500/25 border border-blue-500/40 animate-ping opacity-75" />
                <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white dark:border-[#020813] flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.6)] relative z-20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
                <span className="absolute top-6 bg-white/95 dark:bg-[#0b1528]/95 backdrop-blur-md border border-[var(--border)] text-[8px] font-bold text-[var(--text-secondary)] dark:text-slate-300 px-1.5 py-0.5 rounded-full shadow-md whitespace-nowrap z-20 tracking-wider uppercase font-mono">
                  City Hub
                </span>
              </div>

              {/* Vector hotspots */}
              {mapHotspots.map((point) => (
                <button
                  key={point.id}
                  onClick={() =>
                    setMapHotspot({
                      id: point.id,
                      name: point.name,
                      desc: point.desc,
                      type: 'Vector Hotspot',
                      subway: 'Subway Access: 200m',
                      airport: 'Airport Hub: 14 km'
                    })
                  }
                  className="absolute group transition-all duration-300 hover:scale-110 z-20 cursor-pointer"
                  style={{ left: point.x, top: point.y }}
                >
                  <span
                    className={`absolute -inset-3 rounded-full border opacity-75 transition-all duration-300 ${
                      mapHotspot?.id === point.id
                        ? 'bg-[var(--accent)]/30 border-[var(--accent)]/40 animate-ping'
                        : 'bg-slate-500/10 border-slate-500/20'
                    }`}
                  />
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border font-bold text-[11px] font-heading shadow-md transition-all duration-300 ${
                      mapHotspot?.id === point.id
                        ? 'bg-[var(--accent)] border-[var(--accent)] text-white scale-110'
                        : 'bg-white dark:bg-[#081125] border-[var(--border)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {point.id}
                  </div>
                </button>
              ))}

              {/* Footer Legend */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end">
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#081125]/80 backdrop-blur-md border border-[var(--border)] text-[9px] text-[var(--text-secondary)] space-y-1 shadow-premium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" /> Selected Route
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Transit Hub Center
                  </div>
                </div>
                <div className="text-[9px] text-[var(--text-muted)] font-mono bg-white/60 dark:bg-[#081125]/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[var(--border)]">
                  Vector View
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
