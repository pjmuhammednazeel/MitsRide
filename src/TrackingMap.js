// src/TrackingMap.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { database } from "./firebase";
import { ref, onValue } from "firebase/database";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Use a custom icon so we don't depend on default marker assets
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61205.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

function RecenterOnChange({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lng != null) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
}

export default function TrackingMap() {
  const { driverId } = useParams(); // matches /tracking/:driverId
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [driverName, setDriverName] = useState("");
  const [loading, setLoading] = useState(true);

  // Subscribe to driver's record in Realtime DB
  useEffect(() => {
    if (!driverId) return;

    setLoading(true);
    const driverRef = ref(database, `drivers/registered/${driverId}`);
    const unsubscribe = onValue(driverRef, (snap) => {
      const data = snap.val();
      console.log("snapshot:", data); // <-- SEE WHAT WE GET
      if (data) {
        // Check if coordinates are in currentLocation object (new structure)
        let lat, lng;
        if (data.currentLocation && data.currentLocation.latitude && data.currentLocation.longitude) {
          lat = parseFloat(data.currentLocation.latitude);
          lng = parseFloat(data.currentLocation.longitude);
        } else {
          // Fallback to direct properties (old structure)
          lat = parseFloat(data.latitude);
          lng = parseFloat(data.longitude);
        }
        
        setLocation({
          lat: isNaN(lat) ? null : lat,
          lng: isNaN(lng) ? null : lng
        });
        
        // Get driver name from multiple possible locations
        const driverName = data.currentLocation?.driverName ?? data.driverName ?? data.name ?? data.driverUsername ?? "Driver";
        setDriverName(driverName);
      } else {
        setLocation({ lat: null, lng: null });
        setDriverName("");
      }
      setLoading(false);
    }, (err) => {
      console.error("firebase onValue error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [driverId]);

  const defaultCenter = [10.0227586, 76.5617924]; // your sample coordinates

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div style={{
        padding: "10px 16px",
        background: "#fff",
        borderBottom: "1px solid #eee",
        display: "flex",
        gap: "12px",
        alignItems: "center"
      }}>
        <h3 style={{ margin: 0 }}>Tracking: {driverName || driverId}</h3>
        <div style={{ color: "#666", fontSize: 14 }}>
          {loading ? "Connecting…" : (location.lat && location.lng ? `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}` : "Location not available")}
        </div>
      </div>

      <MapContainer
        center={location.lat && location.lng ? [location.lat, location.lng] : defaultCenter}
        zoom={15}
        style={{ height: "calc(100% - 58px)", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Recenter map whenever coordinates change */}
        <RecenterOnChange lat={location.lat} lng={location.lng} />

        {/* Show marker if coordinates available */}
        {location.lat != null && location.lng != null && (
          <Marker position={[location.lat, location.lng]} icon={busIcon}>
            <Popup>
              {driverName || driverId}
              <br />
              {`Lat: ${location.lat.toFixed(6)}`}
              <br />
              {`Lng: ${location.lng.toFixed(6)}`}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
