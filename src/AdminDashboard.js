import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useAuth } from "./AuthContext";
import BusList from "./BusList";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      {/* Header with user info and logout */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "2rem",
        padding: "1rem",
        backgroundColor: "#e9ecef",
        borderRadius: "8px"
      }}>
        <div>
          <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
            Welcome, {currentUser?.email || "Administrator"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          🚪 Logout
        </button>
      </div>

      <p>Manage your bus tracking system from here:</p>
      
      {/* Driver Management Section */}
      <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #dee2e6" }}>
        <h3 style={{ marginTop: 0, color: "#28a745" }}>🚌 Driver & Tracking Management</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginTop: "1rem" }}>
          <Link to="/driver-registration" style={{ textDecoration: "none" }}>
            <button style={{ 
              padding: "15px 20px", 
              width: "100%",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "background-color 0.3s"
            }}>
              👨‍💼 Manage Drivers
            </button>
          </Link>
          <Link to="/live-tracking" style={{ textDecoration: "none" }}>
            <button style={{ 
              padding: "15px 20px", 
              width: "100%",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "background-color 0.3s"
            }}>
              📍 Live Tracking
            </button>
          </Link>
          <Link to="/instructions" style={{ textDecoration: "none" }}>
            <button style={{ 
              padding: "15px 20px", 
              width: "100%",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "background-color 0.3s"
            }}>
              📋 Instructions
            </button>
          </Link>
        </div>
        <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#e7f3ff", borderRadius: "4px", border: "1px solid #b3d7ff" }}>
          <h4 style={{ margin: "0 0 0.5rem 0", color: "#0066cc" }}>How to Use:</h4>
          <ol style={{ margin: 0, paddingLeft: "1.2rem" }}>
            <li>Register drivers with username & password</li>
            <li>Share credentials with authorized drivers</li>
            <li>Monitor real-time locations via Live Tracking</li>
            <li>Check Instructions for detailed setup guide</li>
          </ol>
        </div>
      </div>
      
      {/* Bus List Section */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Current Bus List</h3>
        <BusList />
      </div>
      
      <Link to="/buses" style={{ textDecoration: "none" }}>
        <button style={{ 
          padding: "12px 20px", 
          marginTop: "20px", 
          width: "100%",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px"
        }}>
          🔍 View Public Bus List
        </button>
      </Link>
    </div>
  );
}
