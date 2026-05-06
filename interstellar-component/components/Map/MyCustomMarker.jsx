import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import marker from "./marker.svg";
import { Marker, useMap } from "react-leaflet";

const MyCustomMarker = ({ position, children }) => {
  const map = useMap();

  const customIcon = L.icon({
    iconUrl: marker,
    iconSize: [20, 20],
    iconAnchor: [25, 50],
  });

  return (
    <Marker position={position} icon={customIcon}>
      {children}
    </Marker>
  );
};

export default MyCustomMarker;
