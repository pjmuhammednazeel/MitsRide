import React, { useState } from "react";
import DriverLogin from "./DriverLogin";
import DriverApp from "./DriverApp";

export default function DriverMobile() {
  const [driver, setDriver] = useState(null);

  const handleLogin = (driverData) => {
    setDriver(driverData);
  };

  const handleLogout = () => {
    setDriver(null);
  };

  return (
    <div>
      {!driver ? (
        <DriverLogin onLogin={handleLogin} />
      ) : (
        <DriverApp driver={driver} onLogout={handleLogout} />
      )}
    </div>
  );
}
