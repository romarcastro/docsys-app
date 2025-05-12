import React from "react";
import MedicineList from "./components/MedicineList";

const Medicines: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-inter p-4">
      <MedicineList />
    </div>
  );
};

export default Medicines;
