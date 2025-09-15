import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import BusList from "./BusList";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";

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
        <Link to="/login">
          <button className="track-btn" style={{ marginLeft: "10px" }}>
            Admin Login
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
      </Routes>
    </Router>
  );
}
