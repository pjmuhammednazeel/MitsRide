import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { database } from "./firebase";
import { ref, get } from "firebase/database";

export default function DriverList() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    fetchBuses();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
              drivers: []
            };
          }
          
          busesMap[busNumber].drivers.push({
            id: driverId,
            name: driver.name || driver.driverName,
            username: driver.username,
            phone: driver.phone,
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

  return (
    <div style={{ 
      padding: isMobile ? "1rem" : "2rem", 
      maxWidth: "1200px", 
      margin: "auto" 
    }}>
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
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? "0.5rem" : "0"
          }}>
            <span style={{ fontWeight: "bold", color: "#495057" }}>
              Total Buses: {buses.filter(b => b.busNumber !== "Unassigned").length}
            </span>
            <span style={{ color: "#6c757d", fontSize: "14px" }}>
              Total Drivers: {buses.reduce((total, bus) => total + bus.drivers.length, 0)}
            </span>
          </div>

          <div style={{ display: "grid", gap: "2rem" }}>
            {buses.map((bus, index) => (
              <div key={bus.busNumber + index} style={{ 
                border: "2px solid #dee2e6", 
                borderRadius: "15px",
                backgroundColor: "#fff",
                borderLeftColor: "#007bff",
                borderLeftWidth: "6px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}>
                {/* Bus Header Section */}
                <div style={{ 
                  display: "flex", 
                  flexDirection: isMobile ? "column" : "row",
                  gap: "1rem",
                  padding: "1rem"
                }}>
                  {/* Bus Photo */}
                  <div style={{ 
                    width: isMobile ? "100%" : "200px", 
                    height: isMobile ? "180px" : "120px", 
                    backgroundColor: "#f8f9fa",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #dee2e6",
                    overflow: "hidden",
                    flexShrink: 0
                  }}>
                    {bus.busPhoto && bus.busPhoto !== "/default-bus.jpg" ? (
                      <img 
                        src={bus.busPhoto} 
                        alt={`Bus ${bus.busNumber}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          cursor: "pointer",
                          transition: "transform 0.3s ease, opacity 0.3s ease",
                          borderRadius: "8px"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.05)";
                          e.target.style.opacity = "0.8";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e.target.style.opacity = "1";
                        }}
                        onClick={() => {
                          // Create a modal-like overlay for better image viewing
                          const overlay = document.createElement('div');
                          overlay.style.cssText = `
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0,0,0,0.9);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            z-index: 10000;
                            cursor: pointer;
                          `;
                          
                          const img = document.createElement('img');
                          img.src = bus.busPhoto;
                          img.style.cssText = `
                            max-width: 90%;
                            max-height: 90%;
                            object-fit: contain;
                            border-radius: 8px;
                            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                          `;
                          
                          const closeText = document.createElement('div');
                          closeText.innerHTML = '× Click anywhere to close';
                          closeText.style.cssText = `
                            position: absolute;
                            top: 20px;
                            right: 20px;
                            color: white;
                            font-size: 20px;
                            font-weight: bold;
                            background: rgba(0,0,0,0.5);
                            padding: 10px 15px;
                            border-radius: 5px;
                          `;
                          
                          overlay.appendChild(img);
                          overlay.appendChild(closeText);
                          document.body.appendChild(overlay);
                          
                          overlay.onclick = () => document.body.removeChild(overlay);
                          
                          // Close on escape key
                          const handleEscape = (e) => {
                            if (e.key === 'Escape') {
                              document.body.removeChild(overlay);
                              document.removeEventListener('keydown', handleEscape);
                            }
                          };
                          document.addEventListener('keydown', handleEscape);
                        }}
                        title="🖼️ Click to view full size image"
                      />
                    ) : (
                      <div style={{ textAlign: "center", color: "#6c757d" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🚌</div>
                        <div style={{ fontSize: "12px" }}>No Photo</div>
                        <div style={{ fontSize: "10px" }}>Available</div>
                      </div>
                    )}
                  </div>

                  {/* Bus Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "1rem", 
                      marginBottom: "1rem",
                      flexWrap: "wrap"
                    }}>
                      <h2 style={{ 
                        margin: "0", 
                        color: "#333",
                        fontSize: isMobile ? "1.3rem" : "1.5rem"
                      }}>
                        Bus {bus.busNumber}
                      </h2>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <div>
                        <p style={{ margin: "0", display: "flex", alignItems: "flex-start", gap: "0.5rem", flexWrap: "wrap" }}>
                          <span style={{ fontWeight: "bold", color: "#495057", minWidth: "60px" }}>🗺️ Route:</span>
                          <span style={{ color: "#007bff", flex: 1, wordBreak: "break-word" }}>{bus.route}</span>
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: "0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: "bold", color: "#495057" }}>👨‍💼 Drivers:</span>
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
                          display: "flex",
                          flexDirection: isMobile ? "column" : "row",
                          gap: "1rem",
                          alignItems: isMobile ? "stretch" : "center"
                        }}>
                          <div style={{ flex: isMobile ? "none" : "1" }}>
                            <div style={{ fontWeight: "bold", color: "#333", marginBottom: "0.25rem" }}>
                              {driver.name}
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#6c757d", fontFamily: "monospace" }}>
                              @{driver.username}
                            </div>
                          </div>
                          
                          <div style={{ flex: isMobile ? "none" : "1" }}>
                            {driver.phone && (
                              <div style={{ fontSize: "0.9rem", color: "#6c757d", marginBottom: "0.25rem" }}>
                                📞 {driver.phone}
                              </div>
                            )}
                            <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                              Registered: {formatDate(driver.registeredDate)}
                            </div>
                          </div>
                          
                          <div style={{ 
                            textAlign: isMobile ? "center" : "right",
                            marginTop: isMobile ? "0.5rem" : "0"
                          }}>
                            {/* Tracking button */}
                            <div>
                              <Link to={`/tracking/${driver.id}`}>
                                <button style={{
                                  padding: "6px 10px",
                                  backgroundColor: "#007bff",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "0.9rem"
                                }}>
                                  Tracking
                                </button>
                              </Link>
                            </div>
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
