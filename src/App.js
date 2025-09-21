import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import DriverList from "./DriverList";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import MapView from "./MapView";
import DriverRegistration from "./DriverRegistration";
import TrackingMap from "./TrackingMap";
import { AuthProvider, useAuth } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="app">
      <header className="header">
        <div className="logo-area">
          <img src="/mitsride-logo.png" alt="MitsRide logo" className="logo-img" />
          <h1 className="logo-text">MitsRide</h1>
        </div>
        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <h2>Real-Time Bus Tracking System</h2>
        <p>Track your college buses in real time and never miss a ride again!</p>
        
        {/* Conditional buttons based on authentication */}
        {currentUser ? (
          // Admin is logged in - show admin features including bus list
          <>
            <Link to="/driver-list">
              <button className="track-btn">
                📋 Bus List
              </button>
            </Link>
            <Link to="/admin">
              <button className="track-btn" style={{ marginLeft: "10px", backgroundColor: "#28a745" }}>
                📊 Admin Dashboard
              </button>
            </Link>
            <Link to="/driver-registration">
              <button className="track-btn" style={{ marginLeft: "10px", backgroundColor: "#ffc107", color: "#000" }}>
                👨‍💼 Driver Registration
              </button>
            </Link>
          </>
        ) : (
          // Guest user - show bus list and login button
          <>
            <Link to="/driver-list">
              <button className="track-btn">
                📋 Bus List
              </button>
            </Link>
            <Link to="/login">
              <button className="track-btn" style={{ marginLeft: "10px" }}>
                Admin Login
              </button>
            </Link>
          </>
        )}
      </section>

      <section className="about" id="about">
        <h3>About MitsRide</h3>
        <p>
          MitsRide is a smart solution for students and staff to view real-time
          bus locations, estimated arrival times, and route details.
        </p>
      </section>

      <footer className="footer" id="contact">
        <p>Contact us: support@mitsride.com</p>
        <p>© {new Date().getFullYear()} MitsRide</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/driver-list" element={<DriverList />} /> {/* Driver List accessible to all users */}
          <Route path="/map/:busId/:busName" element={<MapView />} /> {/* Live Location Map */}
          <Route path="/driver-registration" element={
            <ProtectedRoute>
              <DriverRegistration />
            </ProtectedRoute>
          } /> {/* Protected Driver Registration */}
          <Route path="/tracking/:driverId" element={<TrackingMap />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
