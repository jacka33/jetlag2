'use client';
import { useEffect, useRef, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppSelector } from '../redux/hooks';
import { selectDepCoords, selectArrCoords } from '../redux/flightSlice';

type Props = {
  from?: [number, number]; // [longitude, latitude]
  to?: [number, number];   // [longitude, latitude]
};

function isValidCoord(coord: [number, number]): boolean {
  return (
    Array.isArray(coord) &&
    coord.length === 2 &&
    typeof coord[0] === "number" &&
    typeof coord[1] === "number" &&
    !isNaN(coord[0]) &&
    !isNaN(coord[1]) &&
    coord[0] >= -180 && coord[0] <= 180 &&
    coord[1] >= -90 && coord[1] <= 90
  );
}

/**
 * Create a great circle route that properly handles antimeridian crossing
 */
function createGreatCircleGeoJSON(start: [number, number], end: [number, number]) {
  const [startLng, startLat] = start;
  const [endLng, endLat] = end;

  console.log('Creating route from:', start, 'to:', end);

  // Calculate the shortest path across longitude
  let adjustedEndLng = endLng;
  const deltaLng = endLng - startLng;

  if (deltaLng > 180) {
    adjustedEndLng = endLng - 360;
  } else if (deltaLng < -180) {
    adjustedEndLng = endLng + 360;
  }

  console.log('Delta longitude:', deltaLng, 'Adjusted end longitude:', adjustedEndLng);

  // Generate points along the great circle
  const numPoints = 100;
  const coordinates: [number, number][] = [];

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;

    // For great circle calculation, we should use spherical interpolation
    // But for simplicity and to ensure the line appears, let's use linear interpolation first
    const lat = startLat + t * (endLat - startLat);
    const lng = startLng + t * (adjustedEndLng - startLng);

    coordinates.push([lng, lat]);
  }

  console.log('Generated', coordinates.length, 'points for route');
  console.log('First few points:', coordinates.slice(0, 3));
  console.log('Last few points:', coordinates.slice(-3));

  return {
    type: 'Feature' as const,
    geometry: {
      type: 'LineString' as const,
      coordinates
    },
    properties: {}
  };
}

export default function MapArcs({ from, to }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Get coordinates from Redux store, fallback to props if provided
  const depCoordsFromStore = useAppSelector(selectDepCoords);
  const arrCoordsFromStore = useAppSelector(selectArrCoords);

  // Use props if provided, otherwise use Redux store
  const fromCoords = from || depCoordsFromStore;
  const toCoords = to || arrCoordsFromStore;

  console.log('MapArcs called with from:', fromCoords, 'to:', toCoords);

  // Parse coordinates to numbers if they are strings with stable references
  const parsedFrom = useMemo((): [number, number] => {
    if (!fromCoords || fromCoords.length !== 2) return [0, 0];
    return [
      typeof fromCoords[0] === 'string' ? parseFloat(fromCoords[0]) : fromCoords[0],
      typeof fromCoords[1] === 'string' ? parseFloat(fromCoords[1]) : fromCoords[1]
    ];
  }, [fromCoords]);

  const parsedTo = useMemo((): [number, number] => {
    if (!toCoords || toCoords.length !== 2) return [0, 0];
    return [
      typeof toCoords[0] === 'string' ? parseFloat(toCoords[0]) : toCoords[0],
      typeof toCoords[1] === 'string' ? parseFloat(toCoords[1]) : toCoords[1]
    ];
  }, [toCoords]);

  console.log('Parsed coordinates - from:', parsedFrom, 'to:', parsedTo);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map only once
    if (!map.current) {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      console.log('Mapbox token available:', !!token);

      if (!token) {
        console.error('NEXT_PUBLIC_MAPBOX_TOKEN is not set');
        return;
      }

      mapboxgl.accessToken = token;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [0, 20],
        zoom: 1,
        projection: 'mercator'
      });

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        if (!map.current) return;

        // Add the route source
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });

        // Add the route layer
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#ff0080',
            'line-width': 3,
            'line-opacity': 0.8
          }
        });

        // Add markers for start and end points
        map.current.addSource('markers', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });

        map.current.addLayer({
          id: 'markers',
          type: 'circle',
          source: 'markers',
          paint: {
            'circle-radius': 6,
            'circle-color': '#ff0080',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
      });
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Only run once

  // Separate effect to update the route when coordinates change
  useEffect(() => {
    if (
      !map.current ||
      !isValidCoord(parsedFrom) ||
      !isValidCoord(parsedTo) ||
      (parsedFrom[0] === 0 && parsedFrom[1] === 0 && parsedTo[0] === 0 && parsedTo[1] === 0)
    ) {
      return;
    }

    function updateRoute() {
      if (!map.current || !map.current.isStyleLoaded()) return;

      // Create the great circle route
      const routeGeoJSON = createGreatCircleGeoJSON(parsedFrom, parsedTo);

      console.log('Route coordinates:', routeGeoJSON.geometry.coordinates.slice(0, 5), '...', routeGeoJSON.geometry.coordinates.slice(-5));

      // Create marker points
      const markersGeoJSON = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: parsedFrom
            },
            properties: { type: 'start' }
          },
          {
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: parsedTo
            },
            properties: { type: 'end' }
          }
        ]
      };

      // Update the sources
      const routeSource = map.current.getSource('route') as mapboxgl.GeoJSONSource;
      const markersSource = map.current.getSource('markers') as mapboxgl.GeoJSONSource;

      if (routeSource) {
        routeSource.setData({
          type: 'FeatureCollection',
          features: [routeGeoJSON]
        });
      }

      if (markersSource) {
        markersSource.setData(markersGeoJSON);
      }

      // Fit bounds to show the entire route
      const bounds = new mapboxgl.LngLatBounds();
      routeGeoJSON.geometry.coordinates.forEach((coord: [number, number]) => {
        bounds.extend(coord);
      });

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 6
      });
    }

    // Update route when map is loaded and coordinates are valid
    if (map.current.isStyleLoaded()) {
      updateRoute();
    } else {
      map.current.on('load', updateRoute);
    }
  }, [parsedFrom, parsedTo]);

  if (
    !isValidCoord(parsedFrom) ||
    !isValidCoord(parsedTo) ||
    (parsedFrom[0] === 0 && parsedFrom[1] === 0 && parsedTo[0] === 0 && parsedTo[1] === 0)
  ) {
    return (
      <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center text-gray-400">
        No route to display
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="w-full h-[400px] rounded-lg"
      style={{ height: '400px' }}
    />
  );
}
