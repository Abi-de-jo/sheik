import { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { getAllProperties } from "../utils/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Map = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]); // Store property markers
  const [center, setCenter] = useState({
    lat: 41.6751, // Latitude for Tbilisi, Georgia
    lng: 44.8071, // Longitude for Tbilisi, Georgia
  });
  const [selectedProperty, setSelectedProperty] = useState(null); // State for selected property details

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBgM-qPtgGcDc1VqDzDCDAcjQzuieT7Afo", // Replace with your API key
  });
  const navigate = useNavigate(); // Use navigate for redirection

  // Geocode addresses and prepare markers
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const properties = await getAllProperties();
        console.log("Fetched properties:", properties);

        // Geocode each addressURL
        const geocodePromises = properties.map(async (property) => {
          if (!property.addressURL) return null;

          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                property.addressURL
              )}&key=AIzaSyBgM-qPtgGcDc1VqDzDCDAcjQzuieT7Afo`
            );

            if (response.data.status === "OK") {
              const { lat, lng } = response.data.results[0].geometry.location;
              return {
                id: property.id, // Add the property ID here
                lat,
                lng,
                addressURL: property.addressURL,
                property, // Store the full property object for easy access
              };
            } else {
              console.error(`Geocoding failed for ${property.addressURL}:`, response.data.status);
            }
          } catch (error) {
            console.error(`Error geocoding address ${property.addressURL}:`, error);
          }
          return null;
        });

        // Filter out null results
        const geocodedMarkers = (await Promise.all(geocodePromises)).filter(Boolean);
        setMarkers(geocodedMarkers);
        console.log("Geocoded Markers:", geocodedMarkers);
      } catch (error) {
        console.error("Error fetching or geocoding properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const handleMarkerClick = (id) => {
   
    // Find the property by ID
    const clickedProperty = markers.find((marker) => marker.id === id);
  
    if (clickedProperty) {
      setSelectedProperty(clickedProperty.property); // Set the selected property details
  
      // Pan to the marker's location
      map.panTo({ lat: clickedProperty.lat, lng: clickedProperty.lng });
  
      // Smooth zoom implementation
      let currentZoom = map.getZoom(); // Get the current zoom level
      const targetZoom = 16; // Target zoom level
      const zoomStep = 0.5; // Step to increase zoom
      const zoomInterval = 100; // Interval in milliseconds
  
      const smoothZoom = () => {
        if (currentZoom < targetZoom) {
          currentZoom += zoomStep;
          map.setZoom(currentZoom);
          setTimeout(smoothZoom, zoomInterval);
        }
      };
  
      smoothZoom(); // Start smooth zooming
    }
  };
  
  

  const containerStyle = {
    width: "100%",
    height: "100vh", // Full height of the viewport
  };

  const mapOptions = {
    disableDefaultUI: true, // Disable all default UI controls
    zoomControl: true, // Enable zoom control
    fullscreenControl: false, // Disable fullscreen control
    mapTypeControl: false, // Disable "Map/Satellite" toggle
  };
  

  const onLoad = useCallback(
    (mapInstance) => {
      if (markers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach((marker) => {
          bounds.extend(new window.google.maps.LatLng(marker.lat, marker.lng));
        });
        mapInstance.fitBounds(bounds); // Automatically adjust the zoom to fit all markers
      } else {
        mapInstance.setCenter(center); // Set the default center if no markers are present
        mapInstance.setZoom(12); // Set a reasonable default zoom level
      }
      setMap(mapInstance);
    },
    [center, markers]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      options={mapOptions} // Apply custom options
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Plot markers on the map */}
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={marker.addressURL}
          icon={{
            url: "https://cdn-icons-png.flaticon.com/128/10307/10307931.png", // Replace with your custom icon URL
            scaledSize: new window.google.maps.Size(30, 30), // Adjust icon size
          }}
          onClick={() => handleMarkerClick(marker.id)} // Use the marker's ID
        />
      ))}
    </GoogleMap>

    {/* Display selected property details */}
    {selectedProperty && (
     <div className="absolute top-60 right-24 bg-white p-3 rounded-lg shadow-lg w-[160px] h-auto">
     <button
       className="absolute top-1 right-1 w-[24px] h-[24px] bg-red-500 text-white text-xs rounded-full hover:bg-red-600 flex items-center justify-center"
       onClick={() => setSelectedProperty(null)}
     >
       ×
     </button>
     <h2 className="text-sm font-bold text-center truncate">
       {selectedProperty.title || "No Title"}
     </h2>
     <p className="text-xs text-gray-700 mt-2 truncate">
       <span className="font-semibold text-orange-700">Price:</span> ${selectedProperty.price || "N/A"}
     </p>
     <p className="text-xs text-gray-700 mt-1 truncate">
       <span className="font-semibold text-orange-700">Area:</span> {selectedProperty.area || "N/A"} Sq.mt
     </p>
     <p className="text-xs text-gray-700 mt-1 truncate">
       <span className="font-semibold text-orange-700">Bed:</span> {selectedProperty.rooms  || "N/A"}
        <span className="font-semibold text-orange-700">  Type:</span> {selectedProperty.propertyType || "N/A"}

     </p>
     
     <div
       onClick={() =>
         navigate(`/property-details/${selectedProperty.id}`, {
           state: { property: selectedProperty },
         })
       }
       className="cursor-pointer"
     >
       <img
         src={selectedProperty.images?.[0] || "https://via.placeholder.com/160"}
         alt={selectedProperty.title || "Property"}
         className="w-full h-[80px] object-cover mt-3 rounded"
       />
     </div>
   </div>
   
    )}
  </div>
  );
};

export default Map;
