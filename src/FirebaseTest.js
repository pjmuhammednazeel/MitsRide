import React, { useState } from "react";
import { database } from "./firebase";
import { ref, set, get, child, push } from "firebase/database";

export default function FirebaseTest() {
  const [message, setMessage] = useState("");
  const [testData, setTestData] = useState("");

  const testBasicConnection = async () => {
    try {
      setMessage("Testing basic Firebase connection...");
      console.log("Database instance:", database);
      console.log("Database app:", database.app);
      
      // Test if we can create a reference (this validates the database connection)
      const testRef = ref(database, 'connectionTest');
      console.log("Successfully created database reference:", testRef);
      
      setMessage("✅ Firebase initialized successfully!");
      console.log("Firebase basic connection test passed");
    } catch (error) {
      console.error("Basic connection error:", error);
      setMessage(`❌ Firebase initialization error: ${error.message}`);
    }
  };

  const testSimpleAccess = async () => {
    try {
      setMessage("Testing simple database access...");
      console.log("Starting simple database test...");
      
      // Try a very simple write first
      const simpleRef = ref(database, 'simpleTest');
      console.log("Created reference for simple test");
      
      await set(simpleRef, "Hello Firebase!");
      console.log("Simple write successful");
      
      // Try to read it back
      const snapshot = await get(simpleRef);
      if (snapshot.exists()) {
        const value = snapshot.val();
        console.log("Simple read successful:", value);
        setTestData(`Simple test value: ${value}`);
        setMessage("✅ Simple Firebase access successful!");
      } else {
        setMessage("❌ Write succeeded but read failed");
      }
    } catch (error) {
      console.error("Simple access error:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      if (error.code === 'PERMISSION_DENIED') {
        setMessage("❌ Permission denied - You need to update Firebase Security Rules!");
      } else {
        setMessage(`❌ Error: ${error.code || 'Unknown'} - ${error.message}`);
      }
    }
  };

  const testDatabaseAccess = async () => {
    try {
      setMessage("Testing database read/write access...");
      console.log("Starting database access test...");
      
      // Try to read from root first
      console.log("Testing read access...");
      const rootRef = ref(database);
      const testReadRef = child(rootRef, 'test');
      
      // First try a simple read
      const readSnapshot = await get(testReadRef);
      console.log("Read test completed, exists:", readSnapshot.exists());
      
      // Now try a write
      console.log("Testing write access...");
      const testWriteRef = push(child(rootRef, 'test'));
      await set(testWriteRef, {
        timestamp: Date.now(),
        test: "Firebase access test",
        date: new Date().toISOString()
      });
      console.log("Write test completed successfully");
      
      // Try to read what we just wrote
      const verifySnapshot = await get(testWriteRef);
      if (verifySnapshot.exists()) {
        const data = verifySnapshot.val();
        console.log("Verification read successful:", data);
        setTestData(JSON.stringify(data, null, 2));
        setMessage("✅ Firebase database access successful!");
      } else {
        setMessage("❌ Write succeeded but verification read failed");
      }
    } catch (error) {
      console.error("Database access error:", error);
      if (error.code === 'PERMISSION_DENIED') {
        setMessage("❌ Permission denied - Check Firebase Security Rules");
      } else if (error.code === 'NETWORK_ERROR') {
        setMessage("❌ Network error - Check internet connection");
      } else {
        setMessage(`❌ Database error: ${error.code || 'Unknown'} - ${error.message}`);
      }
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h2>Firebase Connection Test</h2>
      
      <div style={{ marginBottom: "1rem" }}>
        <button 
          onClick={testBasicConnection}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          Test Basic Connection
        </button>
        
        <button 
          onClick={testSimpleAccess}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ffc107",
            color: "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          Test Simple Access
        </button>
        
        <button 
          onClick={testDatabaseAccess}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Test Full Database Access
        </button>
      </div>
      
      {message && (
        <div style={{ 
          padding: "10px", 
          marginBottom: "1rem",
          backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da",
          border: `1px solid ${message.includes("✅") ? "#c3e6cb" : "#f5c6cb"}`,
          borderRadius: "4px"
        }}>
          {message}
        </div>
      )}
      
      {testData && (
        <div>
          <h4>Test Data Retrieved:</h4>
          <pre style={{ 
            backgroundColor: "#f8f9fa", 
            padding: "1rem", 
            borderRadius: "4px",
            overflow: "auto",
            fontSize: "12px"
          }}>
            {testData}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: "2rem", fontSize: "14px", color: "#666" }}>
        <h4>Debug Information:</h4>
        <p><strong>Database URL:</strong> https://mitsride-default-rtdb.firebaseio.com/</p>
        <p><strong>Project ID:</strong> mitsride</p>
        <p>Check the browser console (F12) for detailed error logs.</p>
      </div>
    </div>
  );
}
