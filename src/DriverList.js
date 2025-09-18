import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { database } from "./firebase";
import { ref, get } from "firebase/database";

export default function DriverList() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const driversSnapshot = await get(ref(database, 'drivers/registered'));
      
      if (driversSnapshot.exists()) {
        const driversData = driversSnapshot.val();
        // Group drivers by bus number to create bus-focused data
        const busesMap = {};
        
        Object.keys(driversData).forEach(driverId => {
          const driver = driversData[driverId];
          const busNumber = driver.busNumber || "Unassigned";
          
          if (!busesMap[busNumber]) {
            busesMap[busNumber] = {
              busNumber: busNumber,
              route: driver.route || "Route information not available",
              capacity: driver.capacity || "50 passengers",
              busPhoto: driver.busPhoto || "/default-bus.jpg",
              status: driver.isActive ? "Active" : "Inactive",
              drivers: []
            };
          }
          
          busesMap[busNumber].drivers.push({
            id: driverId,
            name: driver.name || driver.driverName,
            username: driver.username,
            phone: driver.phone,
            isActive: driver.isActive,
            registeredDate: driver.registeredDate,
            lastActive: driver.lastActive
          });
        });
        
        const busesList = Object.values(busesMap).sort((a, b) => {
          if (a.busNumber === "Unassigned") return 1;
          if (b.busNumber === "Unassigned") return -1;
          return a.busNumber.localeCompare(b.busNumber);
        });
        
        setBuses(busesList);
      } else {
        setBuses([]);
        setMessage("No buses registered yet.");
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
      setMessage("Error loading buses: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getBusStatusColor = (status) => {
    return status === "Active" ? "#28a745" : "#ffc107";
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#333", marginBottom: "0.5rem" }}>🚌 MitsRide Bus Fleet</h1>
        <p style={{ color: "#666", fontSize: "16px" }}>
          Complete list of all buses in the MitsRide system with their assigned drivers
        </p>
      </div>

      {message && (
        <div style={{ 
          marginBottom: "20px",
          padding: "12px",
          borderRadius: "6px",
          color: message.includes("Error") ? "#721c24" : "#155724",
          backgroundColor: message.includes("Error") ? "#f8d7da" : "#d4edda",
          border: `1px solid ${message.includes("Error") ? "#f5c6cb" : "#c3e6cb"}`
        }}>
          {message}
        </div>
      )}
      
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ fontSize: "18px", color: "#666" }}>Loading bus fleet...</p>
        </div>
      ) : buses.length > 0 ? (
        <div>
          <div style={{ 
            marginBottom: "1.5rem", 
            padding: "1rem", 
            backgroundColor: "#e9ecef", 
            borderRadius: "6px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span style={{ fontWeight: "bold", color: "#495057" }}>
              Total Buses: {buses.filter(b => b.busNumber !== "Unassigned").length}
            </span>
            <span style={{ color: "#6c757d", fontSize: "14px" }}>
              Active: {buses.filter(b => b.status === "Active").length} | 
              Inactive: {buses.filter(b => b.status === "Inactive").length}
            </span>
          </div>

          <div style={{ display: "grid", gap: "2rem" }}>
            {buses.map((bus, index) => (
              <div key={bus.busNumber + index} style={{ 
                border: "2px solid #dee2e6", 
                borderRadius: "15px",
                backgroundColor: "#fff",
                borderLeftColor: getBusStatusColor(bus.status),
                borderLeftWidth: "6px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}>
                {/* Bus Header Section */}
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "200px 1fr", 
                  gap: "1.5rem",
                  padding: "1.5rem"
                }}>
                  {/* Bus Photo */}
                  <div style={{ 
                    width: "200px", 
                    height: "120px", 
                    backgroundColor: "#f8f9fa",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px dashed #dee2e6"
                  }}>
                    <div style={{ textAlign: "center", color: "#6c757d" }}>
                      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🚌</div>
                      <div style={{ fontSize: "12px" }}>Bus Photo</div>
                      <div style={{ fontSize: "10px" }}>Coming Soon</div>
                    </div>
                  </div>

                  {/* Bus Details */}
                  <div>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "1rem", 
                      marginBottom: "1rem" 
                    }}>
                      <h2 style={{ 
                        margin: "0", 
                        color: "#333",
                        fontSize: "1.5rem"
                      }}>
                        Bus {bus.busNumber}
                      </h2>
                      <span style={{
                        fontSize: "0.8rem",
                        padding: "4px 12px",
                        borderRadius: "15px",
                        backgroundColor: getBusStatusColor(bus.status),
                        color: bus.status === "Active" ? "white" : "#000",
                        fontWeight: "bold"
                      }}>
                        {bus.status}
                      </span>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <p style={{ margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: "bold", color: "#495057" }}>🗺️ Route:</span>
                          <span style={{ color: "#007bff" }}>{bus.route}</span>
                        </p>
                        <p style={{ margin: "0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: "bold", color: "#495057" }}>� Capacity:</span>
                          <span style={{ color: "#6c757d" }}>{bus.capacity}</span>
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: "bold", color: "#495057" }}>👨‍� Drivers:</span>
                          <span style={{ color: "#6c757d" }}>{bus.drivers.length} assigned</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Driver Details Section */}
                {bus.drivers.length > 0 && (
                  <div style={{ 
                    backgroundColor: "#f8f9fa", 
                    padding: "1.5rem",
                    borderTop: "1px solid #dee2e6" 
                  }}>
                    <h4 style={{ 
                      margin: "0 0 1rem 0", 
                      color: "#495057",
                      fontSize: "1.1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      👨‍💼 Assigned Drivers
                    </h4>
                    
                    <div style={{ display: "grid", gap: "1rem" }}>
                      {bus.drivers.map(driver => (
                        <div key={driver.id} style={{ 
                          backgroundColor: "white",
                          padding: "1rem",
                          borderRadius: "8px",
                          border: "1px solid #dee2e6",
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: "1rem",
                          alignItems: "center"
                        }}>
                          <div>
                            <div style={{ fontWeight: "bold", color: "#333", marginBottom: "0.25rem" }}>
                              {driver.name}
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#6c757d", fontFamily: "monospace" }}>
                              @{driver.username}
                            </div>
                          </div>
                          
                          <div>
                            {driver.phone && (
                              <div style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                                � {driver.phone}
                              </div>
                            )}
                            <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                              Registered: {formatDate(driver.registeredDate)}
                            </div>
                          </div>
                          
                          <div style={{ textAlign: "right" }}>
                            <span style={{
                              fontSize: "0.75rem",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              backgroundColor: driver.isActive ? "#28a745" : "#ffc107",
                              color: driver.isActive ? "white" : "#000"
                            }}>
                              {driver.isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ 
          textAlign: "center", 
          padding: "3rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
          border: "2px dashed #dee2e6"
        }}>
          <h3 style={{ color: "#6c757d", marginBottom: "1rem" }}>No Buses Available</h3>
          <p style={{ color: "#6c757d", marginBottom: "1.5rem" }}>
            There are currently no buses registered in the system.
          </p>
          <p style={{ color: "#6c757d", fontSize: "14px" }}>
            Contact your administrator to register buses and drivers for the tracking system.
          </p>
        </div>
      )}
      
      <div style={{ marginTop: "3rem", textAlign: "center" }}>
        <Link to="/">
          <button style={{ 
            padding: "12px 24px", 
            fontSize: "16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background-color 0.3s ease"
          }}>
            ← Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
