import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useAuth } from "./AuthContext";

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
        </div>
        
      </div>
    </div>
  );
}
