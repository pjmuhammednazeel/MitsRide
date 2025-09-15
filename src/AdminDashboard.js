import React, { useState } from "react";
import { Link } from "react-router-dom";
import { addBus } from "./BusService";
import BusList from "./BusList";

export default function AdminDashboard() {
  const [form, setForm] = useState({
    busName: "",
    route: "",
    driverName: "",
    driverPhone: "",
  });
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.busName || !form.route) {
      setMessage("Bus Name and Route are required!");
      return;
    }
    try {
      await addBus({
        ...form,
        createdAt: new Date()
      });
      setForm({ busName: "", route: "", driverName: "", driverPhone: "" });
      setMessage("Bus added successfully!");
    } catch (error) {
      setMessage("Error adding bus: " + error.message);
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h1>Admin Dashboard</h1>
      <p>Add new bus information below:</p>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          placeholder="Bus Name"
          value={form.busName}
          onChange={(e) => setForm({ ...form, busName: e.target.value })}
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
          required
        />
        <input
          placeholder="Route"
          value={form.route}
          onChange={(e) => setForm({ ...form, route: e.target.value })}
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
          required
        />
        <input
          placeholder="Driver Name"
          value={form.driverName}
          onChange={(e) => setForm({ ...form, driverName: e.target.value })}
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
        />
        <input
          placeholder="Driver Phone"
          value={form.driverPhone}
          onChange={(e) => setForm({ ...form, driverPhone: e.target.value })}
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
        />
        <button 
          type="submit"
          style={{ 
            padding: "10px 20px", 
            width: "100%", 
            marginTop: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Add Bus
        </button>
      </form>
      {message && (
        <p style={{ 
          marginTop: "10px", 
          color: message.includes("Error") ? "red" : "green" 
        }}>
          {message}
        </p>
      )}
      
      <BusList />
      
      <Link to="/buses">
        <button style={{ 
          padding: "10px 20px", 
          marginTop: "20px", 
          width: "100%",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ccc"
        }}>
          View Public Bus List
        </button>
      </Link>
    </div>
  );
}
