import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

import "../styles/Patient/PatientLayout.css";

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