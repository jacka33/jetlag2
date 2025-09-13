'use client';
import DeckGL from "@deck.gl/react";
import Map from 'react-map-gl/mapbox';
import { ArcLayer } from "@deck.gl/layers";

function isValidCoord(coord) {
  return (
    Array.isArray(coord) &&
    coord.length === 2 &&
    typeof coord[0] === 'number' &&
    typeof coord[1] === 'number' &&
    !isNaN(coord[0]) &&
    !isNaN(coord[1]) &&
    // Optionally, check for valid longitude/latitude ranges:
    coord[0] >= -180 && coord[0] <= 180 &&
    coord[1] >= -90 && coord[1] <= 90
  );
}

export default function MapArcs({ from, to }) {

  if (!isValidCoord(from) || !isValidCoord(to) || (from[0] === 0 && from[1] === 0 && to[0] === 0 && to[1] === 0)) {
    return <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center text-gray-400">No route to display</div>;
  }

  const data = [{
    source: from,
    target: to
  }];

  const layers = [
    new ArcLayer({
      id: "arc-layer",
      data,
      getSourcePosition: d => d.source,
      getTargetPosition: d => d.target,
      getSourceColor: [255, 0, 128],
      getTargetColor: [255, 0, 128],
      strokeWidth: 10,
      greatCircle: true,
      getHeight: () => 0
    })
  ];

  return (
    <DeckGL
      initialViewState={{
        longitude: (from[0] + to[0]) / 2,
        latitude: (from[1] + to[1]) / 2,
        zoom: 0,
      }}
      controller={true}
      layers={layers}
      style={{ width: "100%", height: 400, position: "relative" }}
    >
      <Map
        mapStyle="mapbox://styles/jack380/cmfiqdzmn004001sbcrt6cf5m"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      />
    </DeckGL>
  );
}