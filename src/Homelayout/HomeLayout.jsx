import React from "react";
import { Outlet } from "react-router-dom";
import NawaweebNavbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomeLayout() {
  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <NawaweebNavbar />
      
      {/* The <Outlet /> is the most important part. 
         It renders whatever route you are currently on (Shop, Auth, Contact, etc.)
      */}
      <main className="grow">
        <Outlet />
      </main>

      {/* Footer stays at the very bottom of the layout */}
      <Footer />
    </div>
  );
}