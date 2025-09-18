import React, { useState } from "react";
import { database } from "./firebase";
import { ref, get } from "firebase/database";

export default function DriverLogin({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log("Attempting login for username:", credentials.username);

      // First, get the driver ID from username mapping
      const usernameRef = ref(database, `drivers/usernames/${credentials.username}`);
      const usernameSnapshot = await get(usernameRef);

      if (!usernameSnapshot.exists()) {
        setMessage("❌ Username not found!");
        setLoading(false);
        return;
      }

      const driverId = usernameSnapshot.val();
      console.log("Found driver ID:", driverId);

      // Get driver details
      const driverRef = ref(database, `drivers/registered/${driverId}`);
      const driverSnapshot = await get(driverRef);

      if (!driverSnapshot.exists()) {
        setMessage("❌ Driver account not found!");
        setLoading(false);
        return;
      }

      const driverData = driverSnapshot.val();
      console.log("Driver data:", driverData);

      // Verify password
      if (driverData.password !== credentials.password) {
        setMessage("❌ Incorrect password!");
        setLoading(false);
        return;
      }

      // Check if driver is active
      if (!driverData.isActive) {
        setMessage("❌ Your account is deactivated. Contact admin.");
        setLoading(false);
        return;
      }

      setMessage("✅ Login successful!");
      console.log("Login successful for driver:", driverData.name);

      // Pass driver info to parent component
      onLogin({
        driverId: driverId,
        name: driverData.name,
        busNumber: driverData.busNumber,
        phone: driverData.phone,
        username: credentials.username
      });

    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f0f2f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ color: "#1877f2", marginBottom: "0.5rem" }}>MitsRide</h1>
          <h2 style={{ color: "#333", fontWeight: "normal" }}>Driver Login</h2>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              style={{
                width: "100%",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              style={{
                width: "100%",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: loading ? "#ccc" : "#1877f2",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: "1rem",
            padding: "1rem",
            borderRadius: "8px",
            backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da",
            border: `1px solid ${message.includes("✅") ? "#c3e6cb" : "#f5c6cb"}`,
            color: message.includes("✅") ? "#155724" : "#721c24"
          }}>
            {message}
          </div>
        )}

        <div style={{
          textAlign: "center",
          marginTop: "2rem",
          fontSize: "14px",
          color: "#666"
        }}>
          Use the username and password provided by your admin
        </div>
      </div>
    </div>
  );
}
