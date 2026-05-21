import { useEffect, useRef, useState } from 'react';
import maplibregl, { type Map as MlMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export type MapTrip = {
  title: string;
  slug: string;
  country: string;
  region: string;
  lat: number;
  lng: number;
  cover?: string;
  date?: string;
};

export default function WorldMap({ trips, maptilerKey }: { trips: MapTrip[]; maptilerKey: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const [active, setActive] = useState<MapTrip | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const style = maptilerKey
      ? `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${maptilerKey}`
      : {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap',
            },
          },
          layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
        } as any;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style,
      center: [20, 50],
      zoom: 3,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      trips.forEach(t => {
        const el = document.createElement('div');
        el.className = 'gajowka-pin';
        el.style.cssText = 'width:18px;height:18px;border-radius:50%;background:#7A3E1D;box-shadow:0 0 0 4px rgba(122,62,29,0.25);cursor:pointer;border:2px solid #F5F1E8;';
        el.addEventListener('click', (e) => { e.stopPropagation(); setActive(t); map.flyTo({ center: [t.lng, t.lat], zoom: 6 }); });
        new maplibregl.Marker({ element: el }).setLngLat([t.lng, t.lat]).addTo(map);
      });

      // Fit bounds
      if (trips.length) {
        const bounds = new maplibregl.LngLatBounds();
        trips.forEach(t => bounds.extend([t.lng, t.lat]));
        map.fitBounds(bounds, { padding: 80, maxZoom: 5, duration: 0 });
      }
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, [trips, maptilerKey]);

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] min-h-[500px]">
      <div ref={containerRef} className="w-full h-full" />
      {active && (
        <div className="absolute bottom-6 left-6 right-6 md:left-auto md:w-[360px] bg-bg shadow-2xl border border-ink/10 p-5 z-10">
          <button onClick={() => setActive(null)} className="absolute top-3 right-3 text-ink-soft hover:text-rust text-xl leading-none" aria-label="zamknij">×</button>
          {active.cover && <img src={active.cover} alt="" className="w-full aspect-video object-cover mb-4 sepia-[0.1]" />}
          <div className="text-xs tracking-[0.15em] uppercase text-linen mb-2">{active.country} · {active.region}</div>
          <h3 className="font-serif text-xl mb-3">{active.title}</h3>
          <a href={`/podroze/${active.slug}`} className="inline-block font-serif italic text-rust hover:text-rust-dark">przeczytaj →</a>
        </div>
      )}
      {!maptilerKey && (
        <div className="absolute top-4 left-4 bg-bg/90 text-ink-soft text-xs px-3 py-2 z-10 max-w-xs">
          Brak <code>PUBLIC_MAPTILER_KEY</code> → tile OSM (fallback).
        </div>
      )}
    </div>
  );
}
