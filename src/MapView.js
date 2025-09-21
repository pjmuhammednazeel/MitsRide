import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link, useParams } from "react-router-dom";
import { database } from "./firebase";
import { ref, onValue, off } from "firebase/database";
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
  const [busLocation, setBusLocation] = useState([12.9716, 77.5946]); // Default to Bangalore
  const [driverInfo, setDriverInfo] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Try to find driver/bus by busId (which could be driver ID or bus number)
    const driversRef = ref(database, 'drivers');
    
    const unsubscribe = onValue(driversRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let foundDriver = null;
        let foundLocation = null;
        
        // Search for driver by ID or bus number
        Object.keys(data).forEach(driverId => {
          const driver = data[driverId];
          if (driverId === busId || 
              (driver.info && driver.info.busNumber === busName) ||
              (driver.info && driver.info.name === decodeURIComponent(busName))) {
            
            foundDriver = driver.info;
            
            // Get latest location
            if (driver.locations) {
              const locationKeys = Object.keys(driver.locations).sort((a, b) => b - a);
              if (locationKeys.length > 0) {
                foundLocation = driver.locations[locationKeys[0]];
                setLastUpdate(locationKeys[0]);
              }
            }
          }
        });
        
        if (foundDriver) {
          setDriverInfo(foundDriver);
        }
        
        if (foundLocation) {
          setBusLocation([foundLocation.latitude, foundLocation.longitude]);
        }
      }
      setLoading(false);
    });

    return () => off(driversRef, 'value', unsubscribe);
  }, [busId, busName]);

  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return "No data";
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  };

  const getTimeSinceUpdate = (timestamp) => {
    if (!timestamp) return "No data";
    const now = new Date();
    const updateTime = new Date(parseInt(timestamp));
    const diffMs = now - updateTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Live Location: {decodeURIComponent(busName || "Bus")}</h2>
        <Link to="/driver-list">
          <button style={{
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
            Back to Driver List
          </button>
        </Link>
      </div>

      {/* Driver Info Panel */}
      {driverInfo && (
        <div style={{ 
          marginBottom: "1rem", 
          padding: "1rem", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "8px",
          border: "1px solid #ddd"
        }}>
          <h4 style={{ margin: "0 0 0.5rem 0" }}>Driver Information</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div>
              <p style={{ margin: "0.25rem 0" }}><strong>Name:</strong> {driverInfo.name}</p>
              {driverInfo.phone && <p style={{ margin: "0.25rem 0" }}><strong>Phone:</strong> {driverInfo.phone}</p>}
            </div>
            <div>
              {driverInfo.busNumber && <p style={{ margin: "0.25rem 0" }}><strong>Bus Number:</strong> {driverInfo.busNumber}</p>}
              <p style={{ margin: "0.25rem 0" }}><strong>Status:</strong> 
                <span style={{ 
                  color: driverInfo.status === 'active' ? 'green' : 'red',
                  fontWeight: 'bold',
                  marginLeft: '0.5rem'
                }}>
                  {driverInfo.status === 'active' ? 'ACTIVE' : 'OFFLINE'}
                </span>
              </p>
            </div>
            <div>
              <p style={{ margin: "0.25rem 0" }}><strong>Last Update:</strong> {getTimeSinceUpdate(lastUpdate)}</p>
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#666" }}>
                {formatLastUpdate(lastUpdate)}
              </p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Loading location data...</p>
        </div>
      ) : (
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
                  <h4>{decodeURIComponent(busName || "Bus")}</h4>
                  {driverInfo && (
                    <div>
                      <p><strong>Driver:</strong> {driverInfo.name}</p>
                      {driverInfo.busNumber && <p><strong>Bus:</strong> {driverInfo.busNumber}</p>}
                      <p><strong>Last Update:</strong> {getTimeSinceUpdate(lastUpdate)}</p>
                    </div>
                  )}
                  <p><strong>Coordinates:</strong><br/>
                    {busLocation[0].toFixed(6)}, {busLocation[1].toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {!driverInfo && !loading && (
        <div style={{ 
          textAlign: "center", 
          padding: "2rem", 
          backgroundColor: "#fff3cd", 
          borderRadius: "8px",
          border: "1px solid #ffeaa7",
          marginTop: "1rem"
        }}>
          <h4>No Real-time Data Available</h4>
          <p>This bus/driver is not currently tracking location or may not be registered in the system.</p>
          <p>Contact the administrator to ensure the driver is registered and using the mobile tracking app.</p>
        </div>
      )}
    </div>
  );
}