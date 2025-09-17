import React from "react";
import { Link } from "react-router-dom";

export default function Instructions() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <Link to="/admin">
        <button style={{
          padding: "8px 16px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "2rem"
        }}>
          ← Back to Admin Dashboard
        </button>
      </Link>

      <h1>🚌 MitsRide - Multi-Driver GPS Tracking System</h1>
      
      <div style={{ backgroundColor: "#d4edda", padding: "1rem", borderRadius: "8px", margin: "2rem 0", border: "1px solid #c3e6cb" }}>
        <h2>✅ New Features Added Successfully!</h2>
        <p>Your MitsRide system now supports multiple bus drivers with real-time GPS tracking!</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", margin: "2rem 0" }}>
        
        {/* Driver Registration */}
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1.5rem", backgroundColor: "#f8f9fa" }}>
          <h3>👨‍💼 Driver Registration System</h3>
          <ul>
            <li>✅ Admin can register drivers with unique IDs</li>
            <li>✅ Create username and password for each driver</li>
            <li>✅ Manage driver status (active/inactive)</li>
            <li>✅ Store driver details (name, phone, bus number)</li>
          </ul>
          <Link to="/driver-registration">
            <button style={{ 
              padding: "8px 16px", 
              backgroundColor: "#28a745", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer",
              marginTop: "1rem"
            }}>
              Manage Drivers
            </button>
          </Link>
        </div>

        {/* Live Tracking */}
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1.5rem", backgroundColor: "#f8f9fa" }}>
          <h3>📍 Real-time Live Tracking</h3>
          <ul>
            <li>✅ Monitor all active drivers on a map</li>
            <li>✅ See real-time location updates</li>
            <li>✅ Track driver status and last activity</li>
            <li>✅ Live/Offline status indicators</li>
          </ul>
          <Link to="/live-tracking">
            <button style={{ 
              padding: "8px 16px", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer",
              marginTop: "1rem"
            }}>
              View Live Tracking
            </button>
          </Link>
        </div>

        {/* Enhanced Map */}
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1.5rem", backgroundColor: "#f8f9fa" }}>
          <h3>🗺️ Enhanced Individual Maps</h3>
          <ul>
            <li>✅ Real-time location data from Firebase</li>
            <li>✅ Driver information display</li>
            <li>✅ Last update timestamps</li>
            <li>✅ Status indicators (online/offline)</li>
          </ul>
          <Link to="/buses">
            <button style={{ 
              padding: "8px 16px", 
              backgroundColor: "#17a2b8", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer",
              marginTop: "1rem"
            }}>
              View Bus List
            </button>
          </Link>
        </div>

        {/* Firebase Integration */}
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1.5rem", backgroundColor: "#f8f9fa" }}>
          <h3>🔥 Firebase Real-time Database</h3>
          <ul>
            <li>✅ Driver-specific data structure</li>
            <li>✅ Real-time location updates</li>
            <li>✅ Registration code management</li>
            <li>✅ Activity status tracking</li>
          </ul>
          <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "1rem" }}>
            Database structure: <code>drivers/{`{driverId}`}/locations/</code>
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "#fff3cd", padding: "1.5rem", borderRadius: "8px", margin: "2rem 0", border: "1px solid #ffeaa7" }}>
        <h3>📱 Mobile App Integration Required</h3>
        <p>To complete the system, drivers need to use a mobile app that:</p>
        <ol>
          <li><strong>Validates username and password</strong> when logging in</li>
          <li><strong>Tracks GPS location</strong> in real-time</li>
          <li><strong>Sends location data</strong> to Firebase database</li>
          <li><strong>Updates driver status</strong> (active/inactive)</li>
        </ol>
        <p style={{ marginTop: "1rem" }}>
          <strong>Database Path:</strong> Each driver's location data will be stored at:
          <br />
          <code style={{ backgroundColor: "#f8f9fa", padding: "4px", borderRadius: "4px" }}>
            drivers/{`{driverId}`}/locations/{`{timestamp}`}
          </code>
        </p>
      </div>

      <div style={{ backgroundColor: "#d1ecf1", padding: "1.5rem", borderRadius: "8px", margin: "2rem 0", border: "1px solid #bee5eb" }}>
        <h3>🔧 How to Use the System</h3>
        
        <h4>For Administrators:</h4>
        <ol>
          <li>Go to <strong>Driver Registration</strong> to add new drivers</li>
          <li>Create username and password for each driver</li>
          <li>Share the credentials with authorized drivers</li>
          <li>Monitor live tracking from the <strong>Live Tracking</strong> dashboard</li>
          <li>Manage bus information from the <strong>Admin Dashboard</strong></li>
        </ol>

        <h4>For Students/Public:</h4>
        <ol>
          <li>Visit the <strong>Bus List</strong> page</li>
          <li>Click <strong>"Live Location"</strong> on any bus</li>
          <li>View real-time location if driver is tracking</li>
        </ol>

        <h4>For Drivers (Mobile App Required):</h4>
        <ol>
          <li>Download and install the mobile tracking app</li>
          <li>Enter your username and password</li>
          <li>Start location tracking</li>
          <li>Location data automatically syncs to this website</li>
        </ol>
      </div>

      <div style={{ textAlign: "center", margin: "3rem 0" }}>
        <h3>🎉 Your Multi-Driver GPS Tracking System is Ready!</h3>
        <p>All the web components are now in place. The next step is to develop or integrate a mobile app for drivers.</p>
        
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
          <Link to="/driver-registration">
            <button style={{ 
              padding: "12px 24px", 
              backgroundColor: "#28a745", 
              color: "white", 
              border: "none", 
              borderRadius: "6px", 
              cursor: "pointer",
              fontSize: "16px"
            }}>
              Start Managing Drivers
            </button>
          </Link>
          <Link to="/live-tracking">
            <button style={{ 
              padding: "12px 24px", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "6px", 
              cursor: "pointer",
              fontSize: "16px"
            }}>
              View Live Tracking
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
