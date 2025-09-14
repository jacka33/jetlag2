'use client';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppSelector } from '../redux/hooks';
import { selectDeparture, selectArrival } from '../redux/flightSlice';

type Props = {
  from?: [number, number]; // [longitude, latitude]
  to?: [number, number];   // [longitude, latitude]
};

// TODO: Handle antimeridian crossing
function createGeometry(from: [number, number], to: [number, number]) {

  // If the absolute difference in longitude is greater than 180 degrees,
  // the shortest path crosses the antimeridian
  const doesCrossAntimeridian = Math.abs(to[0] - from[0]) > 180;

  const geometry = {
    type: 'LineString',
    coordinates: [
      from,
      to
    ]
  };

  // // To draw a line across the 180th meridian,
  // // if the longitude of the second point minus
  // // the longitude of original (or previous) point is >= 180,
  // // subtract 360 from the longitude of the second point.
  // // If it is less than 180, add 360 to the second point.

  // if (doesCrossAntimeridian) {
  //   const startLng = geometry.coordinates[0][0];
  //   const endLng = geometry.coordinates[1][0];

  //   if (endLng - startLng >= 180) {
  //     geometry.coordinates[1][0] -= 360;
  //   } else if (endLng - startLng < 180) {
  //     geometry.coordinates[1][0] += 360;
  //   }
  // }

  return geometry;
}

export default function MapArcs({ from, to }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  console.log('MapArcs coords:', { from, to });

  useEffect(() => {
    if (!mapContainer.current) return;

    // Simple validation
    if (!from || !to ||
      from[0] === 0 || from[1] === 0 ||
      to[0] === 0 || to[1] === 0) {
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
        style: 'mapbox://styles/mapbox/light-v11',
        center: [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2],
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
            'line-color': '#ff0080',
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
                  coordinates: from
                },
                properties: {}
              },
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: to
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
            'circle-color': '#ff0080',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });

        // Fit to bounds
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(from);
        bounds.extend(to);
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
