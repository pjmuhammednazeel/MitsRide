import React, { useState, useEffect } from "react";
import { database } from "./firebase";
import { ref, onValue, off } from "firebase/database";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Create custom bus icon
const busIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZIMjBWNkg0VjE2Wk04IDE4QzcuNDUgMTggNyAxNy41NSA3IDE3UzcuNDUgMTYgOCAxNiA5IDE2LjQ1IDkgMTdTOC41NSAxOCA4IDE4Wk0xNiAxOEMxNS40NSAxOCAxNSAxNy41NSAxNSAxN1MxNS40NSAxNiAxNiAxNiAxNyAxNi40NSAxNyAxN1MxNi41NSAxOCAxNiAxOFpNMjAgNEg0QzIuODkgNCAyIDQuODkgMiA2VjE3QzIgMTguMTEgMi44OSAxOSA0IDE5SDE0VjE3SDIwQzIxLjExIDE3IDIyIDE2LjExIDIyIDE1VjZDMjIgNC44OSAyMS4xMSA0IDIwIDRaIiBmaWxsPSIjMDA3YmZmIi8+Cjwvc3ZnPgo=',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function LiveTracking() {
  const [drivers, setDrivers] = useState({});
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]); // Default to Bangalore

  useEffect(() => {
    // Listen for real-time driver locations
    const driversRef = ref(database, 'drivers');
    
    const unsubscribe = onValue(driversRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const activeDrivers = {};
        
        Object.keys(data).forEach(driverId => {
          if (data[driverId].info && data[driverId].info.status === 'active') {
            // Get latest location
            const locations = data[driverId].locations;
            if (locations) {
              const locationKeys = Object.keys(locations).sort((a, b) => b - a);
              if (locationKeys.length > 0) {
                const latestLocation = locations[locationKeys[0]];
                activeDrivers[driverId] = {
                  ...data[driverId].info,
                  location: latestLocation,
                  lastUpdate: locationKeys[0]
                };
              }
            }
          }
        });
        
        setDrivers(activeDrivers);
        
        // Update map center to first active driver if available
        const driverIds = Object.keys(activeDrivers);
        if (driverIds.length > 0 && activeDrivers[driverIds[0]].location) {
          const firstDriverLocation = activeDrivers[driverIds[0]].location;
          setMapCenter([firstDriverLocation.latitude, firstDriverLocation.longitude]);
        }
      }
      setLoading(false);
    });

    return () => off(driversRef, 'value', unsubscribe);
  }, []);

  const formatLastUpdate = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  };

  const getTimeSinceUpdate = (timestamp) => {
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
        <h1>Live Bus Tracking</h1>
        <Link to="/admin">
          <button style={{
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
            ← Back to Admin
          </button>
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Loading live tracking data...</p>
        </div>
      ) : (
        <div>
          {/* Active Drivers Summary */}
          <div style={{ marginBottom: "2rem" }}>
            <h3>Active Drivers: {Object.keys(drivers).length}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
              {Object.keys(drivers).map(driverId => {
                const driver = drivers[driverId];
                const isRecent = new Date() - new Date(parseInt(driver.lastUpdate)) < 300000; // 5 minutes
                
                return (
                  <div key={driverId} style={{
                    padding: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: isRecent ? "#d4edda" : "#f8f9fa",
                    borderColor: isRecent ? "#c3e6cb" : "#ddd"
                  }}>
                    <h4 style={{ margin: "0 0 0.5rem 0" }}>{driver.name} ({driverId})</h4>
                    {driver.busNumber && <p style={{ margin: "0.25rem 0" }}><strong>Bus:</strong> {driver.busNumber}</p>}
                    {driver.location && (
                      <div>
                        <p style={{ margin: "0.25rem 0" }}>
                          <strong>Location:</strong> {driver.location.latitude.toFixed(6)}, {driver.location.longitude.toFixed(6)}
                        </p>
                        <p style={{ margin: "0.25rem 0" }}>
                          <strong>Speed:</strong> {driver.location.speed ? `${driver.location.speed.toFixed(1)} km/h` : "N/A"}
                        </p>
                      </div>
                    )}
                    <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#666" }}>
                      <strong>Last Update:</strong> {getTimeSinceUpdate(driver.lastUpdate)}
                    </p>
                    <div style={{ 
                      display: "inline-block", 
                      padding: "2px 8px", 
                      borderRadius: "12px", 
                      fontSize: "0.8rem", 
                      backgroundColor: isRecent ? "#28a745" : "#ffc107",
                      color: "white",
                      marginTop: "0.5rem"
                    }}>
                      {isRecent ? "LIVE" : "OFFLINE"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Map */}
          <div style={{ marginBottom: "2rem" }}>
            <h3>Live Map View</h3>
            <div style={{ height: "500px", width: "100%", border: "1px solid #ddd", borderRadius: "8px" }}>
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {Object.keys(drivers).map(driverId => {
                  const driver = drivers[driverId];
                  if (!driver.location) return null;
                  
                  return (
                    <Marker
                      key={driverId}
                      position={[driver.location.latitude, driver.location.longitude]}
                      icon={busIcon}
                    >
                      <Popup>
                        <div>
                          <h4>{driver.name} ({driverId})</h4>
                          {driver.busNumber && <p><strong>Bus:</strong> {driver.busNumber}</p>}
                          <p><strong>Speed:</strong> {driver.location.speed ? `${driver.location.speed.toFixed(1)} km/h` : "N/A"}</p>
                          <p><strong>Last Update:</strong> {formatLastUpdate(driver.lastUpdate)}</p>
                          <p><strong>Accuracy:</strong> {driver.location.accuracy ? `${driver.location.accuracy.toFixed(1)}m` : "N/A"}</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>

          {Object.keys(drivers).length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
              <h3>No Active Drivers</h3>
              <p>No drivers are currently tracking their location. Drivers need to:</p>
              <ol style={{ textAlign: "left", display: "inline-block" }}>
                <li>Be registered in the system</li>
                <li>Login to the mobile app</li>
                <li>Start location tracking</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
