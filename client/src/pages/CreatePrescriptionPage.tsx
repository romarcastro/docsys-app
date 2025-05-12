import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useUser } from "../contexts/UserContext";

import add from "../assets/icons/add.svg";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import rx from "../assets/icons/rx-icon.svg";

const CreatePrescriptionPage: React.FC = () => {
  const [medicines, setMedicines] = useState<
    {
      name: string;
      brand: string;
      dosageForm: string;
      frequency: number;
      quantity: number;
    }[]
  >([]);
  const [step, setStep] = useState<"edit" | "confirm">("edit");
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const patient = location.state?.patient;

  // Username
  const { name } = useUser();
  const formatName = (fullName: string) => {
    if (!fullName) return "";

    const parts = fullName.trim().split(/\s+/); // Split by spaces
    const filteredParts: string[] = [];

    parts.forEach((part, index) => {
      const cleanPart = part.replace(/[^a-zA-Z]/g, ""); // Remove dots, commas, etc.
      if (index === 0) {
        filteredParts.push(part); // Always keep first name
      } else if (cleanPart.length > 1) {
        filteredParts.push(part); // Keep only real words
      }
      // Skip if cleanPart is 1 letter (initials)
    });

    return filteredParts.join(" ");
  };

  useEffect(() => {
    if (name) {
      const formattedName = formatName(name);
      setNewPrescription((prev) => ({
        ...prev,
        doctorName: `Dr. ${formattedName}, MD`,
      }));
    }
  }, [name]);

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
      brand: string;
      dosageForm: string;
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
      doctorInformation: newPrescription.doctorName,
    };
    // Fetch Prescriptions
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

  interface Medicine {
    medicineId: string;
    name: string;
    brand: string;
    dosageForm: string;
  }
  const [medicineDB, setMedicinesDB] = useState<Medicine[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch("https://pims-d.onrender.com/inventory");
        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Fetched data:", data);

        if (res.ok && Array.isArray(data.data)) {
          setMedicinesDB(data.data);
        } else if (res.ok && Array.isArray(data)) {
          setMedicinesDB(data); // fallback if API returns array directly
        } else {
          setError("Unexpected response format or no medicines found.");
        }
      } catch (err) {
        console.error("Error fetching medicines:", err);
        setError("Failed to fetch medicines.");
      }
    };

    fetchMedicines();
  }, []);

  function handleAddMedicine(): void {
    setShowModal(true);
  }

  // Get Date
  const [dateTime, setDateTime] = useState<string>("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDate = now.toLocaleDateString(undefined, options);

      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;

      const formattedTime = `${hours}:${minutes} ${ampm}`;
      setDateTime(`Date: ${formattedDate} Time: ${formattedTime}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
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
                    <span className="font-medium">
                      {" "}
                      {dateTime.split("Date: ")[1]?.split(" Time:")[0]}
                    </span>
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
                      required
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
                      required
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
                </div>
                {/* Inscription Section */}
                <div className="bg-[#f9f9f9] p-4 rounded border w-full min-w-max flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Inscription</h3>
                    <button className="w-12 h-6 rounded-full border bg-white text-white text-sm flex items-center justify-center">
                      <img src={add} onClick={handleAddMedicine} />
                    </button>
                  </div>

                  <div className="text-sm">
                    <div className="flex font-semibold border-b pb-1 mb-1">
                      <span className="font-medium w-1/4">Drug Name</span>
                      <span className="font-medium w-1/6">Brand</span>
                      <span className="font-medium w-1/6">Dosage</span>
                      <span className="font-medium w-1/6 text-center">
                        Frequency
                      </span>
                      <span className="font-medium w-1/6 text-center">
                        Quantity
                      </span>
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
                        <span className="w-1/6">{med.brand}</span>
                        <span className="w-1/6">{med.dosageForm}</span>

                        <div className="w-1/6 flex justify-center items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...medicines];
                              updated[index].frequency = Math.max(
                                0,
                                updated[index].frequency - 1
                              );
                              setMedicines(updated);
                            }}
                            className="w-6 h-6 flex justify-center items-center bg-gray-200 rounded-full hover:bg-gray-300"
                          >
                            −
                          </button>

                          <input
                            type="number"
                            className="w-5 text-center bg-transparent rounded appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            value={med.frequency}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              const updated = [...medicines];
                              updated[index].frequency = value >= 0 ? value : 0;
                              setMedicines(updated);
                            }}
                            min={0}
                          />

                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...medicines];
                              updated[index].frequency =
                                updated[index].frequency + 1;
                              setMedicines(updated);
                            }}
                            className="w-6 h-6 flex justify-center items-center bg-gray-200 rounded-full hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>

                        <div className="w-1/6 flex justify-center items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...medicines];
                              updated[index].quantity = Math.max(
                                0,
                                updated[index].quantity - 1
                              );
                              setMedicines(updated);
                            }}
                            className="w-6 h-6 flex justify-center items-center bg-gray-200 rounded-full hover:bg-gray-300"
                          >
                            −
                          </button>

                          <input
                            type="number"
                            value={med.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              const updated = [...medicines];
                              updated[index].quantity = value >= 0 ? value : 0;
                              setMedicines(updated);
                            }}
                            min={0}
                            className="w-5 text-center bg-transparent rounded appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...medicines];
                              updated[index].quantity =
                                updated[index].quantity + 1;
                              setMedicines(updated);
                            }}
                            className="w-6 h-6 flex justify-center items-center bg-gray-200 rounded-full hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>

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
                    <div className="font-medium">
                      Dr. {formatName(name)}, MD
                    </div>
                    <div className="text-gray-600">2025-01234502</div>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="bg-[#0077B6] hover:bg-[#005f8f] text-white font-medium p-2 rounded text-sm mt-4"
              onClick={() => {
                const { symptoms, subscription, instructions } =
                  newPrescription;

                const isValidPrescription =
                  symptoms.trim() && subscription.trim() && instructions.trim();

                const isValidMedicines =
                  medicines.length > 0 &&
                  medicines.every(
                    (med) => med.frequency > 0 && med.quantity > 0
                  );

                if (!isValidPrescription) {
                  Swal.fire({
                    icon: "warning",
                    title: "Missing Fields",
                    text: "Please fill in all required prescription fields.",
                    confirmButtonColor: "#0077B6",
                  });
                  return;
                }

                if (!isValidMedicines) {
                  Swal.fire({
                    icon: "warning",
                    title: "Incomplete Medicines",
                    text: "Please make sure all medicines have frequency and quantity.",
                    confirmButtonColor: "#0077B6",
                  });
                  return;
                }

                // All validations passed
                setStep("confirm");
              }}
            >
              Confirm Details
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
                    {med.name} - {med.dosageForm} - {med.frequency}x/day -{" "}
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
                Edit
              </button>

              <button
                onClick={handleGeneratePrescription}
                className="bg-[#0077B6] text-white px-4 py-2 rounded"
              >
                Confirm
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
                      <th className="border px-2 py-1 text-left">Brand</th>

                      <th className="border px-2 py-1 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicineDB.map((drug, index) => (
                      <tr key={index}>
                        <td className="border px-2 py-1">{drug.name}</td>
                        <td className="border px-2 py-1">{drug.dosageForm}</td>
                        <td className="border px-2 py-1">{drug.brand}</td>

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
                    const selectedDetails = medicineDB
                      .filter((med) => selectedMedicines.includes(med.name))
                      .map((med) => ({
                        medicineId: med.medicineId,
                        name: med.name,
                        dosageForm: med.dosageForm,
                        brand: med.brand,

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
