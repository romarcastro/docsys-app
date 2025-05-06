import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import add from "../assets/icons/add.svg";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import rx from "../assets/icons/rx-icon.svg";
const CreatePrescriptionPage: React.FC = () => {
  const [medicines, setMedicines] = useState<
    { name: string; dosage: string; frequency: number; quantity: number }[]
  >([]);
  const [step, setStep] = useState<"edit" | "confirm">("edit");
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const patient = location.state?.patient;

  // New prescription data
  const [newPrescription, setNewPrescription] = useState<{
    patientName: string;
    doctorName: string;
    date: string;
    symptoms: string;
    subscription: string;
    instructions: string;
    inscription: {
      name: string;
      dosage: string;
      frequency: number;
      quantity: number;
    }[];
  }>({
    patientName: "",
    doctorName: "",
    date: new Date().toLocaleDateString(),
    symptoms: "",
    subscription: "",
    instructions: "",
    inscription: [],
  });

  // Sync medicines to newPrescription.inscription
  useEffect(() => {
    setNewPrescription((prev) => ({
      ...prev,
      inscription: medicines,
    }));
  }, [medicines]);

  const handleGeneratePrescription = async () => {
    if (!patient) return;

    const payload = {
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      dateOfPrescription: newPrescription.date,
      inscription: newPrescription.inscription,
      instructions: newPrescription.instructions,
      doctorInformation: newPrescription.doctorName || "Dr. Mark Doe, MD",
    };

    try {
      const response = await fetch(
        "https://docsys-app-server.onrender.com/api/prescriptions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Prescription Created!",
          text: "The prescription was successfully created.",
          confirmButtonColor: "#0077B6",
        });
        navigate("/home");
      } else {
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while creating the prescription.",
      });
    }
  };

  const dummyMedicineDB = [
    { name: "Paracetamol", dosage: "500mg", description: "Pain Reliever" },
    { name: "Amoxicillin", dosage: "250mg", description: "Antibiotic" },
    { name: "Ibuprofen", dosage: "400mg", description: "Anti-Inflammatory" },
    { name: "Cetirizine", dosage: "10mg", description: "Allergy Relief" },
    { name: "Loperamide", dosage: "2mg", description: "Treats Diarrhea" },
    { name: "Metformin", dosage: "500mg", description: "Diabetes Management" },
    { name: "Omeprazole", dosage: "20mg", description: "Stomach Acid Reducer" },
  ];

  function handleAddMedicine(): void {
    setShowModal(true);
  }

  return (
    <div className="min-h-screen font-inter">
      <Sidebar />
      <Navbar />

      <main className="ml-[300px] pt-28 justify-center h-full px-8">
        {step === "edit" && (
          <>
            <div className="flex items-center mb-6 gap-2">
              <img src={rx} className="w-4" alt="" />
              <h2 className="text-base font-semibold text-[#0077B6]">
                Create Prescription
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {/* Patient & Prescription Info */}
              <div className="flex flex-wrap justify-between gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="font-bold text-lg">{patient?.name}</div>
                    <div className="text-sm">Age: {patient?.age}</div>
                    <div className="text-sm">Gender: {patient?.gender}</div>
                  </div>
                </div>
                <div className="text-sm flex flex-col gap-1">
                  <div>
                    Prescription Date:{" "}
                    <span className="font-medium">January 20, 2025</span>
                  </div>
                  <div>
                    Prescription Type:{" "}
                    <span className="font-medium">Common</span>
                  </div>
                </div>
              </div>

              {/* Main Form Section */}
              <div className="flex flex-wrap gap-4 mt-4">
                {/* Left Form Inputs */}
                <div className="flex flex-col flex-1 min-w-[280px] gap-4 bg-[#f9f9f9] p-4 rounded border">
                  <div>
                    <label className="font-semibold text-sm ">
                      Symptoms/Diagnosis <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newPrescription.symptoms}
                      onChange={(e) =>
                        setNewPrescription({
                          ...newPrescription,
                          symptoms: e.target.value,
                        })
                      }
                      placeholder="Diagnosis here"
                      className="w-full mt-1 border rounded p-2 h-24 resize-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-sm">
                      Subscription <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPrescription.subscription}
                      onChange={(e) =>
                        setNewPrescription({
                          ...newPrescription,
                          subscription: e.target.value,
                        })
                      }
                      className="w-full mt-1 border rounded p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-sm">
                      Instructions <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={newPrescription.instructions}
                      onChange={(e) =>
                        setNewPrescription({
                          ...newPrescription,
                          instructions: e.target.value,
                        })
                      }
                      type="text"
                      className="w-full mt-1 border rounded p-2 text-sm"
                    />
                  </div>
                  {/* <button
                className="bg-[#0077B6] hover:bg-[#005f8f] text-white font-medium py-2 rounded text-sm mt-2"
                onClick={handleGeneratePrescription}
              >
                Generate Prescription
              </button> */}
                </div>

                {/* Inscription Section */}
                {/* Inscription Section */}
                <div className="bg-[#f9f9f9] p-4 rounded border w-full min-w-max flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Inscription</h3>
                    <button className="w-12 h-6 rounded-full border bg-white text-white text-sm flex items-center justify-center">
                      <img src={add} onClick={handleAddMedicine} />
                    </button>
                  </div>

                  <div className="text-sm">
                    <div className="flex justify-between font-semibold border-b pb-1 mb-1">
                      <span className="font-medium w-1/4">Drug Name</span>
                      <span className="font-medium w-1/6">Dosage</span>
                      <span className="font-medium w-1/6">Frequency</span>
                      <span className="font-medium w-1/6">Quantity</span>
                      <span className="font-medium w-1/6 text-center">
                        Action
                      </span>
                    </div>

                    {medicines.map((med, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center mb-1"
                      >
                        <span className="w-1/4">{med.name}</span>
                        <span className="w-1/6">{med.dosage}</span>

                        <input
                          type="number"
                          className="w-1/6 px-2 bg-transparent border rounded"
                          value={med.frequency}
                          onChange={(e) => {
                            const updated = [...medicines];
                            updated[index].frequency =
                              parseInt(e.target.value) || 0;
                            setMedicines(updated);
                          }}
                        />

                        <input
                          type="number"
                          className="w-1/6 px-2 bg-transparent border rounded"
                          value={med.quantity}
                          onChange={(e) => {
                            const updated = [...medicines];
                            updated[index].quantity =
                              parseInt(e.target.value) || 0;
                            setMedicines(updated);
                          }}
                        />

                        <button
                          onClick={() => {
                            const updated = medicines.filter(
                              (_, i) => i !== index
                            );
                            setMedicines(updated);
                          }}
                          className="w-1/6 text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Doctor's Info */}
                <div className="bg-[#f9f9f9] p-4 rounded border w-full max-w-[10rem] flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-sm">
                      Doctor's Information
                    </h3>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Dr. Mark Doe, MD</div>
                    <div className="text-gray-600">2025-01234502</div>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="bg-[#0077B6] hover:bg-[#005f8f] text-white font-medium py-2 rounded text-sm mt-4"
              onClick={() => {
                setStep("confirm");
              }}
            >
              Next: Confirm Details
            </button>
          </>
        )}

        {/* Step: CONFIRM */}
        {step === "confirm" && (
          <div className="bg-white rounded shadow p-8">
            <h2 className="text-lg font-semibold mb-4 text-[#0077B6]">
              Confirm Prescription
            </h2>

            <div className="text-sm space-y-3">
              <p>
                <strong>Patient:</strong> {patient?.name} (Age: {patient?.age})
              </p>
              <p>
                <strong>Symptoms:</strong> {newPrescription.symptoms}
              </p>
              <p>
                <strong>Instructions:</strong> {newPrescription.instructions}
              </p>
              <p>
                <strong>Subscription:</strong> {newPrescription.subscription}
              </p>

              <h3 className="mt-4 font-semibold">Medicines:</h3>
              <ul className="list-disc list-inside">
                {medicines.map((med, index) => (
                  <li key={index}>
                    {med.name} - {med.dosage} - {med.frequency}x/day -{" "}
                    {med.quantity} pcs
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep("edit")}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Go Back & Edit
              </button>

              <button
                onClick={handleGeneratePrescription}
                className="bg-[#0077B6] text-white px-4 py-2 rounded"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded shadow-lg p-6 max-w-2xl w-full">
              <h2 className="text-lg font-semibold mb-4">Select Medicines</h2>
              <div className="overflow-y-auto max-h-64">
                <table className="w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1 text-left">Drug Name</th>
                      <th className="border px-2 py-1 text-left">Dosage</th>
                      <th className="border px-2 py-1 text-left">
                        Description
                      </th>
                      <th className="border px-2 py-1 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyMedicineDB.map((drug, index) => (
                      <tr key={index}>
                        <td className="border px-2 py-1">{drug.name}</td>
                        <td className="border px-2 py-1">{drug.dosage}</td>
                        <td className="border px-2 py-1">{drug.description}</td>
                        <td className="border px-2 py-1 text-center">
                          <input
                            type="checkbox"
                            checked={selectedMedicines.includes(drug.name)}
                            onChange={() => {
                              if (selectedMedicines.includes(drug.name)) {
                                setSelectedMedicines(
                                  selectedMedicines.filter(
                                    (name) => name !== drug.name
                                  )
                                );
                              } else {
                                setSelectedMedicines([
                                  ...selectedMedicines,
                                  drug.name,
                                ]);
                              }
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => {
                    const selectedDetails = dummyMedicineDB
                      .filter((med) => selectedMedicines.includes(med.name))
                      .map((med) => ({
                        name: med.name,
                        dosage: med.dosage,
                        frequency: 0,
                        quantity: 0,
                      }));

                    // Prevent duplicates
                    const uniqueNewMeds = selectedDetails.filter(
                      (newMed) =>
                        !medicines.some((med) => med.name === newMed.name)
                    );

                    setMedicines([...medicines, ...uniqueNewMeds]);
                    setShowModal(false);
                    setSelectedMedicines([]);
                  }}
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreatePrescriptionPage;
