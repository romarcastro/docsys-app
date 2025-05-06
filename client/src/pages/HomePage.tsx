import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

// icons
import redirect from "../assets/icons/redirect.svg";
import link from "../assets/icons/link.svg";
import hospitalIcon from "../assets/icons/hospital-icon.svg";
import recent from "../assets/icons/recent-prescriptions.svg";
import close from "../assets/icons/close.svg";

// images

import blank from "../assets/blank-prescription.svg";
import template from "../assets/template-prescription.svg";
import newPatient from "../assets/icons/new-patient.svg";
import existingPatient from "../assets/icons/existing-patient.svg";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

const PrescriptionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const [patientType, setPatientType] = useState<"new" | "existing" | null>(null);
  const [formData, setFormData] = useState({ name: "", age: "", gender: "" });
  const isFormValid = formData.name && formData.age && formData.gender;

  const handlePatientType = (type: "new" | "existing") => {
    setPatientType(type);
    setStep(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWritePrescription = () => {
    if (patientType === "new") {
      const { name, age, gender } = formData;
      if (!name || !age || !gender) {
        alert("Please fill out name, age, and gender.");
        return;
      }
    }

    navigate("/create", { state: { patient: formData } });
    onClose();
  };

  const handleBack = () => {
    if (step === 1) {
      setStep(0);
      setPatientType(null);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md font-inter relative"
        >
          <img
            src={close}
            className="absolute top-4 right-4 cursor-pointer"
            onClick={onClose}
          />

          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold">Write a prescription</h2>
              <span>
                Are you writing for a new patient or the patient has an existing
                record?
              </span>
              <div className="flex gap-4">
                <div
                  className="flex flex-col items-center mt-4 border-2 border-gray-300 py-4 px-8 rounded-lg cursor-pointer hover:border-[#003459] transition ease-in"
                  onClick={() => handlePatientType("new")}
                >
                  <img src={newPatient} alt="New Patient" />
                  <label htmlFor="new-patient" className="ml-2">
                    New Patient
                  </label>
                </div>

                <div
                  className="flex flex-col items-center mt-4 border-2 border-gray-300 py-4 px-8  rounded-lg cursor-pointer hover:border-[#003459] transition ease-in"
                  onClick={() => handlePatientType("existing")}
                >
                  <img src={existingPatient} alt="Existing Patient" />
                  <label htmlFor="existing-patient" className="mt-3">
                    Existing Patient
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 1 && patientType === "new" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">New Patient Details</h2>

              <input
                type="text"
                name="name"
                required
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="number"
                name="age"
                required
                placeholder="Age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded"
              />
              <div className="w-full my-3">
                <label className="mr-4 font-medium">Gender:</label>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleInputChange}
                    className="mr-1"
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleInputChange}
                    className="mr-1"
                  />
                  Female
                </label>
              </div>
              <div className="flex gap-2">
              <button
               className={`px-4 py-2 rounded transition ease-in ${
                isFormValid
                 ? "bg-[#00538D] text-white hover:bg-[#00528de7] cursor-pointer"
                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
               onClick={handleWritePrescription}
             disabled={!isFormValid}
              >
             Write Prescription
              </button>

                <button
                  className="border border-gray-400 text-[#00538D] px-4 py-2 rounded"
                  onClick={handleBack}
                >
                  Go Back
                </button>
              </div>
            </div>
          )}

          {step === 1 && patientType === "existing" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Search Existing Patient
              </h2>
              <input
                type="text"
                placeholder="Search by name or ID"
                className="w-full mb-4 p-2 border rounded"
              />
              <div className="flex gap-2">
                <button
                  className="bg-[#00538D] text-white px-4 py-2 rounded hover:bg-[#00528de7] transition ease-in"
                  onClick={handleWritePrescription}
                >
                  Write Prescription
                </button>
                <button
                  className="border border-gray-400 text-[#00538D] px-4 py-2 rounded"
                  onClick={handleBack}
                >
                  Go Back
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const formatName = (fullName: string) => {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/);
  const filteredParts: string[] = [];

  parts.forEach((part, index) => {
    const cleanPart = part.replace(/[^a-zA-Z]/g, "");
    if (index === 0) {
      filteredParts.push(part);
    } else if (cleanPart.length > 1) {
      filteredParts.push(part);
    }
  });

  return filteredParts.join(" ");
};

type Prescription = {
  name: string;
  dateOfPrescription: string;
  doctorInformation: string;
  createdAt: string;
};

const HomePage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch(
          "https://docsys-app-server.onrender.com/api/prescriptions"
        );
        const data = await res.json();
        if (res.ok) {
          const sortedData = data.data.sort(
            (a: Prescription, b: Prescription) =>
              new Date(b.dateOfPrescription).getTime() -
              new Date(a.dateOfPrescription).getTime()
          );
          setPrescriptions(sortedData);
        } else {
          console.error("Fetch failed:", data.message);
        }
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
      }
    };

    fetchPrescriptions();
  }, []);

  const { name } = useUser();
  const [greeting, setGreeting] = useState<string>("Good Morning");
  const navigate = useNavigate();
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen font-inter">
      <Sidebar />
      <Navbar />

      <main className="ml-[300px] pt-28 justify-center h-full">
        {/* main */}
        <div className="flex justify-between">
          <div className="w-[100%]">
            <div className="mb-5">
              <h1 className="text-2xl font-medium mb-1 text-[#0077B6]">
                {greeting}, Dr. {formatName(name) || "User"}!
              </h1>
              <p className="text-gray-500">Have a great and productive day</p>
            </div>

            <div>
              <span className="text-sm text-[#404040]">
                Write a new prescription
              </span>
              <div className="flex gap-6 mt-2">
                <div
                  className="flex flex-col items-center "
                  onClick={() => setShowModal(true)}
                >
                  <img
                    src={blank}
                    alt=""
                    className="mb-2 h-30 shadow-sm cursor-pointer hover:transform hover:scale-105 transition"
                  />
                  <span>New Prescription</span>
                </div>
                <div
                  className="flex flex-col items-center "
                  onClick={() => setShowModal(true)}
                >
                  <img
                    src={template}
                    alt=""
                    className="mb-2 h-30 shadow-sm cursor-pointer hover:transform hover:scale-105 transition"
                  />
                  <span>Acute Illness</span>
                </div>
                <div
                  className="flex flex-col items-center "
                  onClick={() => setShowModal(true)}
                >
                  <img
                    src={template}
                    alt=""
                    className="mb-2 h-30 shadow-sm cursor-pointer hover:transform hover:scale-105 transition"
                  />
                  <span>Chronic Condition</span>
                </div>
              </div>
            </div>

            {/* Recent Prescriptions */}
            <div className="mt-10 flex justify-between">
              <div className="flex gap-2 items-center mb-3">
                <img src={recent} alt="" />
                <h1 className="text-m font-semibold text-[#0077B6]">
                  Recent Prescriptions
                </h1>
              </div>
              <a
                onClick={() => navigate("/prescriptions")}
                className="flex gap-1 items-center mb-3 cursor-pointer"
              >
                <h1 className="text-sm font-medium text-[#1F4276]">View all</h1>
              </a>
            </div>
            <table className="w-full text-sm border-collapse  ">
              <thead className="">
                <tr className="border bg-gray-100">
                  <th className="border-b px-2 py-2 text-start">
                    Patient Name
                  </th>
                  <th className="border-b px-2 py-1 text-start">Date</th>
                  <th className="border-b px-2 py-1 text-start">Time</th>
                  <th className="border-b px-2 py-1 text-start">Doctor</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription, index) => (
                  <tr key={index}>
                    <td className="border-b px-2 py-3">{prescription.name}</td>
                    <td className="border-b px-2 py-1">
                      {new Date(
                        prescription.dateOfPrescription
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="border-b px-2 py-1">
                      {new Date(prescription.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="border-b px-2 py-1">
                      {prescription.doctorInformation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* aside */}
          <div className="flex flex-col gap-1 mx-10">
            <div className="px-5  w-[400px] bg-white rounded-lg">
              <div className="flex gap-2 items-center">
                <img src={link} alt="" />
                <h1 className="text-m font-semibold text-[#002E4F]">
                  Quick Access
                </h1>
              </div>

              <span className="text-[12px] text-[#404040] mb-5 text-wrap">
                A collection of shortcuts
              </span>

              <div className="flex gap-2">
                <a
                  onClick={() => setShowModal(true)}
                  className="flex gap-2 items-center bg-gray-50 hover:bg-gray-100 p-1 rounded cursor-pointer"
                >
                  <span className="text-[#1F4276] text-sm font-medium">
                    Write Prescription
                  </span>
                  <img src={redirect} alt="" />
                </a>
                <a
                  onClick={() => navigate("/prescriptions")}
                  className="flex gap-2 items-center bg-gray-50  hover:bg-gray-100 p-1 rounded cursor-pointer"
                >
                  <span className="text-[#1F4276] text-sm font-medium">
                    All Prescriptions
                  </span>
                  <img src={redirect} alt="" />
                </a>
              </div>
            </div>

            <div className="p-5  w-[400px] bg-white rounded-lg">
              <div className="flex gap-2 items-center mb-3">
                <img src={hospitalIcon} alt="" className="-mx-2" />
                <h1 className="text-m font-semibold text-[#002E4F]">
                  Hospital Hotlines
                </h1>
              </div>
              <div className="flex gap-2 items-center mb-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] font-semibold">
                    NURSE STATION 1
                  </span>
                  <span className="text-[12px] font-medium">(51) 472-4025</span>
                </div>
              </div>
              <div className="flex gap-2 items-center mb-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] font-semibold">
                    NURSE STATION 2
                  </span>
                  <span className="text-[12px] font-medium">(51) 472-4025</span>
                </div>
              </div>
              <div className="flex gap-2 items-center mb-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] font-semibold">
                    NURSE STATION 3
                  </span>
                  <span className="text-[12px] font-medium">(51) 472-4025</span>
                </div>
              </div>
              <span className="text-[12px]">
                © 2025 St. Ignatius Medical Center, Ateneo Avenue, Naga City,
                4400 Philippines
              </span>
            </div>
          </div>
        </div>
      </main>

      {showModal && <PrescriptionModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default HomePage;
