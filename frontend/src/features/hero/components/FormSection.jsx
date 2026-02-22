import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";

const DEBUG = true;
const debugLog = (label, data) => {
  if (DEBUG) {
    console.log(`%c[DEBUG] ${label}`, 'background: #222; color: #bada55', data);
  }
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
debugLog('API_URL', API_URL);

function FormSection({ onResultData, initialData }) {  // Added initialData parameter
  // Initialize date to next weekday
  const [depDate, setDepDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Skip to Monday if it's Friday or weekend
    const dayOfWeek = tomorrow.getDay(); // 0 = Sunday, 6 = Saturday
    if (dayOfWeek === 6) { // Saturday
      tomorrow.setDate(tomorrow.getDate() + 2);
    } else if (dayOfWeek === 0) { // Sunday
      tomorrow.setDate(tomorrow.getDate() + 1);
    } else if (dayOfWeek === 5) { // Friday
      tomorrow.setDate(tomorrow.getDate() + 3);
    }
    
    return tomorrow.toISOString().split('T')[0];
  });

  // Initialize states with initialData if available
  const [horaSalida, setHoraSalida] = useState(initialData?.horaLlegada || "12:00");
  const [travTime, setTravTime] = useState(initialData?.tiempoMaximo || "");
  const [address, setAddress] = useState(initialData?.direccion || "");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(initialData?.direccion || "");
  const [initialSearchDone, setInitialSearchDone] = useState(false);

  const [areaType, setAreaType] = useState(() => {
    if (initialData?.opcionVivienda === "Compartir Habitacion") return "alquiler-habitacion";
    if (initialData?.opcionVivienda === "Alquiler") return "alquiler-viviendas";
    if (initialData?.opcionVivienda === "Comprar") return "venta-viviendas";
    return "alquiler-habitacion";
  });
  const [transMethod, setTransMethod] = useState(() => {
    switch(initialData?.metodoTransporte) {
      case "walking": return "walking";
      case "driving": return "driving";
      case "public_transport": return "public_transport";
      default: return "cycling";
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  let autocompleteService;
  let geocoder;

  // Initialize Google services
  useEffect(() => {
    if (window.google) {
      autocompleteService = new window.google.maps.places.AutocompleteService();
      geocoder = new window.google.maps.Geocoder();
    }
  }, []);

  // Add useEffect to trigger search if initialData is present
  useEffect(() => {
    if (initialData && 
        initialData.direccion && 
        initialData.tiempoMaximo && 
        !initialSearchDone) { // Only if not already done
      setSelectedAddress(initialData.direccion);
      setInitialSearchDone(true); // Set flag
      getCoordinates();
    }
  }, [initialData, initialSearchDone]); // Add initialSearchDone to dependencies

  const handleDepDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);

    if (selectedDate < today) {
      alert("Por favor seleccione una fecha futura.");
      return;
    }

    if (selectedDate > twoWeeksFromNow) {
      alert("La fecha no puede ser más de dos semanas en el futuro.");
      return;
    }

    setDepDate(e.target.value);
  };

  const handleHoraSalidaChange = (e) => {
    setHoraSalida(e.target.value);
  };

  const handleTravTimeChange = (e) => {
    const value = parseInt(e.target.value);
    
    if (value > 240) {
      alert("El tiempo de viaje no puede ser mayor a 240 minutos.");
    } else {
      setTravTime(e.target.value);
    }
  }; // Added missing closing bracket

  const handleAddressChange = (e) => {
    const inputAddress = e.target.value;
    setAddress(inputAddress);
    if (inputAddress) {
      debouncedGetSuggestions(inputAddress);
    } else {
      setSuggestions([]);
    }
  };

  const handleAreaTypeChange = (e) => setAreaType(e.target.value);
  const handleTransMethodChange = (e) => setTransMethod(e.target.value);

  const initializeGeocoder = () => {
    if (window.google) {
      geocoder = new window.google.maps.Geocoder();
    }
  };

  const getSuggestions = (address) => {
    if (!autocompleteService) return;
    autocompleteService.getPlacePredictions({ input: address }, displaySuggestions);
  };

  const debouncedGetSuggestions = useCallback(
    _.debounce((address) => getSuggestions(address), 300),
    []
  );

  const displaySuggestions = (predictions, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
      setSuggestions(predictions);
    }
  };

  const selectSuggestion = (suggestedAddress) => {
    setSelectedAddress(suggestedAddress);
    setAddress(suggestedAddress);
    setSuggestions([]);
  };

  const getCoordinates = async () => {
    setError(null);
    setIsLoading(true);
    debugLog('Starting search', { selectedAddress, travTime, depDate, horaSalida });

    if (!selectedAddress || !travTime || !depDate || !horaSalida) {
      alert("Por favor complete todos los campos requeridos.");
      setIsLoading(false);
      return;
    }

    const formattedDepTime = new Date(`${depDate}T${horaSalida}`);
    formattedDepTime.setMinutes(formattedDepTime.getMinutes() - parseInt(travTime));
    const isoDepTime = formattedDepTime.toISOString();

    if (!geocoder) initializeGeocoder();

    if (selectedAddress && geocoder) {
      try {
        debugLog('Geocoding address', selectedAddress);
        
        geocoder.geocode({ address: selectedAddress }, async (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK) {
            const location = results[0].geometry.location;
            const latitude = location.lat();
            const longitude = location.lng();
            
            const requestData = {
              latitude: latitude,
              longitude: longitude,
              dep_time: isoDepTime,
              trav_time: parseInt(travTime) * 60,
              trans_method: transMethod,
              area_type: areaType,
            };

            debugLog('Request Data', requestData);

            try {
              debugLog('Fetching from', `${API_URL}/process`);
              
              const response = await fetch(`${API_URL}/process`, {
                method: "POST",
                headers: { 
                  "Content-Type": "application/json",
                  "Accept": "application/json"
                },
                body: JSON.stringify(requestData),
              });

              debugLog('Response status', response.status);
              
              const responseText = await response.text();
              debugLog('Raw response', responseText);

              let responseData;
              try {
                responseData = JSON.parse(responseText);
                debugLog('Parsed response', responseData);
              } catch (parseError) {
                setError('Error al procesar la respuesta del servidor');
                console.error('Parse error', parseError);
                return;
              }

              if (onResultData) {
                debugLog('Calling onResultData with', responseData);
                onResultData(responseData);
              }

            } catch (error) {
              setError('Error al conectar con el servidor');
              console.error('Fetch error', error);
            }
          } else {
            setError('Error al geocodificar la dirección');
            console.error('Geocoding error', status);
          }
          setIsLoading(false);
        });
      } catch (error) {
        setError('Error en el proceso de búsqueda');
        setIsLoading(false);
        console.error('Process error', error);
      }
    }
  };

return (
  <div className="p-5 bg-white border border-slate-500/50 rounded-xl mt-3.5 space-y-6">
    {error && (
      <div className="text-red-500 text-sm mb-4">
        {error}
      </div>
    )}
    
    {/* Address Input */}
    <div className="w-full relative">
      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
        Dirección Destino
      </label>
      <input
        type="text"
        id="address"
        name="address"
        className="w-full rounded-full border border-gray-300 p-4 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6469ff] placeholder:text-slate-500/40 placeholder:font-bold"
        placeholder="Ej.: Calle Gran Vía, 28, Madrid"
        value={address}
        onChange={handleAddressChange}
      />
        <div
          id="suggestions"
          className="absolute bg-white shadow-lg w-full max-h-60 overflow-auto z-50 mt-1 border border-gray-200"
        >
          {suggestions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="suggestion cursor-pointer p-2 border-b hover:bg-gray-200"
              onClick={() => selectSuggestion(prediction.description)}
            >
              {prediction.description}
            </div>
          ))}
        </div>
    </div>

    {/* Other Filters */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {/* Area Type */}
      <div className="col-span-1">
        <label htmlFor="areaType" className="block text-sm font-medium text-gray-700 mb-2">
          Opción de vivienda
        </label>
        <select
          id="areaType"
          name="areaType"
          className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6469ff]"
          value={areaType}
          onChange={handleAreaTypeChange}
        >
          <option value="alquiler-habitacion">Compartir Habitación</option>
          <option value="alquiler-viviendas">Alquiler</option>
          <option value="venta-viviendas">Comprar</option>
        </select>
      </div>

      {/* Departure Date */}
      <div className="col-span-1">
        <label htmlFor="depTime" className="block text-sm font-medium text-gray-700 mb-2">
          Hora de llegada
        </label>
        <input
          type="time"
          id="depTime"
          name="depTime"
          className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6469ff]"
          value={horaSalida}
          onChange={handleHoraSalidaChange}
        />
      </div>

      {/* Travel Time */}
      <div className="col-span-1">
        <label htmlFor="travTime" className="block text-sm font-medium text-gray-700 mb-2">
          Tiempo de viaje máximo
        </label>
        <input
          type="number"
          id="travTime"
          name="travTime"
          className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6469ff]"
          placeholder="Tiempo de viaje (minutos)"
          value={travTime}
          onChange={handleTravTimeChange}
        />
      </div>

      {/* Transport Method */}
      <div className="col-span-1">
        <label htmlFor="transMethod" className="block text-sm font-medium text-gray-700 mb-2">
          Medio de transporte
        </label>
        <select
          id="transMethod"
          name="transMethod"
          className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6469ff]"
          value={transMethod}
          onChange={handleTransMethodChange}
        >
          <option value="cycling">En bicicleta</option>
          <option value="driving">En coche</option>
          <option value="public_transport">Transporte público</option>
          <option value="walking">A pie</option>
          <option value="bus">En bus</option>
          <option value="train">En tren</option>
        </select>
      </div>
    </div>

    {/* Get Coordinates Button */}
    <div className="flex justify-center">
      <button
        onClick={getCoordinates}
        disabled={isLoading}
        className={`flex items-center text-white justify-center rounded-full bg-[#1A78F2] px-6 py-3 font-semibold hover:shadow-lg hover:drop-shadow transition duration-200 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span>{isLoading ? 'Buscando...' : 'Buscar'}</span>
      </button>
    </div>
  </div>
);
}

export default FormSection;