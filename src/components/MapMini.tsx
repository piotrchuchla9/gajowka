import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type Pin = { lat: number; lng: number };

export default function MapMini({ pins, maptilerKey }: { pins: Pin[]; maptilerKey: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const style = maptilerKey
      ? `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${maptilerKey}`
      : {
          version: 8,
          sources: { osm: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256 } },
          layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
        } as any;

    const map = new maplibregl.Map({
      container: ref.current,
      style,
      center: [20, 50],
      zoom: 3,
      interactive: false,
      attributionControl: false,
    });

    map.on('load', () => {
      pins.forEach(p => {
        const el = document.createElement('div');
        el.style.cssText = 'width:14px;height:14px;border-radius:50%;background:#7A3E1D;box-shadow:0 0 0 4px rgba(122,62,29,0.3);border:2px solid #F5F1E8;';
        new maplibregl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map);
      });
      if (pins.length) {
        const b = new maplibregl.LngLatBounds();
        pins.forEach(p => b.extend([p.lng, p.lat]));
        map.fitBounds(b, { padding: 60, maxZoom: 4, duration: 0 });
      }
    });

    return () => { map.remove(); };
  }, [pins, maptilerKey]);

  return <div ref={ref} className="w-full h-full" />;
}
