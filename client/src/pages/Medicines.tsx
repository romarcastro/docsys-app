import React from "react";
import MedicineList from "./components/MedicineList";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const Medicines: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-inter p-4">
      <Navbar></Navbar>
      <Sidebar></Sidebar>
      <MedicineList />
    </div>
  );
};

export default Medicines;
