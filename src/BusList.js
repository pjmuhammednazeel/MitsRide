import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export default function BusList() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const snapshot = await getDocs(collection(db, "buses"));
        setBuses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching buses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bus List</h1>
      
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
              <h3 style={{ margin: "0 0 0.5rem 0" }}>{bus.busName}</h3>
              <p style={{ margin: "0.25rem 0" }}><strong>Route:</strong> {bus.route}</p>
              {bus.driver && <p style={{ margin: "0.25rem 0" }}><strong>Driver:</strong> {bus.driver}</p>}
              {bus.capacity && <p style={{ margin: "0.25rem 0" }}><strong>Capacity:</strong> {bus.capacity} passengers</p>}
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
