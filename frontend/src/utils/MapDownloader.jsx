import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Navbar from '../components/layout/Navbar';

function geoToPixel(lng, lat, bounds, imageWidth, imageHeight) {
  // Get the map bounds
  const west = bounds.getWest();
  const east = bounds.getEast();
  const north = bounds.getNorth();
  const south = bounds.getSouth();
  
  // Calculate ranges
  const lngRange = east - west;
  const latRange = north - south;
  
  // Add padding to prevent edge clipping
  const padding = 20;
  const availableWidth = imageWidth - (2 * padding);
  const availableHeight = imageHeight - (2 * padding);
  
  // Calculate scaled coordinates
  const x = Math.round(((lng - west) / lngRange) * availableWidth) + padding;
  const y = Math.round(((north - lat) / latRange) * availableHeight) + padding;
  
  // Ensure coordinates are within bounds
  return [
    Math.max(padding, Math.min(imageWidth - padding, x)),
    Math.max(padding, Math.min(imageHeight - padding, y))
  ];
}

// Also add this function to help with debugging
function logCoordinateInfo(coords, bounds, imageWidth, imageHeight) {
  console.log('Original Coordinates:', coords);
  const pixelCoords = coords.map(([lng, lat]) => 
    geoToPixel(lng, lat, bounds, imageWidth, imageHeight)
  );
  console.log('Pixel Coordinates:', pixelCoords);
}

function decodePolyline(str) {
  const coordinates = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  const len = str.length;

  while (index < len) {
    let result = 1;
    let shift = 0;
    let b;
    do {
      b = str.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
    lat += ((result & 1) ? ~(result >> 1) : (result >> 1));

    result = 1;
    shift = 0;
    do {
      b = str.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
    lng += ((result & 1) ? ~(result >> 1) : (result >> 1));

    coordinates.push([lng * 1e-5, lat * 1e-5]);
  }
  return coordinates;
}

export const MapDownloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const mapContainer = useRef(null);
  const map = useRef(null);

  const uabCoordinates = [-3.5977355, 37.1834391];
  const IMAGE_WIDTH = 800;
  const IMAGE_HEIGHT = 600;

  useEffect(() => {
    if (!map.current) {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: uabCoordinates,
        zoom: 13,
        preserveDrawingBuffer: true
      });

      new mapboxgl.Marker()
        .setLngLat(uabCoordinates)
        .addTo(map.current);

      map.current.on('load', () => {
        setIsLoading(false);
      });
    }
  }, []);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const departureTime = new Date();
      departureTime.setHours(9, 0, 0, 0); // Set to 9:00 AM

      const requestData = {
        latitude: uabCoordinates[1],
        longitude: uabCoordinates[0],
        dep_time: departureTime.toISOString(),
        trav_time: 30 * 60,
        trans_method: 'walking',
        area_type: 'alquiler-habitacion'
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (map.current && data.combined_map?.areas) {
        // Remove existing layers if any
        if (map.current.getLayer('area-fill')) {
          map.current.removeLayer('area-fill');
          map.current.removeLayer('area-line');
          map.current.removeSource('area');
        }

        // Process areas
        const features = data.combined_map.areas.map(area => {
          const matches = area.url.match(/%28%28(.*?)%29%29/);
          if (!matches) return null;

          const coordsString = decodeURIComponent(matches[1]);
          const coordinates = decodePolyline(coordsString);

          return {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [coordinates]
            },
            properties: {
              color: area.color,
              url: area.url
            }
          };
        }).filter(Boolean);

        // Add to map
        map.current.addSource('area', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: features
          }
        });

        // Add area fills
        map.current.addLayer({
          'id': 'area-fill',
          'type': 'fill',
          'source': 'area',
          'paint': {
            'fill-color': ['get', 'color'],
            'fill-opacity': 0.4,
            'fill-outline-color': '#ffffff'
          }
        });

        // Add area borders
        map.current.addLayer({
          'id': 'area-line',
          'type': 'line',
          'source': 'area',
          'paint': {
            'line-color': ['get', 'color'],
            'line-width': 3,
            'line-opacity': 0.8
          }
        });

        // Fit map to areas
        const bounds = new mapboxgl.LngLatBounds();
        features.forEach(feature => {
          feature.geometry.coordinates[0].forEach(coord => {
            bounds.extend(coord);
          });
        });
        map.current.fitBounds(bounds, { padding: 50 });

        // Wait for the map to finish rendering
        // In handleDownload, modify the HTML generation part:
        setTimeout(() => {
          const mapBounds = map.current.getBounds();
          
          // Generate HTML with exact matching coordinates
          const mapName = `uab-areas-${requestData.trans_method.replace('_', '-')}`;
          const imageFilename = `uab-30min-${requestData.trans_method}.png`;
          
          // Process and log coordinates for debugging
          const processedFeatures = features.map((feature, index) => {
            const geoCoords = feature.geometry.coordinates[0];
            console.log(`Feature ${index} bounds:`, geoCoords);
            
            const pixelCoords = geoCoords
              .map(([lng, lat]) => geoToPixel(lng, lat, mapBounds, IMAGE_WIDTH, IMAGE_HEIGHT));
            
            // Log coordinate transformation for debugging
            logCoordinateInfo(geoCoords, mapBounds, IMAGE_WIDTH, IMAGE_HEIGHT);
            
            return {
              ...feature,
              pixelCoords
            };
          });

          const htmlContent = `<div class="map-container">
        <img src="/images/blog/Maps/${imageFilename}" usemap="#${mapName}" alt="Áreas a 30 minutos ${requestData.trans_method === 'walking' ? 'caminando' : requestData.trans_method === 'public_transport' ? 'en transporte público' : 'en coche'} desde la UAB" width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}"/>
        <map name="${mapName}">
        ${processedFeatures.map((feature, index) => `<area 
          shape="poly" 
          coords="${feature.pixelCoords.map(([x, y]) => `${x},${y}`).join(',')}" 
          href="${feature.properties.url}" 
          alt="Área ${index + 1}" 
          title="Ver pisos en esta zona" 
          target="_blank" 
          rel="noopener noreferrer" 
          style="cursor: pointer;"
        />`).join('\n')}
        </map>
        </div>

        *Zonas accesibles ${requestData.trans_method === 'walking' ? 'a pie' : requestData.trans_method === 'public_transport' ? 'en transporte público' : 'en coche'} desde el campus de la UAB. Haz clic en las áreas coloreadas para ver los pisos disponibles.*`;

          // Save map image
          const canvas = map.current.getCanvas();
          const image = canvas.toDataURL('image/png');
          const imageLink = document.createElement('a');
          imageLink.download = imageFilename;
          imageLink.href = image;
          imageLink.click();

          // Save HTML
          const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
          const htmlLink = document.createElement('a');
          htmlLink.download = 'uab-30min-map.html';
          htmlLink.href = URL.createObjectURL(htmlBlob);
          htmlLink.click();

          setIsLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating the map. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Mapa UAB - 30 minutos en transporte público</h1>
        
        <button 
          onClick={handleDownload}
          disabled={isLoading}
          className="mb-6 flex items-center text-white justify-center rounded-full bg-[#1A78F2] px-6 py-3 font-semibold hover:shadow-lg hover:drop-shadow transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generando...' : 'Generar Mapa'}
        </button>

        <div 
          ref={mapContainer} 
          className="w-full h-[600px] border rounded-lg shadow-lg"
        />
      </div>
    </>
  );
};