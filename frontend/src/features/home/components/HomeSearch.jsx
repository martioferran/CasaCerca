import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Replace with your Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapView = ({ areas, center }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-3.703790, 40.416775], // Madrid coordinates
        zoom: 5, // Zoom level to show most of Spain
        minZoom: 3, // Prevent zooming out too far
        maxBounds: [ // Restrict map view around Spain
          [-10.0, 35.0], // Southwest coordinates
          [5.0, 44.0]    // Northeast coordinates
        ]
      });

      map.current.on('load', () => {
        setLoaded(true);
      });
    }
    
    if (!loaded) return;

    // Add source and layers for each area
    areas.forEach((area, index) => {
      const sourceId = `area-source-${index}`;
      const layerId = `area-layer-${index}`;
      const outlineId = `area-outline-${index}`;

      // Convert coordinates to GeoJSON format
      const geojson = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [area.coordinates.map(coord => [coord[1], coord[0]])] // Convert to [lng, lat]
        },
        properties: {
          color: area.color,
          url: area.url
        }
      };

      // Add source if it doesn't exist
      if (!map.current.getSource(sourceId)) {
        map.current.addSource(sourceId, {
          type: 'geojson',
          data: geojson
        });
      } else {
        // Update existing source
        map.current.getSource(sourceId).setData(geojson);
      }

      // Add fill layer if it doesn't exist
      if (!map.current.getLayer(layerId)) {
        map.current.addLayer({
          id: layerId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': ['get', 'color'],
            'fill-opacity': 0.35
          }
        });

        // Add outline layer
        map.current.addLayer({
          id: outlineId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 2
          }
        });

        // Add hover effects
        map.current.on('mouseenter', layerId, () => {
          map.current.setPaintProperty(layerId, 'fill-opacity', 0.6);
          map.current.getCanvas().style.cursor = 'pointer';
        });

        map.current.on('mouseleave', layerId, () => {
          map.current.setPaintProperty(layerId, 'fill-opacity', 0.35);
          map.current.getCanvas().style.cursor = '';
        });

        // Add click handler
        map.current.on('click', layerId, (e) => {
          if (e.features.length > 0) {
            window.open(e.features[0].properties.url, '_blank');
          }
        });
      }
    });

    // Fit bounds to show all areas
    if (areas.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      areas.forEach(area => {
        area.coordinates.forEach(coord => {
          bounds.extend([coord[1], coord[0]]); // [lng, lat]
        });
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }

    // Cleanup function
    return () => {
      areas.forEach((_, index) => {
        const layerId = `area-layer-${index}`;
        const outlineId = `area-outline-${index}`;
        const sourceId = `area-source-${index}`;
        
        if (map.current.getLayer(layerId)) {
          map.current.removeLayer(layerId);
        }
        if (map.current.getLayer(outlineId)) {
          map.current.removeLayer(outlineId);
        }
        if (map.current.getSource(sourceId)) {
          map.current.removeSource(sourceId);
        }
      });
    };
  }, [areas, center, loaded]);

  return (
    <div 
      ref={mapContainer} 
      style={{ 
        width: '100%', 
        height: '500px',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }} 
    />
  );
};

const Services = ({ resultData }) => {
  const openAllAreas = () => {
    const areas = resultData.combined_map?.areas || [];
    areas.forEach(area => {
      window.open(area.url, '_blank');
    });
  };

  if (!resultData || resultData.error) {
    return (
      <div className="max-w-5xl mx-auto px-6 pt-28 lg:py-10">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="text-lg font-semibold mb-4 text-red-500">
            {resultData?.error || "No se encontraron áreas que cumplan con los criterios especificados."}
          </div>
          {resultData?.details && (
            <div className="text-sm text-gray-600 mt-2">
              {resultData.details}
            </div>
          )}
        </div>
      </div>
    );
  }

  const areas = resultData.combined_map?.areas || [];

  if (!areas.length) {
    return (
      <div className="max-w-5xl mx-auto px-6 pt-28 lg:py-10">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="text-lg font-semibold mb-4">
            No se encontraron áreas que cumplan con los criterios especificados.
          </div>
        </div>
      </div>
    );
  }

  // Process areas to include coordinates
  const processedAreas = areas.map((area, index) => ({
    ...area,
    coordinates: resultData.result[index].coordinates
  }));

  return (
    <div className="service-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 lg:py-10">
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
          <div className="space-y-2 mb-6">
            <div className="text-lg font-semibold">
              {`Hemos encontrado ${areas.length} ${areas.length === 1 ? 'área' : 'áreas'} que cumple${areas.length === 1 ? '' : 'n'} tus requisitos`}
            </div>
            <div className="text-sm text-gray-600">
              Haz click en cualquier área del mapa para ver los apartamentos disponibles en esa zona.
            </div>
          </div>

          <div className="mt-4 sm:mt-6 bg-gray-100 shadow-md rounded-lg p-2 sm:p-4">
            <MapView 
              areas={processedAreas}
              center={processedAreas[0]?.coordinates[0]} 
            />
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={openAllAreas}
              className="flex items-center text-white justify-center rounded-full bg-[#1A78F2] px-6 py-3 font-semibold hover:bg-[#1565D8] transition duration-200"
            >
              <span>
                {areas.length === 1 
                  ? "Ver apartamentos disponibles" 
                  : "Ver apartamentos en todas las áreas"}
              </span>
              {areas.length > 1 && (
                <span className="text-sm ml-2 opacity-75">
                  (abrirá {areas.length} pestañas)
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;