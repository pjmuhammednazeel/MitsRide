import React, { useState, useEffect } from "react";
import { database } from "./firebase";
import { ref, set, get, remove } from "firebase/database";
import { Link } from "react-router-dom";

export default function DriverRegistration() {
  const [form, setForm] = useState({
    driverId: "",
    driverName: "",
    phone: "",
    busNumber: "",
    route: "",
    username: "",
    password: "",
    busPhoto: ""
  });
  const [message, setMessage] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    loadDrivers();
  }, []);

  // Handle bus photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage("Photo size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setForm({ ...form, busPhoto: base64String });
        setPhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Register new driver
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Form submitted with data:", form);
    
    if (!form.driverId || !form.driverName || !form.username || !form.password) {
      setMessage("Driver ID, Name, Username, and Password are required!");
      console.log("Validation failed - missing required fields");
      return;
    }

    try {
      setMessage("Checking username availability...");
      console.log("Checking if username exists:", form.username);
      
      // Check if username already exists
      const usernameCheck = await get(ref(database, `drivers/usernames/${form.username}`));
      if (usernameCheck.exists()) {
        setMessage("Username already exists! Please choose a different username.");
        console.log("Username already exists");
        return;
      }

      setMessage("Saving driver information...");
      console.log("Saving driver data to Firebase");

      // Save driver info
      await set(ref(database, `drivers/registered/${form.driverId}`), {
        name: form.driverName,
        phone: form.phone,
        busNumber: form.busNumber,
        route: form.route,
        username: form.username,
        password: form.password,
        busPhoto: form.busPhoto || "/default-bus.jpg",
        isActive: true,
        registeredDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString()
      });

      // Save username mapping for quick lookup
      await set(ref(database, `drivers/usernames/${form.username}`), form.driverId);

      setMessage(`Driver ${form.driverName} registered successfully! Username: ${form.username}`);
      console.log("Driver registered successfully");
      setForm({ driverId: "", driverName: "", phone: "", busNumber: "", route: "", username: "", password: "", busPhoto: "" });
      setPhotoPreview("");
      loadDrivers(); // Refresh the list
    } catch (error) {
      setMessage("Error registering driver: " + error.message);
      console.error("Firebase error:", error);
    }
  };

  // Load registered drivers
  const loadDrivers = async () => {
    try {
      const snapshot = await get(ref(database, 'drivers/registered'));
      const driversData = snapshot.val();
      
      if (driversData) {
        const driversList = Object.keys(driversData).map(driverId => ({
          id: driverId,
          ...driversData[driverId]
        }));
        setDrivers(driversList);
      } else {
        setDrivers([]);
      }
    } catch (error) {
      console.error('Error loading drivers:', error);
      setMessage("Error loading drivers: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete driver
  const deleteDriver = async (driverId, username) => {
    if (window.confirm(`Are you sure you want to delete driver ${driverId}?`)) {
      try {
        await remove(ref(database, `drivers/registered/${driverId}`));
        await remove(ref(database, `drivers/usernames/${username}`));
        setMessage(`Driver ${driverId} deleted successfully`);
        loadDrivers();
      } catch (error) {
        setMessage('Error deleting driver: ' + error.message);
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link to="/admin">
          <button style={{
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
            ← Back to Admin Dashboard
          </button>
        </Link>
      </div>

      <h1>Driver Registration</h1>
      
      {/* Registration Form */}
      <div style={{ 
        marginBottom: "3rem", 
        padding: "2rem", 
        border: "1px solid #ddd", 
        borderRadius: "8px",
        backgroundColor: "#f9f9f9"
      }}>
        <h2>Register New Driver</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Driver ID (e.g., D001)"
            value={form.driverId}
            onChange={(e) => setForm({ ...form, driverId: e.target.value })}
            style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
            required
          />
          <input
            type="text"
            placeholder="Driver Name"
            value={form.driverName}
            onChange={(e) => setForm({ ...form, driverName: e.target.value })}
            style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
          />
          <input
            type="text"
            placeholder="Bus Number"
            value={form.busNumber}
            onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
            style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
          />
          <input
            type="text"
            placeholder="Bus Route (e.g., College - Railway Station - Market)"
            value={form.route}
            onChange={(e) => setForm({ ...form, route: e.target.value })}
            style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
          />
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
            required
          />
          
          {/* Bus Photo Upload */}
          <div style={{ margin: "20px 0" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold", 
              color: "#333" 
            }}>
              Bus Photo (Optional):
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ 
                display: "block", 
                margin: "10px 0", 
                padding: "8px", 
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "white"
              }}
            />
            {photoPreview && (
              <div style={{ 
                marginTop: "10px", 
                textAlign: "center",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: "white"
              }}>
                <p style={{ 
                  margin: "0 0 10px 0", 
                  color: "#666", 
                  fontSize: "14px" 
                }}>
                  Photo Preview:
                </p>
                <img 
                  src={photoPreview} 
                  alt="Bus preview" 
                  style={{ 
                    maxWidth: "200px", 
                    maxHeight: "150px", 
                    borderRadius: "6px",
                    objectFit: "cover",
                    border: "1px solid #ddd"
                  }} 
                />
              </div>
            )}
          </div>
          
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              width: "100%",
              marginTop: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Register Driver
          </button>
        </form>
      </div>

      {message && (
        <div style={{
          marginBottom: "20px",
          padding: "10px",
          borderRadius: "4px",
          color: message.includes("Error") ? "red" : "green",
          backgroundColor: message.includes("Error") ? "#f8d7da" : "#d4edda",
          border: `1px solid ${message.includes("Error") ? "#f5c6cb" : "#c3e6cb"}`
        }}>
          {message}
        </div>
      )}

      {/* Registered Drivers List */}
      <div>
        <h2>Registered Drivers</h2>
        {loading ? (
          <p>Loading drivers...</p>
        ) : drivers.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
              <thead>
                <tr style={{ backgroundColor: "#f4f4f4" }}>
                  <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Driver ID</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Phone</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Bus Number</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Bus Photo</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Route</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Username</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Password</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map(driver => (
                  <tr key={driver.id}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{driver.id}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{driver.name}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{driver.phone || "N/A"}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{driver.busNumber || "N/A"}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
                      {driver.busPhoto && driver.busPhoto !== "/default-bus.jpg" ? (
                        <img 
                          src={driver.busPhoto} 
                          alt={`Bus ${driver.busNumber}`}
                          style={{
                            width: "60px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            cursor: "pointer"
                          }}
                          onClick={() => window.open(driver.busPhoto, '_blank')}
                          title="Click to view full size"
                        />
                      ) : (
                        <span style={{ color: "#999", fontSize: "12px" }}>No photo</span>
                      )}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{driver.route || "Route not specified"}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{driver.username}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>••••••••</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      <button
                        onClick={() => deleteDriver(driver.id, driver.username)}
                        style={{
                          padding: "4px 8px",
                          margin: "2px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px"
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No drivers registered yet.</p>
        )}
      </div>
    </div>
  );
}
