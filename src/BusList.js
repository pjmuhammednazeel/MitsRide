import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllBuses, deleteBus } from "./BusService";

export default function BusList() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const location = useLocation();
  
  // Check if user is accessing from admin route
  const isAdmin = location.pathname === "/admin" || location.pathname.startsWith("/admin");

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const data = await getAllBuses();
      setBuses(data);
    } catch (error) {
      console.error("Error fetching buses:", error);
      setMessage("Error loading buses: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (busId, busName) => {
    if (window.confirm(`Are you sure you want to delete "${busName}"?`)) {
      try {
        await deleteBus(busId);
        setMessage(`"${busName}" deleted successfully!`);
        fetchBuses(); // Refresh the list
      } catch (error) {
        console.error("Error deleting bus:", error);
        setMessage("Error deleting bus: " + error.message);
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bus List</h1>
      
      {message && (
        <p style={{ 
          marginBottom: "20px",
          padding: "10px",
          borderRadius: "4px",
          color: message.includes("Error") ? "red" : "green",
          backgroundColor: message.includes("Error") ? "#f8d7da" : "#d4edda",
          border: `1px solid ${message.includes("Error") ? "#f5c6cb" : "#c3e6cb"}`
        }}>
          {message}
        </p>
      )}
      
      {loading ? (
        <p>Loading buses...</p>
      ) : buses.length > 0 ? (
        <div>
          {buses.map(bus => (
            <div key={bus.id} style={{ 
              marginBottom: "1rem", 
              padding: "1rem", 
              border: "1px solid #ddd", 
              borderRadius: "8px",
              backgroundColor: "#f9f9f9"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>{bus.busName}</h3>
                  <p style={{ margin: "0.25rem 0" }}><strong>Route:</strong> {bus.route}</p>
                  {bus.driverName && <p style={{ margin: "0.25rem 0" }}><strong>Driver:</strong> {bus.driverName}</p>}
                  {bus.driverPhone && <p style={{ margin: "0.25rem 0" }}><strong>Phone:</strong> {bus.driverPhone}</p>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Link to={`/map/${bus.id}/${encodeURIComponent(bus.busName)}`}>
                    <button
                      style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        minWidth: "100px"
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#218838"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "#28a745"}
                    >
                      Live Location
                    </button>
                  </Link>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(bus.id, bus.busName)}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        minWidth: "100px"
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#c82333"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "#dc3545"}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No buses available. Admin can add buses from the dashboard.</p>
      )}
      
      <Link to="/">
        <button style={{ padding: "10px 20px", fontSize: "16px", marginTop: "20px" }}>
          Back Home
        </button>
      </Link>
    </div>
  );
}
