import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ position, name }) => (
  // Map container with center position and zoom level
  <MapContainer center={position} zoom={15} style={{ height: '400px', width: '100%' }}>
    
    {/* Map tiles from OpenStreetMap */}
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

    {/* Marker at the restaurant's position */}
    <Marker position={position}>
      {/* Popup shows restaurant name when marker is clicked */}
      <Popup>{name}</Popup>
    </Marker>
  </MapContainer>
);

export default Map;
