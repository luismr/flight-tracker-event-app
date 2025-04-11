import React, { useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import styled from 'styled-components';
import { FlightEntity } from '../../domain/Flight';

const MapContainer = styled.div`
  width: 100%;
  height: 500px;
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

interface FlightMapProps {
  flights: FlightEntity[];
  apiKey: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 0,
  lng: 0
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: false,
  fullscreenControl: true,
};

export const FlightMap: React.FC<FlightMapProps> = ({ flights, apiKey }) => {
  const mapRef = useRef<google.maps.Map>();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    // If there are flights, fit bounds to show all flights
    if (flights.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      flights.forEach(flight => {
        bounds.extend({ lat: flight.latitude, lng: flight.longitude });
      });
      map.fitBounds(bounds);
    }
  }, [flights]);

  const getFlightIcon = (flight: FlightEntity) => {
    return {
      path: 'M362.985,430.724l-10.248,51.234l62.332,57.969l-3.293,26.145 l-71.345-23.599l-2.001,13.069l-2.057-13.529l-71.278,22.928l-5.762-23.984l64.097-59.271l-8.913-51.359l0.858-114.43 l-21.945-11.338l-189.358,88.76l-1.18-32.262l213.344-180.08l0.875-107.436l7.973-32.005l7.642-12.054l7.377-3.958l9.238,3.65 l6.367,14.925l7.369,30.363v106.375l211.592,182.082l-1.496,32.247l-188.479-90.61l-21.616,10.087l-0.094,115.684',
      fillColor: flight.onGround ? '#666' : '#2ecc71',
      fillOpacity: 0.8,
      strokeWeight: 1,
      strokeColor: '#000',
      rotation: flight.trueTrack || 0,
      scale: 0.05,
      anchor: new google.maps.Point(400, 400)
    };
  };

  if (loadError) {
    return <LoadingContainer>Error loading maps</LoadingContainer>;
  }

  if (!isLoaded) {
    return <LoadingContainer>Loading maps...</LoadingContainer>;
  }

  return (
    <MapContainer>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={3}
        center={defaultCenter}
        options={options}
        onLoad={onMapLoad}
      >
        {flights.map(flight => (
          <Marker
            key={flight.icao24}
            position={{ lat: flight.latitude, lng: flight.longitude }}
            icon={getFlightIcon(flight)}
            title={`${flight.callsign} - ${flight.altitude}ft`}
          />
        ))}
      </GoogleMap>
    </MapContainer>
  );
}; 