import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link, useParams } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapView() {
  const { busId, busName } = useParams();
  
  // Demo coordinates (you can replace with real GPS data from your backend)
  const busLocation = [12.9716, 77.5946]; // Bangalore coordinates as example
  
  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Live Location: {decodeURIComponent(busName || "Bus")}</h2>
        <Link to="/buses">
          <button style={{
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
            Back to Bus List
          </button>
        </Link>
      </div>
      
      <div style={{ height: "500px", width: "100%", border: "1px solid #ddd", borderRadius: "8px" }}>
        <MapContainer
          center={busLocation}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={busLocation}>
            <Popup>
              <div>
                <strong>{decodeURIComponent(busName || "Bus")}</strong>
                <br />
                Current Location
                <br />
                <small>Last updated: {new Date().toLocaleTimeString()}</small>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      
      <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
        <h4>Bus Information</h4>
        <p><strong>Bus ID:</strong> {busId}</p>
        <p><strong>Status:</strong> <span style={{ color: "green" }}>Active</span></p>
        <p><strong>Last Update:</strong> {new Date().toLocaleString()}</p>
        <p><small>Note: This is a demo location. In a real system, this would show live GPS coordinates.</small></p>
      </div>
    </div>
  );
}
