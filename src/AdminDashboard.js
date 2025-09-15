import React, { useState } from "react";
import { Link } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function AdminDashboard() {
  const [busName, setBusName] = useState("");
  const [route, setRoute] = useState("");
  const [driver, setDriver] = useState("");
  const [capacity, setCapacity] = useState("");
  const [message, setMessage] = useState("");

  const handleAddBus = async () => {
    if (!busName || !route) {
      setMessage("Bus Name and Route are required!");
      return;
    }
    try {
      await addDoc(collection(db, "buses"), {
        busName,
        route,
        driver,
        capacity: Number(capacity),
        createdAt: new Date()
      });
      setMessage("Bus added successfully!");
      // Clear fields
      setBusName("");
      setRoute("");
      setDriver("");
      setCapacity("");
    } catch (err) {
      setMessage("Error adding bus: " + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
      <h1>Admin Dashboard</h1>
      <p>Add new bus information below:</p>

      <input
        type="text"
        placeholder="Bus Name"
        value={busName}
        onChange={(e) => setBusName(e.target.value)}
        style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
      />
      <input
        type="text"
        placeholder="Route"
        value={route}
        onChange={(e) => setRoute(e.target.value)}
        style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
      />
      <input
        type="text"
        placeholder="Driver Name (optional)"
        value={driver}
        onChange={(e) => setDriver(e.target.value)}
        style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
      />
      <input
        type="number"
        placeholder="Capacity (optional)"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
      />

      <button
        onClick={handleAddBus}
        style={{ padding: "10px 20px", width: "100%", marginTop: "10px" }}
      >
        Add Bus
      </button>

      {message && (
        <p style={{ 
          marginTop: "10px", 
          color: message.includes("Error") ? "red" : "green" 
        }}>
          {message}
        </p>
      )}

      <Link to="/buses">
        <button style={{ 
          padding: "10px 20px", 
          marginTop: "20px", 
          width: "100%",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ccc"
        }}>
          View Bus List
        </button>
      </Link>
    </div>
  );
}
