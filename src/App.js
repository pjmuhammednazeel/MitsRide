import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import BusList from "./BusList";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import MapView from "./MapView";
import DriverRegistration from "./DriverRegistration";
import LiveTracking from "./LiveTracking";
import Instructions from "./Instructions";
import FirebaseTest from "./FirebaseTest";

function Home() {
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
        <Link to="/buses">
          <button className="track-btn">Track Buses</button>
        </Link>
                <Link to="/live-tracking">
          <button className="track-btn">Live Tracking</button>
        </Link>
        <Link to="/login">
          <button className="track-btn" style={{ marginLeft: "10px" }}>
            Admin Login
          </button>
        </Link>
        <Link to="/instructions">
          <button className="track-btn" style={{ marginLeft: "10px", backgroundColor: "#17a2b8" }}>
            📋 View New Features
          </button>
        </Link>
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
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} /> {/* Admin Dashboard */}
        <Route path="/buses" element={<BusList />} /> {/* Bus List for guests */}
        <Route path="/map/:busId/:busName" element={<MapView />} /> {/* Live Location Map */}
        <Route path="/driver-registration" element={<DriverRegistration />} /> {/* Driver Registration */}
        <Route path="/live-tracking" element={<LiveTracking />} /> {/* Live Tracking Dashboard */}
        <Route path="/instructions" element={<Instructions />} /> {/* Instructions Page */}
        <Route path="/firebase-test" element={<FirebaseTest />} /> {/* Firebase Test */}
      </Routes>
    </Router>
  );
}
