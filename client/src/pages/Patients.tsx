import React from "react";
import PatientList from "./components/PatientList";

const Patients: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-inter p-4">
      <PatientList />
    </div>
  );
};

export default Patients;
