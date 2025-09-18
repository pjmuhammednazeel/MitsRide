import React, { useState, useEffect } from "react";
import { database } from "./firebase";
import { ref, set } from "firebase/database";

export default function DriverApp({ driver, onLogout }) {
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [message, setMessage] = useState("");
  const [watchId, setWatchId] = useState(null);
  const [stats, setStats] = useState({
    totalUpdates: 0,
    lastUpdate: null,
    accuracy: null
  });

  // Request location permission on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      setMessage("📍 Location service available");
    } else {
      setMessage("❌ Location service not available on this device");
    }
  }, []);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setMessage("❌ Geolocation is not supported by this browser");
      return;
    }

    setMessage("🔄 Starting GPS tracking...");
    setTracking(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000
    };

    const successCallback = async (position) => {
      const { latitude, longitude, accuracy, speed, heading } = position.coords;
      const timestamp = new Date().toISOString();

      const locationData = {
        latitude,
        longitude,
        accuracy,
        speed: speed || 0,
        heading: heading || 0,
        timestamp,
        driverName: driver.name,
        busNumber: driver.busNumber,
        lastSeen: timestamp
      };

      setLocation(locationData);

      try {
        // Save to Firebase under driver's location path
        await set(ref(database, `drivers/locations/${driver.driverId}`), locationData);
        
        // Also save to bus tracking path for easy access
        await set(ref(database, `buses/${driver.busNumber}/currentLocation`), {
          ...locationData,
          driverId: driver.driverId,
          driverName: driver.name
        });

        setStats(prev => ({
          totalUpdates: prev.totalUpdates + 1,
          lastUpdate: timestamp,
          accuracy: accuracy
        }));

        setMessage(`✅ Location updated - Accuracy: ${Math.round(accuracy)}m`);
        console.log("Location sent to Firebase:", locationData);

      } catch (error) {
        console.error("Error saving location:", error);
        setMessage("❌ Failed to send location: " + error.message);
      }
    };

    const errorCallback = (error) => {
      console.error("Geolocation error:", error);
      let errorMessage = "❌ Location error: ";
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += "Location permission denied. Please allow location access.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += "Location information unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage += "Location request timed out.";
          break;
        default:
          errorMessage += "Unknown location error.";
          break;
      }
      
      setMessage(errorMessage);
    };

    // Start watching position
    const id = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      options
    );

    setWatchId(id);
  };

  const stopTracking = async () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    setTracking(false);
    setMessage("⏹️ GPS tracking stopped");

    // Update driver status to offline
    try {
      await set(ref(database, `drivers/locations/${driver.driverId}/isOnline`), false);
      await set(ref(database, `drivers/locations/${driver.driverId}/lastSeen`), new Date().toISOString());
    } catch (error) {
      console.error("Error updating offline status:", error);
    }
  };

  const handleLogout = () => {
    if (tracking) {
      stopTracking();
    }
    onLogout();
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f0f2f5",
      padding: "1rem"
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: "white",
        padding: "1rem",
        borderRadius: "12px",
        marginBottom: "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, color: "#1877f2" }}>MitsRide Driver</h2>
            <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
              Welcome, {driver.name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Driver Info */}
      <div style={{
        backgroundColor: "white",
        padding: "1rem",
        borderRadius: "12px",
        marginBottom: "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{ margin: "0 0 1rem 0" }}>Driver Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <strong>Name:</strong> {driver.name}
          </div>
          <div>
            <strong>Bus Number:</strong> {driver.busNumber}
          </div>
          <div>
            <strong>Driver ID:</strong> {driver.driverId}
          </div>
          <div>
            <strong>Phone:</strong> {driver.phone}
          </div>
        </div>
      </div>

      {/* Tracking Controls */}
      <div style={{
        backgroundColor: "white",
        padding: "1rem",
        borderRadius: "12px",
        marginBottom: "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{ margin: "0 0 1rem 0" }}>GPS Tracking</h3>
        
        <div style={{ marginBottom: "1rem" }}>
          {!tracking ? (
            <button
              onClick={startTracking}
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              🚀 Start GPS Tracking
            </button>
          ) : (
            <button
              onClick={stopTracking}
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              ⏹️ Stop GPS Tracking
            </button>
          )}
        </div>

        {message && (
          <div style={{
            padding: "1rem",
            borderRadius: "8px",
            backgroundColor: message.includes("✅") ? "#d4edda" : 
                           message.includes("❌") ? "#f8d7da" : "#d1ecf1",
            border: `1px solid ${message.includes("✅") ? "#c3e6cb" : 
                                message.includes("❌") ? "#f5c6cb" : "#bee5eb"}`,
            marginBottom: "1rem"
          }}>
            {message}
          </div>
        )}
      </div>

      {/* Location Stats */}
      {location && (
        <div style={{
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "12px",
          marginBottom: "1rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ margin: "0 0 1rem 0" }}>Current Location</h3>
          <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
            <div><strong>Latitude:</strong> {location.latitude.toFixed(6)}</div>
            <div><strong>Longitude:</strong> {location.longitude.toFixed(6)}</div>
            <div><strong>Accuracy:</strong> {Math.round(location.accuracy)} meters</div>
            <div><strong>Speed:</strong> {Math.round((location.speed || 0) * 3.6)} km/h</div>
            <div><strong>Last Update:</strong> {new Date(location.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      )}

      {/* Statistics */}
      {stats.totalUpdates > 0 && (
        <div style={{
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ margin: "0 0 1rem 0" }}>Session Statistics</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "14px" }}>
            <div>
              <strong>Total Updates:</strong> {stats.totalUpdates}
            </div>
            <div>
              <strong>Current Accuracy:</strong> {stats.accuracy ? Math.round(stats.accuracy) + "m" : "N/A"}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        backgroundColor: "#fff3cd",
        border: "1px solid #ffeaa7",
        padding: "1rem",
        borderRadius: "12px",
        marginTop: "1rem",
        fontSize: "14px"
      }}>
        <strong>Instructions:</strong>
        <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1.5rem" }}>
          <li>Make sure location services are enabled</li>
          <li>Keep this app open while driving</li>
          <li>Your location will be shared with passengers</li>
          <li>Contact admin if you face any issues</li>
        </ul>
      </div>
    </div>
  );
}
