import React from "react";
import { Outlet } from "react-router-dom";

import "../styles/Patient/PatientLayout.css";
import Sidebar from "./Sidebar";

function PatientLayout({ user, onLogout }) {
  return (
    <div className="patient-container">
      <Sidebar onLogout={onLogout} />

      <main className="patient-main">
        <Outlet />
      </main>
    </div>
  );
}

export default PatientLayout;