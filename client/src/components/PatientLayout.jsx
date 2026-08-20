import React from "react";
import { Outlet } from "react-router-dom";

import "../styles/Patient/Sidebar.css";
import "../styles/Patient/PatientLayout.css";

import Sidebar from "./Sidebar";


function PatientLayout({ user, onLogout }) {
  
 const initials =
    `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`
      .toUpperCase(); 
  return (
    <div className="patient-container">
      {/* Patient Sidebar */}
      <Sidebar onLogout={onLogout} />

      {/* Main Content */}
      <main className="patient-main">
               <div className="patient-profile-badge">
           
          </div>
        

        <Outlet />
      </main>
    </div>
  );
}

export default PatientLayout;