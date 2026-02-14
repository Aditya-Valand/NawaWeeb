import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NawaweebNavbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomeLayout() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const pendingData = localStorage.getItem("pendingArtifact");

    if (token && pendingData) {
      const artifact = JSON.parse(pendingData);
      console.log("Artifact successfully claimed by the syndicate:", artifact);
      
      // ✅ Step C: Clean up the forge to prevent duplicate adds
      localStorage.removeItem("pendingArtifact");
      alert(`The ${artifact.size} artifact has been added to your profile! ⛩️`);
    }
  }, []); 

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