import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Polyline, 
  useMapEvents,
  LayersControl,
  LayerGroup
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon
// @ts-ignore
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// @ts-ignore
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import shadowIcon from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: shadowIcon,
});

export const MAP_PROVIDERS = [
  {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    category: 'base'
  },
  {
    name: 'Satellite (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community',
    category: 'base'
  },
  {
    name: 'Dark Matter (Carto)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    category: 'base'
  },
  {
    name: 'Terrain (OpenTopo)',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    category: 'base'
  },
  {
    name: 'Vworld Base',
    url: 'https://api.vworld.kr/req/wmts/1.0.0/228D7CC1-6BBD-368E-B98F-FF2189A2BAA1/Base/{z}/{y}/{x}.png',
    attribution: '&copy; Vworld',
    category: 'vworld'
  },
  {
    name: 'Vworld Satellite',
    url: 'https://api.vworld.kr/req/wmts/1.0.0/228D7CC1-6BBD-368E-B98F-FF2189A2BAA1/Satellite/{z}/{y}/{x}.jpeg',
    attribution: '&copy; Vworld',
    category: 'vworld'
  },
  {
    name: 'Vworld Hybrid',
    url: 'https://api.vworld.kr/req/wmts/1.0.0/228D7CC1-6BBD-368E-B98F-FF2189A2BAA1/Hybrid/{z}/{y}/{x}.png',
    attribution: '&copy; Vworld',
    category: 'vworld'
  },
  {
    name: 'Vworld Gray',
    url: 'https://api.vworld.kr/req/wmts/1.0.0/228D7CC1-6BBD-368E-B98F-FF2189A2BAA1/gray/{z}/{y}/{x}.png',
    attribution: '&copy; Vworld',
    category: 'vworld'
  },
  {
    name: 'Vworld Midnight',
    url: 'https://api.vworld.kr/req/wmts/1.0.0/228D7CC1-6BBD-368E-B98F-FF2189A2BAA1/midnight/{z}/{y}/{x}.png',
    attribution: '&copy; Vworld',
    category: 'vworld'
  },
  {
    name: 'Seoul Base (기본지도)',
    url: 'https://map.seoul.go.kr/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=seoul:base_map&STYLE=&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913&TILEROW={y}&TILECOL={x}&FORMAT=image/png',
    attribution: '&copy; Seoul Metropolitan Government',
    category: 'seoul'
  },
  {
    name: 'Seoul Air (항공사진)',
    url: 'https://map.seoul.go.kr/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=seoul:air_map&STYLE=&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913&TILEROW={y}&TILECOL={x}&FORMAT=image/jpeg',
    attribution: '&copy; Seoul Metropolitan Government',
    category: 'seoul'
  },
  {
    name: 'Seoul Gray (백지도)',
    url: 'https://map.seoul.go.kr/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=seoul:gray_map&STYLE=&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913&TILEROW={y}&TILECOL={x}&FORMAT=image/png',
    attribution: '&copy; Seoul Metropolitan Government',
    category: 'seoul'
  },
  {
    name: 'Seoul Night (야간지도)',
    url: 'https://map.seoul.go.kr/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=seoul:night_map&STYLE=&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913&TILEROW={y}&TILECOL={x}&FORMAT=image/png',
    attribution: '&copy; Seoul Metropolitan Government',
    category: 'seoul'
  },
  {
    name: 'Seoul Cadastral (지적도)',
    url: 'https://map.seoul.go.kr/geoserver/gwc/service/tms/1.0.0/tile_map%3As_lsmd_cbnd@3857@png/{z}/{x}/{y}.png',
    attribution: '&copy; Seoul Metropolitan Government',
    category: 'seoul',
    tms: true
  },
  {
    name: 'Seoul District Bound (자치구)',
    url: 'https://map.seoul.go.kr/geoserver/gwc/service/tms/1.0.0/tile_map%3Av_bnd_sigungu_tms@3857@png/{z}/{x}/{y}.png',
    attribution: '&copy; Seoul Metropolitan Government',
    category: 'seoul',
    tms: true
  },
  {
    name: 'Seoul Historical (대경성부대관)',
    url: 'https://map.seoul.go.kr/geoserver/gwc/service/tms/1.0.0/tile_map%3Ag_capital_tms@3857@png/{z}/{x}/{y}.png',
    attribution: '&copy; Seoul Metropolitan Government',
    category: 'seoul',
    tms: true
  },
  {
    name: 'Seoul Land Use 2025',
    url: 'https://map.seoul.go.kr/geoserver/gwc/service/tms/1.0.0/tile_map%3Av_biotope_2025_newtms@3857@png/{z}/{x}/{y}.png',
    attribution: '&copy; Seoul Metropolitan Government',
    category: 'seoul',
    tms: true
  },
  {
    name: 'Seoul 1950s Relics (전재 표시도)',
    url: 'https://map.seoul.go.kr/geoserver/gwc/service/tms/1.0.0/tile_map%3Ag_new_relic_tms@3857@png/{z}/{x}/{y}.png',
    attribution: '&copy; Seoul Metropolitan Government',
    category: 'seoul',
    tms: true
  },
  {
    name: 'Seoul Ancient Streams (옛 물길)',
    url: 'https://map.seoul.go.kr/geoserver/gwc/service/tms/1.0.0/tile_map%3Av_old_stream_rev_tms@3857@png/{z}/{x}/{y}.png',
    attribution: '&copy; Seoul Metropolitan Government',
    category: 'seoul',
    tms: true
  },
  {
    name: 'Seoul Public WiFi (와이파이)',
    url: 'https://map.seoul.go.kr/geoserver/gwc/service/tms/1.0.0/tile_map%3Aseoul_wifi2@3857@png/{z}/{x}/{y}.png',
    attribution: '&copy; Seoul Metropolitan Government',
    category: 'seoul',
    tms: true
  },
  {
    name: 'Seoul Building (건축물)',
    url: 'https://map.seoul.go.kr/geoserver/gwc/service/tms/1.0.0/tile_map%3Atl_spbd_buld@3857@png/{z}/{x}/{y}.png',
    attribution: '&copy; Seoul Metropolitan Government',
    category: 'seoul',
    tms: true
  },
  {
    name: 'OSM Germany',
    url: 'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    category: 'global'
  },
  {
    name: 'HOT Humanitarian',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
    category: 'global'
  },
  {
    name: 'Carto Positron',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    category: 'global'
  },
  {
    name: 'Carto Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    category: 'global'
  },
  {
    name: 'Esri Street Map',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
    category: 'global'
  },
  {
    name: 'Stamen Toner',
    url: 'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    category: 'global'
  },
  {
    name: 'Stamen Terrain',
    url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    category: 'global'
  },
  {
    name: 'Google Maps',
    url: 'https://mt1.google.com/vt/lyrs=m&hl=ko&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps',
    category: 'integrated'
  },
  {
    name: 'Naver Maps',
    url: 'https://map.pstatic.net/nrb/styles/basic/1618565585/{z}/{x}/{y}.png?mt=bg.ol.ts.ar.sw.lko',
    attribution: '&copy; NAVER Corp.',
    category: 'integrated'
  }
];
