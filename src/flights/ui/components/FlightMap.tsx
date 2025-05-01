import React, { useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import styled from 'styled-components';
import { PingDTO } from '../../application/dto/PingDTO';

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
  flights: PingDTO[];
  apiKey: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: -23.5505, // São Paulo
  lng: -46.6333
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
    
    if (flights.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      flights.forEach(flight => {
        const lat = flight.position.latitude;
        const lng = flight.position.longitude;
        if (isFinite(lat) && isFinite(lng)) {
          bounds.extend({ lat, lng });
        }
      });
      
      if (bounds.isEmpty()) {
        map.setCenter(defaultCenter);
        map.setZoom(5);
      } else {
        map.fitBounds(bounds);
      }
    } else {
      map.setCenter(defaultCenter);
      map.setZoom(5);
    }
  }, [flights]);

  const getFlightIcon = (flight: PingDTO) => {
    return {
      path: 'M362.985,430.724l-10.248,51.234l62.332,57.969l-3.293,26.145 l-71.345-23.599l-2.001,13.069l-2.057-13.529l-71.278,22.928l-5.762-23.984l64.097-59.271l-8.913-51.359l0.858-114.43 l-21.945-11.338l-189.358,88.76l-1.18-32.262l213.344-180.08l-0.875-107.436l7.973-32.005l7.642-12.054l7.377-3.958l9.238,3.65 l6.367,14.925l7.369,30.363v106.375l211.592,182.082l-1.496,32.247l-188.479-90.61l-21.616,10.087l-0.094,115.684',
      fillColor: flight.position.on_ground ? '#666' : '#2ecc71',
      fillOpacity: 0.8,
      strokeWeight: 1,
      strokeColor: '#000',
      rotation: flight.vector.true_track || 0,
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
        zoom={5}
        center={defaultCenter}
        options={options}
        onLoad={onMapLoad}
      >
        {flights.filter(flight => 
          flight &&
          flight.position &&
          isFinite(flight.position.latitude) &&
          isFinite(flight.position.longitude)
        ).map(flight => (
          <Marker
            key={flight.aircraft.icao24}
            position={{
              lat: flight.position.latitude,
              lng: flight.position.longitude
            }}
            icon={getFlightIcon(flight)}
            title={`${flight.aircraft.callsign} - ${flight.position.geo_altitude}ft`}
          />
        ))}
      </GoogleMap>
    </MapContainer>
  );
}; 