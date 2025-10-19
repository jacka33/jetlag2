'use client';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

type Props = {
  from?: [number, number]; // [longitude, latitude]
  to?: [number, number];   // [longitude, latitude]
};

// TODO: Handle antimeridian crossing
function createGeometry(from: [number, number], to: [number, number]) {
  return {
    type: 'LineString' as const,
    coordinates: [from, to]
  };
}

export default function MapArcs({ from, to }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  console.log('MapArcs coords:', { from, to });

  useEffect(() => {
    if (!mapContainer.current) return;

    // Simple validation with explicit number conversion
    if (
      !from || !to ||
      Number(from[0]) === 0 || Number(from[1]) === 0 ||
      Number(to[0]) === 0 || Number(to[1]) === 0
    ) {
      console.log('Invalid coordinates, skipping map');
      return;
    }

    // Get token
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error('No Mapbox token found');
      mapContainer.current.innerHTML = '<div style="padding: 20px; text-align: center;">Mapbox token required</div>';
      return;
    }

    // Initialize map
    if (!map.current) {
      mapboxgl.accessToken = token;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        projection: 'mercator',
        style: 'mapbox://styles/jack380/cmfipzh7w004f01sebcdh2q57',
        center: [(Number(from[0]) + Number(to[0])) / 2, (Number(from[1]) + Number(to[1])) / 2],
        zoom: 2
      });

      map.current.on('load', () => {
        if (!map.current) return;

        // Add line
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: createGeometry(from, to),
            properties: {}
          }
        });

        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': '#155dfc',
            'line-width': 3
          }
        });

        // Add markers
        map.current.addSource('markers', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [Number(from[0]), Number(from[1])]
                },
                properties: {}
              },
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [Number(to[0]), Number(to[1])]
                },
                properties: {}
              }
            ]
          }
        });

        map.current.addLayer({
          id: 'markers',
          type: 'circle',
          source: 'markers',
          paint: {
            'circle-radius': 8,
            'circle-color': '#155dfc',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });

        // Fit to bounds
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend([Number(from[0]), Number(from[1])]);
        bounds.extend([Number(to[0]), Number(to[1])]);
        map.current.fitBounds(bounds, { padding: 50 });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [from, to]);

  // Show placeholder if no valid coordinates
  if (!from || !to ||
    from[0] === 0 || from[1] === 0 ||
    to[0] === 0 || to[1] === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center text-gray-400">
        No route to display
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] bg-gray-200 border rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
