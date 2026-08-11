import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function PublicLayout({ user, onLogout }) {
  return (
    <>
      <Navbar user={user} onLogout={onLogout} />

      <Outlet />

      <Footer />
    </>
  );
}

export default PublicLayout;