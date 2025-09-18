import React from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div style={{ 
        padding: "2rem", 
        textAlign: "center", 
        maxWidth: "500px", 
        margin: "auto",
        marginTop: "50px"
      }}>
        <h2 style={{ color: "#dc3545", marginBottom: "1rem" }}>
          🔒 Access Restricted
        </h2>
        <p style={{ 
          fontSize: "18px", 
          marginBottom: "2rem", 
          color: "#666",
          lineHeight: "1.5"
        }}>
          This page is only accessible to authorized administrators. 
          Please log in to access driver registration and management features.
        </p>
        
        <div style={{ 
          padding: "1rem", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "8px", 
          marginBottom: "2rem",
          border: "1px solid #dee2e6"
        }}>
          <h4 style={{ margin: "0 0 0.5rem 0", color: "#495057" }}>
            Available for Everyone:
          </h4>
          <ul style={{ 
            listStyle: "none", 
            padding: "0", 
            margin: "0",
            textAlign: "left"
          }}>
            <li style={{ padding: "0.25rem 0" }}>✅ View live bus locations</li>
            <li style={{ padding: "0.25rem 0" }}>✅ Track individual buses</li>
            <li style={{ padding: "0.25rem 0" }}>✅ Access live tracking dashboard</li>
          </ul>
        </div>

        <div style={{ 
          padding: "1rem", 
          backgroundColor: "#fff3cd", 
          borderRadius: "8px", 
          marginBottom: "2rem",
          border: "1px solid #ffeaa7"
        }}>
          <h4 style={{ margin: "0 0 0.5rem 0", color: "#856404" }}>
            Admin Only Features:
          </h4>
          <ul style={{ 
            listStyle: "none", 
            padding: "0", 
            margin: "0",
            textAlign: "left"
          }}>
            <li style={{ padding: "0.25rem 0" }}>🔒 Driver registration & management</li>
            <li style={{ padding: "0.25rem 0" }}>🔒 Bus registration & deletion</li>
            <li style={{ padding: "0.25rem 0" }}>🔒 System administration</li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/login">
            <button style={{
              padding: "12px 24px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: "pointer",
              textDecoration: "none"
            }}>
              🔑 Admin Login
            </button>
          </Link>
          
          <Link to="/">
            <button style={{
              padding: "12px 24px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: "pointer",
              textDecoration: "none"
            }}>
              🏠 Back Home
            </button>
          </Link>

          <Link to="/buses">
            <button style={{
              padding: "12px 24px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: "pointer",
              textDecoration: "none"
            }}>
              🚌 View Buses
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
