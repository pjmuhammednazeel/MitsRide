import React from "react";
import { Link } from "react-router-dom";

export default function BusList() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bus List</h1>
      <p>This is where your bus tracking map or bus list will appear.</p>
      <Link to="/">
        <button style={{ padding: "10px 20px", fontSize: "16px" }}>Back Home</button>
      </Link>
    </div>
  );
}
