/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Polyline, 
  useMapEvents,
  useMap,
  Tooltip,
  LayersControl,
  CircleMarker
} from 'react-leaflet';
import L from 'leaflet';
import { 
  Radio, 
  MapPin, 
  Settings, 
  Database, 
  Copy, 
  Download, 
  Plus, 
  Trash2, 
  Search,
  Maximize2,
  Minimize2,
  Share2,
  Zap,
  LogIn,
  LogOut,
  Target,
  Layers,
  ChevronRight,
  Locate,
  Navigation,
  Loader2,
  X,
  Menu,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { calculateDistance, calculateBearing, cn, formatCoords } from '@/src/lib/utils';
import { Coordinates, RadioStation, CalculationResult, AppTheme } from '@/src/types';
import { MAP_PROVIDERS } from './constants';
import { TRANSLATIONS, LANGUAGES } from './i18n';
import { KR_STATIONS } from './kr_stations';
import { KR_LOW_POWER_STATIONS } from './kr_low_power_stations';
import { SHORTWAVE_STATIONS } from './shortwave_stations';
import { JP_STATIONS } from './jp_stations';

// Set up custom marker icons to avoid Leaflet default image issues
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const DEFAULT_THEME: AppTheme = {
  primaryColor: '#F27D26',
  lineColor: '#00FF00',
  fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
};

export default function App() {
  const [lang, setLang] = useState('KR');
  const t = TRANSLATIONS[lang];

  const [stations, setStations] = useState<RadioStation[]>([]);
  const [p1, setP1] = useState<Coordinates | null>(null);
  const [p2, setP2] = useState<Coordinates | null>(null);
  const [theme, setTheme] = useState<AppTheme>(DEFAULT_THEME);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showDistanceOnExport, setShowDistanceOnExport] = useState(true);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);
  const [isMapListOpen, setIsMapListOpen] = useState(false);
  const [manualCoordInput, setManualCoordInput] = useState({ lat: '', lng: '' });
  const [searchP1, setSearchP1] = useState('');
  const [searchP2, setSearchP2] = useState('');
  const [activeProviderIndex, setActiveProviderIndex] = useState(2);
  const [dbTab, setDbTab] = useState<'personal' | 'kr' | 'shortwave' | 'jp'>('personal');
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [activeKrRegion, setActiveKrRegion] = useState<string | null>(null);
  const [activeLowPowerRegion, setActiveLowPowerRegion] = useState<string | null>(null);
  const [activeSwCategory, setActiveSwCategory] = useState<string | null>(null);
  const [activeJpRegion, setActiveJpRegion] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isBaseMapsOpen, setIsBaseMapsOpen] = useState(true);
  const [isVworldOpen, setIsVworldOpen] = useState(false);
  const [isIntegratedOpen, setIsIntegratedOpen] = useState(false);
  const [isSeoulOpen, setIsSeoulOpen] = useState(false);
  const [isGlobalOpen, setIsGlobalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const [customMaps, setCustomMaps] = useState<{name: string, url: string, attribution: string}[]>([]);
  const [newMapData, setNewMapData] = useState({ name: '', url: '', attribution: '' });

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('wavespace-history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedStations = localStorage.getItem('wavespace-stations');
    if (savedStations) setStations(JSON.parse(savedStations));

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('wavespace-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('wavespace-stations', JSON.stringify(stations));
  }, [stations]);

  // Load custom maps from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wavespace-custom-maps');
    if (saved) setCustomMaps(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('wavespace-custom-maps', JSON.stringify(customMaps));
  }, [customMaps]);

  const addCustomMap = () => {
    if (newMapData.name && newMapData.url) {
      setCustomMaps([...customMaps, newMapData]);
      setNewMapData({ name: '', url: '', attribution: '' });
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 15);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  };

  const toggleTracking = () => {
    if (isTrackingLocation) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsTrackingLocation(false);
      setUserLocation(null);
    } else {
      if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
      }
      setIsTrackingLocation(true);
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.error(err);
          setIsTrackingLocation(false);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const allProviders = [...MAP_PROVIDERS, ...customMaps];

  const [newStationData, setNewStationData] = useState({
    name: '',
    type: 'VHF/UHF',
    logoUrl: ''
  });

  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (query: string, type: 'p1' | 'p2') => {
    if (!query) return;
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await resp.json();
      if (data && data[0]) {
        const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        if (type === 'p1') setP1(coords);
        else setP2(coords);
        if (mapRef.current) mapRef.current.setView([coords.lat, coords.lng], 13);
      }
    } catch (e) {
      console.error("Search failed", e);
    }
  };

  const confirmSaveToFavorites = () => {
    if (!p1) return;
    const newStation: RadioStation = {
      id: Math.random().toString(36).substring(2, 9),
      name: newStationData.name || `Station ${stations.length + 1}`,
      type: newStationData.type,
      location: p1,
      logoUrl: newStationData.logoUrl,
      createdAt: Date.now()
    };
    setStations([...stations, newStation]);
    setSaveModalOpen(false);
    setNewStationData({ name: '', type: 'VHF/UHF', logoUrl: '' });
  };

  const deleteStation = (id: string) => {
    setStations(stations.filter(s => s.id !== id));
  };

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const fontName = file.name.split('.')[0];
      const newStyle = document.createElement('style');
      newStyle.appendChild(document.createTextNode(`@font-face { font-family: "${fontName}"; src: url("${ev.target?.result}"); }`));
      document.head.appendChild(newStyle);
      setTheme({ ...theme, fontFamily: `"${fontName}", sans-serif` });
    };
    reader.readAsDataURL(file);
  };

  const exportMap = async () => {
    if (!mapContainerRef.current || isCapturing) return;
    
    setIsCapturing(true);
    try {
      // Small delay to ensure any pending UI updates are rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(mapContainerRef.current, {
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#0a0a0c',
        scale: 2,
        ignoreElements: (element) => {
          return element.classList.contains('leaflet-control-container') || 
                 element.classList.contains('z-[1000]');
        }
      });
      
      const link = document.createElement('a');
      link.download = `wavespace-capture-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Capture failed:", error);
      alert("캡쳐 중 오류가 발생했습니다. (일부 지도는 보안 정책상 캡쳐가 제한될 수 있습니다)");
    } finally {
      setIsCapturing(false);
    }
  };

  const result: CalculationResult | null = (p1 && p2) ? {
    p1, p2,
    id: `${p1.lat}-${p1.lng}-${p2.lat}-${p2.lng}`,
    distanceKm: calculateDistance(p1.lat, p1.lng, p2.lat, p2.lng),
    distanceMiles: calculateDistance(p1.lat, p1.lng, p2.lat, p2.lng) * 0.621371,
    bearing: calculateBearing(p1.lat, p1.lng, p2.lat, p2.lng),
    timestamp: Date.now()
  } : null;

  // Track history
  useEffect(() => {
    if (result) {
      setHistory(prev => {
        const alreadyExists = prev.find(h => h.id === result.id);
        if (alreadyExists) return prev;
        return [result, ...prev].slice(0, 5);
      });
    }
  }, [result?.id]);

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-gray-300 overflow-hidden font-sans relative" style={{ fontFamily: theme.fontFamily }}>
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside 
            initial={isMobile ? { x: "-100%" } : { x: -320 }} 
            animate={{ x: 0 }} 
            exit={isMobile ? { x: "-100%" } : { x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "bg-[#121214] border-r border-[#1e1e22] flex flex-col z-40 shadow-2xl transition-all duration-300",
              isMobile ? "absolute inset-y-0 left-0 w-[85%] max-w-[320px]" : "w-80 relative"
            )}
          >
            <div className="p-6 space-y-4 border-b border-[#1e1e22]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg shadow-orange-500/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-black text-white tracking-tighter text-xl italic">{t.title}</h1>
                  <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] font-sans">{t.subtitle}</p>
                </div>
              </div>

              {/* Language Switcher */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest px-1">{t.language}</label>
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full bg-[#1a1a1d] border border-white/5 rounded-xl px-3 py-2 text-[10px] font-bold text-gray-400 focus:outline-none focus:border-orange-500/50 appearance-none"
                >
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8">
              {/* Point A */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-orange-500 flex items-center gap-2">
                    <Target className="w-3 h-3" /> {t.transmitter}
                  </label>
                  {p1 && <button onClick={() => setP1(null)} className="text-[9px] text-gray-600 hover:text-red-500 font-bold tracking-widest">{t.reset}</button>}
                </div>
                <div className="space-y-2">
                  <div className="bg-[#0a0a0c] border border-[#1e1e22] rounded-xl flex items-center px-3 group focus-within:border-orange-500/50 transition-all">
                    <input 
                      placeholder={t.search_placeholder} 
                      className="bg-transparent py-3 text-sm text-white focus:outline-none w-full"
                      value={searchP1} onChange={e => setSearchP1(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearch(searchP1, 'p1')}
                    />
                    <button onClick={() => handleSearch(searchP1, 'p1')} className="text-gray-500 hover:text-white transition-colors">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between px-3 py-2 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Coord:</span>
                    <span className="text-[10px] font-mono font-bold text-orange-500">
                      {p1 ? formatCoords(p1.lat, p1.lng) : '---'}
                    </span>
                    {p1 && (
                      <button onClick={() => navigator.clipboard.writeText(formatCoords(p1.lat, p1.lng))} className="hover:text-white">
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* Point B */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-green-500 flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> {t.receiver}
                  </label>
                  {p2 && <button onClick={() => setP2(null)} className="text-[9px] text-gray-600 hover:text-red-500 font-bold tracking-widest">{t.reset}</button>}
                </div>
                <div className="space-y-2">
                  <div className="bg-[#0a0a0c] border border-[#1e1e22] rounded-xl flex items-center px-3 group focus-within:border-green-500/50 transition-all">
                    <input 
                      placeholder={t.search_placeholder} 
                      className="bg-transparent py-3 text-sm text-white focus:outline-none w-full"
                      value={searchP2} onChange={e => setSearchP2(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearch(searchP2, 'p2')}
                    />
                    <button onClick={() => handleSearch(searchP2, 'p2')} className="text-gray-500 hover:text-white transition-colors">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between px-3 py-2 bg-green-500/5 border border-green-500/10 rounded-xl">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Coord:</span>
                    <span className="text-[10px] font-mono font-bold text-green-500">
                      {p2 ? formatCoords(p2.lat, p2.lng) : '---'}
                    </span>
                    {p2 && (
                      <button onClick={() => navigator.clipboard.writeText(formatCoords(p2.lat, p2.lng))} className="hover:text-white">
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* Result */}
              {result && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-gray-500 uppercase">{t.distance}</p>
                      <p className="text-2xl font-black text-white">{result.distanceKm.toFixed(2)}<span className="text-[10px] ml-1 text-orange-500">KM</span></p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-500 uppercase">{t.bearing}</p>
                      <p className="text-2xl font-black text-white">{result.bearing.toFixed(1)}°</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSaveModalOpen(true)} className="flex-1 py-3 bg-orange-500 text-white rounded-xl text-[10px] font-bold hover:shadow-lg transition-all uppercase tracking-widest">{t.save_db}</button>
                    <button onClick={() => navigator.clipboard.writeText(`${result.distanceKm.toFixed(2)}km, ${result.bearing.toFixed(1)}°`)} className="p-3 bg-white/5 rounded-xl"><Copy className="w-4 h-4" /></button>
                  </div>
                </motion.div>
              )}

              {/* Recent History */}
              {history.length > 0 && (
                <section className="space-y-4 pt-4 border-t border-[#1e1e22]">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t.recent_history}</label>
                    <button onClick={() => setHistory([])} className="text-[8px] text-gray-600 hover:text-red-500 uppercase font-black">{t.reset}</button>
                  </div>
                  <div className="space-y-2">
                    {history.map((h, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => { 
                          setP1(h.p1); 
                          setP2(h.p2); 
                          if (mapRef.current) {
                            const bounds = L.latLngBounds([h.p1.lat, h.p1.lng], [h.p2.lat, h.p2.lng]);
                            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
                          }
                        }}
                        className="p-3 bg-[#1a1a1d] border border-white/5 rounded-xl flex items-center justify-between group hover:border-orange-500/20 transition-all cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-white">{h.distanceKm.toFixed(2)}</span>
                            <span className="text-[8px] text-orange-500 font-bold uppercase">KM</span>
                          </div>
                          <p className="text-[8px] text-gray-600 font-mono italic">Bearing: {h.bearing.toFixed(1)}°</p>
                        </div>
                        <Share2 className="w-3 h-3 text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Favorites & KR DB */}
              <section className="space-y-4 pt-4 border-t border-[#1e1e22]">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setDbTab('personal')}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg transition-all",
                        dbTab === 'personal' ? "text-orange-500 bg-orange-500/10" : "text-gray-500 hover:text-gray-300"
                      )}
                    >
                      {t.personal_db || "PERSONAL"}
                    </button>
                    <button 
                      onClick={() => setDbTab('shortwave')}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg transition-all",
                        dbTab === 'shortwave' ? "text-purple-500 bg-purple-500/10" : "text-gray-500 hover:text-gray-300"
                      )}
                    >
                      {t.db_shortwave || "SHORTWAVE"}
                    </button>
                    <button 
                      onClick={() => setDbTab('kr')}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg transition-all",
                        dbTab === 'kr' ? "text-blue-500 bg-blue-500/10" : "text-gray-500 hover:text-gray-300"
                      )}
                    >
                      {t.kr_db || "REPUBLIC OF KOREA"}
                    </button>
                    <button 
                      onClick={() => setDbTab('jp')}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg transition-all",
                        dbTab === 'jp' ? "text-red-500 bg-red-500/10" : "text-gray-500 hover:text-gray-300"
                      )}
                    >
                      {t.jp_db || "JAPAN"}
                    </button>
                  </div>
                  <Database className="w-3.5 h-3.5 text-gray-700" />
                </div>

                <div className="space-y-2">
                  {dbTab === 'personal' && stations.map(s => (
                    <div key={s.id} className="p-3 bg-[#1a1a1d] border border-white/5 rounded-xl flex items-center justify-between group hover:border-orange-500/30 transition-all cursor-pointer" onClick={() => { setP2(s.location); if (mapRef.current) mapRef.current.setView([s.location.lat, s.location.lng], 13); }}>
                      <div className="flex items-center gap-3">
                        {s.logoUrl ? <img src={s.logoUrl} className="w-8 h-8 rounded bg-black object-cover" alt="L" /> : <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-[10px] font-bold text-orange-500">ST</div>}
                        <div>
                          <p className="text-xs font-bold text-white truncate max-w-[120px]">{s.name}</p>
                          <p className="text-[9px] font-mono text-gray-600">{s.location.lat.toFixed(3)}, {s.location.lng.toFixed(3)}</p>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteStation(s.id); }} className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}

                  {dbTab === 'kr' && (
                    <div className="space-y-4">
                      {/* Low Power Section */}
                      <div className="mb-4">
                        <button 
                          onClick={() => setActiveLowPowerRegion(activeLowPowerRegion === 'Root' ? null : 'Root')}
                          className="w-full flex items-center justify-between px-3 py-2 bg-purple-500/10 rounded-xl border border-purple-500/20 hover:bg-purple-500/20 transition-all font-bold text-purple-400 text-[11px]"
                        >
                          <div className="flex items-center gap-2">
                             <Zap className="w-3 h-3" />
                             <span>{t.db_low_power || "Small Power Radio"}</span>
                          </div>
                          <Plus className={cn("w-3 h-3 transition-transform", activeLowPowerRegion === 'Root' && "rotate-45")} />
                        </button>
                        
                        <AnimatePresence>
                          {activeLowPowerRegion === 'Root' && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-2 space-y-3 pl-1">
                              {['Seoul, Gyeonggi & Gangwon', 'Chungcheong & Sejong', 'Gyeongsang', 'Jeolla & Jeju', 'AFN/Military Relay'].map(subRegion => (
                                <div key={subRegion} className="space-y-1.5">
                                  <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-2 mb-1">{subRegion}</div>
                                  <div className="space-y-1">
                                    {KR_LOW_POWER_STATIONS.filter(s => s.region === subRegion).map(s => (
                                      <div 
                                        key={s.name} 
                                        className="p-2.5 bg-purple-500/5 border border-purple-500/10 rounded-lg hover:border-purple-500/40 transition-all cursor-pointer"
                                        onClick={() => { setP2({lat: s.lat, lng: s.lng}); if (mapRef.current) mapRef.current.setView([s.lat, s.lng], 13); }}
                                      >
                                        <div className="flex items-center justify-between">
                                          <p className="text-[10px] font-bold text-gray-200">{s.name}</p>
                                          {(s.power || s.freq) && (
                                            <span className="text-[7px] text-purple-500 font-mono px-1 py-0.5 bg-purple-500/10 rounded">{s.freq || s.power}</span>
                                          )}
                                        </div>
                                        <p className="text-[8px] text-gray-500 mt-1 truncate">{s.address}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="h-px bg-white/5 mx-2" />

                      {[
                        { id: 'reg_seoul', label: t.reg_seoul },
                        { id: 'reg_gangwon', label: t.reg_gangwon },
                        { id: 'reg_chungcheong', label: t.reg_chungcheong },
                        { id: 'reg_jeolla', label: t.reg_jeolla },
                        { id: 'reg_gyeongsang', label: t.reg_gyeongsang },
                        { id: 'reg_jeju', label: t.reg_jeju }
                      ].map(region => (
                        <div key={region.id} className="space-y-1.5">
                          <button 
                            onClick={() => setActiveKrRegion(activeKrRegion === region.id ? null : region.id)}
                            className="w-full flex items-center justify-between px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all"
                          >
                            <span className="text-[10px] font-bold text-gray-400">{region.label}</span>
                            <Plus className={cn("w-3 h-3 text-gray-600 transition-transform", activeKrRegion === region.id && "rotate-45")} />
                          </button>
                          
                          <AnimatePresence>
                            {activeKrRegion === region.id && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: 'auto', opacity: 1 }} 
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-1 pl-2"
                              >
                                {KR_STATIONS.filter(s => {
                                  if (region.id === 'reg_seoul') return s.region === '수도권';
                                  if (region.id === 'reg_gangwon') return s.region === '강원권';
                                  if (region.id === 'reg_chungcheong') return s.region === '충청권';
                                  if (region.id === 'reg_jeolla') return s.region === '전라권';
                                  if (region.id === 'reg_gyeongsang') return s.region === '경상권';
                                  if (region.id === 'reg_jeju') return s.region === '제주권';
                                  return false;
                                }).map(s => (
                                  <div 
                                    key={s.name} 
                                    className="p-2 bg-black/40 border border-white/5 rounded-lg hover:border-blue-500/30 transition-all cursor-pointer"
                                    onClick={() => {
                                      const loc = { lat: s.lat, lng: s.lng };
                                      setP2(loc);
                                      if (mapRef.current) mapRef.current.setView([loc.lat, loc.lng], 13);
                                    }}
                                  >
                                    <p className="text-[10px] font-bold text-white truncate">{s.name}</p>
                                    <div className="flex items-center justify-between mt-1">
                                      <span className="text-[8px] font-mono text-gray-600">{s.lat.toFixed(3)}, {s.lng.toFixed(3)}</span>
                                      <span className="text-[8px] px-1 bg-white/5 rounded text-gray-500">{s.type}</span>
                                    </div>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}

                  {dbTab === 'jp' && (
                    <div className="space-y-4">
                      {['Hokkaido', 'Kanto & Chubu', 'Kinki & Kyushu', 'Islands'].map(region => (
                        <div key={region} className="space-y-1.5">
                          <button 
                            onClick={() => setActiveJpRegion(activeJpRegion === region ? null : region)}
                            className="w-full flex items-center justify-between px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all"
                          >
                            <span className="text-[10px] font-bold text-gray-400">{region}</span>
                            <Plus className={cn("w-3 h-3 text-gray-600 transition-transform", activeJpRegion === region && "rotate-45")} />
                          </button>
                          
                          <AnimatePresence>
                            {activeJpRegion === region && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: 'auto', opacity: 1 }} 
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-1 pl-2"
                              >
                                {JP_STATIONS.filter(s => s.region === region).map(s => (
                                  <div 
                                    key={s.name} 
                                    className="p-2 bg-black/40 border border-white/5 rounded-lg hover:border-red-500/30 transition-all cursor-pointer"
                                    onClick={() => {
                                      const loc = { lat: s.lat, lng: s.lng };
                                      setP2(loc);
                                      if (mapRef.current) mapRef.current.setView([loc.lat, loc.lng], 12);
                                    }}
                                  >
                                    <p className="text-[10px] font-bold text-white truncate">{s.name}</p>
                                    <p className="text-[8px] text-gray-500 mt-0.5">{s.address}</p>
                                    <div className="mt-1 text-[7px] font-mono text-gray-700">
                                      {s.lat.toFixed(3)}, {s.lng.toFixed(3)}
                                    </div>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}

                  {dbTab === 'shortwave' && (
                    <div className="space-y-4">
                      {/* Domestic Section */}
                      <div className="space-y-1.5">
                        <button 
                          onClick={() => setActiveSwCategory(activeSwCategory === 'domestic' ? null : 'domestic')}
                          className="w-full flex items-center justify-between px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all"
                        >
                          <span className="text-[10px] font-bold text-gray-400">대한민국 국내 송신소</span>
                          <Plus className={cn("w-3 h-3 text-gray-600 transition-transform", activeSwCategory === 'domestic' && "rotate-45")} />
                        </button>
                        <AnimatePresence>
                          {activeSwCategory === 'domestic' && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-1 pl-2">
                              {SHORTWAVE_STATIONS.filter(s => s.category === 'domestic').map(s => (
                                <div key={s.name} className="p-2 bg-black/40 border border-white/5 rounded-lg hover:border-purple-500/30 transition-all cursor-pointer" onClick={() => { setP2({lat: s.lat, lng: s.lng}); if (mapRef.current) mapRef.current.setView([s.lat, s.lng], 13); }}>
                                  <p className="text-[10px] font-bold text-white truncate">{s.name}</p>
                                  <p className="text-[8px] text-gray-500 mt-0.5">{s.address}</p>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Overseas Section */}
                      <div className="space-y-1.5">
                        <button 
                          onClick={() => setActiveSwCategory(activeSwCategory === 'overseas' ? null : 'overseas')}
                          className="w-full flex items-center justify-between px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all"
                        >
                          <span className="text-[10px] font-bold text-gray-400">해외 주요 송신소</span>
                          <Plus className={cn("w-3 h-3 text-gray-600 transition-transform", activeSwCategory === 'overseas' && "rotate-45")} />
                        </button>
                        <AnimatePresence>
                          {activeSwCategory === 'overseas' && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-2 pl-2">
                              {/* Grouped by Country */}
                              {['일본 (Japan)', '대만 (Taiwan)', 'Others'].map(country => {
                                const countryStations = country === 'Others' 
                                  ? SHORTWAVE_STATIONS.filter(s => s.category === 'overseas' && s.country !== '일본 (Japan)' && s.country !== '대만 (Taiwan)')
                                  : SHORTWAVE_STATIONS.filter(s => s.country === country);
                                
                                return (
                                  <div key={country} className="space-y-1">
                                    <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest pl-1">{country}</div>
                                    {countryStations.map(s => (
                                      <div key={s.name} className="p-2 bg-black/40 border border-white/5 rounded-lg hover:border-purple-500/30 transition-all cursor-pointer" onClick={() => { setP2({lat: s.lat, lng: s.lng}); if (mapRef.current) mapRef.current.setView([s.lat, s.lng], 8); }}>
                                        <p className="text-[10px] font-bold text-white truncate">{s.name}</p>
                                        <p className="text-[8px] text-gray-500 mt-0.5">{s.address}</p>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className="p-4 border-t border-[#1e1e22]">
              <button onClick={() => setSettingsOpen(true)} className="w-full py-3 bg-white/5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-white/10 text-gray-300"><Settings className="w-4 h-4" /> {t.config}</button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 relative bg-black flex flex-col" ref={mapContainerRef}>
        <MapContainer 
          center={[37.5, 127]} zoom={7} scrollWheelZoom className="w-full h-full"
          ref={mapRef} zoomControl={false}
        >
          <TileLayer 
            url={allProviders[activeProviderIndex]?.url || MAP_PROVIDERS[0].url} 
            attribution={allProviders[activeProviderIndex]?.attribution || ''} 
            tms={allProviders[activeProviderIndex]?.tms}
            crossOrigin={true}
            {...(allProviders[activeProviderIndex]?.options || {})}
          />
          <MapEvents 
            p1={p1} p2={p2} onP1Change={setP1} onP2Change={setP2} 
            lineColor={theme.lineColor} 
          />
          {p1 && <Marker position={[p1.lat, p1.lng]} icon={createCustomIcon('#F27D26')}><Tooltip permanent>TX: {p1.lat.toFixed(4)}</Tooltip></Marker>}
          {p2 && <Marker position={[p2.lat, p2.lng]} icon={createCustomIcon('#00FF00')}><Tooltip permanent>RX: {p2.lat.toFixed(4)}</Tooltip></Marker>}
          {p1 && p2 && <Polyline positions={[[p1.lat, p1.lng], [p2.lat, p2.lng]]} color={theme.lineColor} weight={3} dashArray="10, 10" />}
          
          {userLocation && (
            <CircleMarker 
              center={[userLocation.lat, userLocation.lng]} 
              radius={8}
              pathOptions={{ fillColor: '#3B82F6', fillOpacity: 0.8, color: 'white', weight: 3 }}
            >
              <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false}>
                You are here
              </Tooltip>
            </CircleMarker>
          )}
        </MapContainer>

        {/* Global UI Overlays */}
        <div className={cn(
          "absolute flex flex-col gap-3 z-[1000] transition-all duration-300",
          isMobile ? "bottom-6 right-6" : "top-6 right-6"
        )}>
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
            className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/20 transition-all active:scale-95"
          >
             {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => setIsMapListOpen(!isMapListOpen)} 
            className={cn(
              "w-12 h-12 bg-[#121214]/90 backdrop-blur-md border border-[#1e1e22] rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-95",
              isMapListOpen ? "text-orange-500 border-orange-500/50" : "text-white"
            )}
          >
             <Layers className="w-5 h-5" />
          </button>

          <button 
            onClick={handleLocate}
            className="w-12 h-12 bg-[#121214]/90 backdrop-blur-md border border-[#1e1e22] rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-95 text-white hover:text-orange-500"
          >
            <Locate className="w-5 h-5" />
          </button>

          <button 
            onClick={toggleTracking}
            className={cn(
              "w-12 h-12 bg-[#121214]/90 backdrop-blur-md border rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-95",
              isTrackingLocation ? "text-blue-500 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "text-white border-[#1e1e22]"
            )}
          >
            <Navigation className={cn("w-5 h-5", isTrackingLocation && "fill-blue-500/20")} />
          </button>

          <AnimatePresence>
            {isMapListOpen && (
              <motion.div 
                initial={isMobile ? { y: 20, opacity: 0 } : { opacity: 0, scale: 0.95, x: 20 }} 
                animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, scale: 1, x: 0 }} 
                exit={isMobile ? { y: 20, opacity: 0 } : { opacity: 0, scale: 0.95, x: 20 }}
                className={cn(
                   "absolute z-[1000] bg-[#121214]/95 backdrop-blur-xl border border-[#1e1e22] rounded-3xl shadow-2xl p-4 space-y-4 overflow-hidden",
                   isMobile ? "bottom-24 left-4 right-4 w-auto" : "top-28 right-0 w-64"
                )}
              >
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">MAP PROVIDERS</h3>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                  {/* Global Maps Group */}
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => setIsGlobalOpen(!isGlobalOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.global_maps || "GLOBAL"}</span>
                      </div>
                      <ChevronRight className={cn("w-3 h-3 text-gray-600 transition-transform", isGlobalOpen && "rotate-90")} />
                    </button>
 
                    <AnimatePresence>
                      {isGlobalOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden space-y-1.5 pl-2 pt-1"
                        >
                          {MAP_PROVIDERS.filter(p => p.category === 'global').map((p, i) => {
                            const originalIndex = MAP_PROVIDERS.findIndex(prov => prov.name === p.name);
                            return (
                              <button 
                                key={p.name + originalIndex} 
                                onClick={() => { setActiveProviderIndex(originalIndex); setIsMapListOpen(false); }}
                                className={cn(
                                  "w-full p-2.5 rounded-xl flex items-center justify-between group transition-all",
                                  activeProviderIndex === originalIndex ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-white/5 border border-transparent hover:bg-white/10"
                                )}
                              >
                                <div className="flex flex-col items-start gap-0.5">
                                  <span className={cn("text-[10px] font-bold", activeProviderIndex === originalIndex ? "text-emerald-500" : "text-gray-300")}>{p.name}</span>
                                  <span className="text-[7px] text-gray-700 font-mono italic">TMS/XYZ Layer</span>
                                </div>
                                {activeProviderIndex === originalIndex && <Zap className="w-2.5 h-2.5 text-emerald-500" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Default Maps Group */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <button 
                      onClick={() => setIsBaseMapsOpen(!isBaseMapsOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(242,125,38,0.5)]" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.base_maps || "DEFAULT"}</span>
                      </div>
                      <ChevronRight className={cn("w-3 h-3 text-gray-600 transition-transform", isBaseMapsOpen && "rotate-90")} />
                    </button>

                    <AnimatePresence>
                      {isBaseMapsOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden space-y-1.5 pl-2 pt-1"
                        >
                          {MAP_PROVIDERS.filter(p => !p.category || p.category === 'base').map((p, i) => {
                            const originalIndex = MAP_PROVIDERS.findIndex(prov => prov.name === p.name);
                            return (
                              <button 
                                key={p.name + originalIndex} 
                                onClick={() => { setActiveProviderIndex(originalIndex); setIsMapListOpen(false); }}
                                className={cn(
                                  "w-full p-2.5 rounded-xl flex items-center justify-between group transition-all",
                                  activeProviderIndex === originalIndex ? "bg-orange-500/10 border border-orange-500/20" : "bg-white/5 border border-transparent hover:bg-white/10"
                                )}
                              >
                                <div className="flex flex-col items-start gap-0.5">
                                  <span className={cn("text-[10px] font-bold", activeProviderIndex === originalIndex ? "text-orange-500" : "text-gray-300")}>{p.name}</span>
                                  <span className="text-[7px] text-gray-700 font-mono italic">TMS Layer</span>
                                </div>
                                {activeProviderIndex === originalIndex && <Zap className="w-2.5 h-2.5 text-orange-500" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Integrated Maps Group */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <button 
                      onClick={() => setIsIntegratedOpen(!isIntegratedOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.integrated_maps || "INTEGRATED"}</span>
                      </div>
                      <ChevronRight className={cn("w-3 h-3 text-gray-600 transition-transform", isIntegratedOpen && "rotate-90")} />
                    </button>

                    <AnimatePresence>
                      {isIntegratedOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden space-y-1.5 pl-2 pt-1"
                        >
                          {MAP_PROVIDERS.filter(p => p.category === 'integrated').map((p, i) => {
                            const originalIndex = MAP_PROVIDERS.findIndex(prov => prov.name === p.name);
                            return (
                              <button 
                                key={p.name + originalIndex} 
                                onClick={() => { setActiveProviderIndex(originalIndex); setIsMapListOpen(false); }}
                                className={cn(
                                  "w-full p-2.5 rounded-xl flex items-center justify-between group transition-all",
                                  activeProviderIndex === originalIndex ? "bg-purple-500/10 border border-purple-500/20" : "bg-white/5 border border-transparent hover:bg-white/10"
                                )}
                              >
                                <div className="flex flex-col items-start gap-0.5">
                                  <span className={cn("text-[10px] font-bold", activeProviderIndex === originalIndex ? "text-purple-500" : "text-gray-300")}>{p.name}</span>
                                  <span className="text-[7px] text-gray-700 font-mono italic">Combined Layer</span>
                                </div>
                                {activeProviderIndex === originalIndex && <Zap className="w-2.5 h-2.5 text-purple-500" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Vworld Maps Group */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <button 
                      onClick={() => setIsVworldOpen(!isVworldOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.vworld_maps || "VWORLD"}</span>
                      </div>
                      <ChevronRight className={cn("w-3 h-3 text-gray-600 transition-transform", isVworldOpen && "rotate-90")} />
                    </button>

                    <AnimatePresence>
                      {isVworldOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden space-y-1.5 pl-2 pt-1"
                        >
                          {MAP_PROVIDERS.filter(p => p.category === 'vworld').map((p, i) => {
                            const originalIndex = MAP_PROVIDERS.findIndex(prov => prov.name === p.name);
                            return (
                              <button 
                                key={p.name + originalIndex} 
                                onClick={() => { setActiveProviderIndex(originalIndex); setIsMapListOpen(false); }}
                                className={cn(
                                  "w-full p-2.5 rounded-xl flex items-center justify-between group transition-all",
                                  activeProviderIndex === originalIndex ? "bg-blue-500/10 border border-blue-500/20" : "bg-white/5 border border-transparent hover:bg-white/10"
                                )}
                              >
                                <div className="flex flex-col items-start gap-0.5">
                                  <span className={cn("text-[10px] font-bold", activeProviderIndex === originalIndex ? "text-blue-500" : "text-gray-300")}>{p.name}</span>
                                  <span className="text-[7px] text-gray-700 font-mono italic">KR TMS Layer</span>
                                </div>
                                {activeProviderIndex === originalIndex && <Zap className="w-2.5 h-2.5 text-blue-500" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Seoul Maps Group */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <button 
                      onClick={() => setIsSeoulOpen(!isSeoulOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.seoul_maps || "SEOUL"}</span>
                      </div>
                      <ChevronRight className={cn("w-3 h-3 text-gray-600 transition-transform", isSeoulOpen && "rotate-90")} />
                    </button>

                    <AnimatePresence>
                      {isSeoulOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden space-y-1.5 pl-2 pt-1"
                        >
                          {MAP_PROVIDERS.filter(p => p.category === 'seoul').map((p, i) => {
                            const originalIndex = MAP_PROVIDERS.findIndex(prov => prov.name === p.name);
                            return (
                              <button 
                                key={p.name + originalIndex} 
                                onClick={() => { setActiveProviderIndex(originalIndex); setIsMapListOpen(false); }}
                                className={cn(
                                  "w-full p-2.5 rounded-xl flex items-center justify-between group transition-all",
                                  activeProviderIndex === originalIndex ? "bg-red-500/10 border border-red-500/20" : "bg-white/5 border border-transparent hover:bg-white/10"
                                )}
                              >
                                <div className="flex flex-col items-start gap-0.5">
                                  <span className={cn("text-[10px] font-bold", activeProviderIndex === originalIndex ? "text-red-500" : "text-gray-300")}>{p.name}</span>
                                  <span className="text-[7px] text-gray-700 font-mono italic">TMS Layer</span>
                                </div>
                                {activeProviderIndex === originalIndex && <Zap className="w-2.5 h-2.5 text-red-500" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
 
                  {/* Custom Maps */}
                  {customMaps.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest pl-1">CUSTOM</p>
                      {customMaps.map((p, i) => {
                        const globalIndex = MAP_PROVIDERS.length + i;
                        return (
                          <button 
                            key={p.name + globalIndex} 
                            onClick={() => { setActiveProviderIndex(globalIndex); setIsMapListOpen(false); }}
                            className={cn(
                              "w-full p-3 rounded-2xl flex items-center justify-between group transition-all",
                              activeProviderIndex === globalIndex ? "bg-orange-500/20 border border-orange-500/30" : "bg-white/5 border border-transparent hover:bg-white/10"
                            )}
                          >
                            <div className="flex flex-col items-start gap-0.5">
                              <span className={cn("text-[11px] font-bold", activeProviderIndex === globalIndex ? "text-orange-500" : "text-gray-300")}>{p.name}</span>
                              <span className="text-[8px] text-gray-600 font-mono italic">User TMS</span>
                            </div>
                            <div className={cn(
                              "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                              activeProviderIndex === globalIndex ? "bg-orange-500 text-white" : "bg-white/5 text-gray-700 group-hover:text-gray-400"
                            )}>
                              <Layers className="w-3 h-3" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Metrics */}
        {result && !isMobile && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] px-8 py-4 bg-[#121214]/80 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl pointer-events-none">
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-orange-500 rounded-full" />
                <div>
                  <p className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">Path Distance</p>
                  <p className="text-xl font-black text-white tabular-nums">{result.distanceKm.toFixed(3)} KM</p>
                </div>
              </div>
              <div className="h-4 w-px bg-white/5" />
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[9px] font-bold text-gray-500 tracking-widest uppercase text-right">Azimuth</p>
                  <p className="text-xl font-black text-white tabular-nums text-right">{result.bearing.toFixed(1)}°</p>
                </div>
                <div className="w-1 h-8 bg-green-500 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Settings Modal (Simplified) */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSettingsOpen(false)} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative bg-[#121214] border border-[#1e1e22] rounded-3xl p-8 w-full max-w-md space-y-8">
              <h2 className="text-xl font-black text-white italic">CONFIG</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-3 block tracking-widest">Line Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={theme.lineColor} 
                      onChange={e => setTheme({...theme, lineColor: e.target.value})} 
                      className="w-12 h-12 bg-transparent cursor-pointer rounded-xl border-none p-0 overflow-hidden" 
                    />
                    <input 
                      type="text" 
                      value={theme.lineColor} 
                      onChange={e => setTheme({...theme, lineColor: e.target.value})} 
                      className="flex-1 p-2.5 bg-black border border-[#1e1e22] rounded-xl text-[11px] font-mono text-white"
                      placeholder="#00FF00"
                    />
                  </div>
                </div>
                {/* Custom TMS/WMTS */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block tracking-widest">Add Custom TMS Maps</label>
                  <div className="space-y-2">
                    <input 
                      placeholder="Map Name (e.g. Vworld Hybrid)" 
                      value={newMapData.name} onChange={e => setNewMapData({...newMapData, name: e.target.value})}
                      className="w-full p-2.5 bg-black border border-[#1e1e22] rounded-xl text-[11px]"
                    />
                    <input 
                      placeholder="Tile URL (https://.../{z}/{x}/{y}.png)" 
                      value={newMapData.url} onChange={e => setNewMapData({...newMapData, url: e.target.value})}
                      className="w-full p-2.5 bg-black border border-[#1e1e22] rounded-xl text-[11px] font-mono"
                    />
                    <button 
                      onClick={addCustomMap}
                      className="w-full py-2 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-xl text-[10px] font-bold hover:bg-orange-500/20"
                    >
                      ADD NEW PROVIDER
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {customMaps.map((cm, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                        <span className="text-[9px] text-gray-400">{cm.name}</span>
                        <button onClick={() => setCustomMaps(customMaps.filter((_, i) => i !== idx))} className="text-gray-600 hover:text-red-500 text-[10px]">&times;</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-3 block tracking-widest">Custom Font (OTF/TTF)</label>
                  <button onClick={() => fontInputRef.current?.click()} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-xs hover:bg-white/10">SELECT FONT FILE</button>
                  <input ref={fontInputRef} type="file" className="hidden" accept=".ttf,.otf" onChange={handleFontUpload} />
                </div>
              </div>
              <button onClick={() => setSettingsOpen(false)} className="w-full py-4 bg-orange-500 rounded-2xl font-black text-sm tracking-widest text-white shadow-xl shadow-orange-500/20">SAVE</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Save Modal */}
      <AnimatePresence>
        {isSaveModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSaveModalOpen(false)} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative bg-[#121214] border border-[#1e1e22] rounded-3xl p-8 w-full max-w-sm space-y-6">
              <h2 className="text-xl font-black text-white italic tracking-widest uppercase">{t.save_db}</h2>
              <div className="space-y-4">
                <input placeholder={t.station_name} value={newStationData.name} onChange={e => setNewStationData({...newStationData, name: e.target.value})} className="w-full p-3 bg-black border border-[#1e1e22] rounded-xl text-sm" />
                <select value={newStationData.type} onChange={e => setNewStationData({...newStationData, type: e.target.value})} className="w-full p-3 bg-black border border-[#1e1e22] rounded-xl text-sm appearance-none">
                  <option>Shortwave (SW)</option><option>Mediumwave (MW)</option><option>VHF/UHF</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setSaveModalOpen(false)} className="py-4 bg-white/5 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-gray-500">{t.cancel}</button>
                  <button onClick={() => confirmSaveToFavorites()} className="py-4 bg-orange-500 text-white font-black rounded-2xl shadow-lg uppercase tracking-widest text-[10px]">{t.confirm}</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MapEvents({ p1, p2, onP1Change, onP2Change, lineColor }: { p1: any, p2: any, onP1Change: any, onP2Change: any, lineColor: string }) {
  useMapEvents({
    click(e) {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      if (!p1) onP1Change(coords);
      else if (!p2) onP2Change(coords);
      else {
        onP1Change(coords);
        onP2Change(null);
      }
    },
  });
  return null;
}
