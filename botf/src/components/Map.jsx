import { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { getAllProperties } from "../utils/api";
import axios from "axios";

const Map = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]); // Store property markers
  const [center, setCenter] = useState({
    lat: 41.7151, // Latitude for Tbilisi, Georgia
    lng: 44.8271, // Longitude for Tbilisi, Georgia
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBgM-qPtgGcDc1VqDzDCDAcjQzuieT7Afo", // Replace with your API key
  });

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
                lat,
                lng,
                addressURL: property.addressURL,
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
    console.log(`Marker clicked with ID: ${id}`);
  };

  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const onLoad = useCallback((mapInstance) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    mapInstance.fitBounds(bounds);
    setMap(mapInstance);
  }, [center]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Plot markers on the map */}
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={marker.addressURL}
          onClick={() => handleMarkerClick(marker.id)}
        />
      ))}
    </GoogleMap>
  );
};

export default Map;
