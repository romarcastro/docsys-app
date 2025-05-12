import React from "react";
import PatientList from "./components/PatientList";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const Patients: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-inter p-4">
      <Navbar></Navbar>
      <Sidebar></Sidebar>
      <PatientList />
    </div>
  );
};

export default Patients;
