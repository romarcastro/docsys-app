import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";

// icons
import redirect from "../assets/icons/redirect.svg";
import link from "../assets/icons/link.svg";
import hospitalIcon from "../assets/icons/hospital-icon.svg";
import recent from "../assets/icons/recent-prescriptions.svg";
import logo from "../assets/ignatius-logo.svg";

// images

import blank from "../assets/blank-prescription.svg";
import template from "../assets/template-prescription.svg";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  age: number;
  condition: string;
  dateAdmitted: string;
  address: string;
  patientId: string;
  email: string;
}

const PrescriptionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const [patientType, setPatientType] = useState<"new" | "existing" | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    patientId: "",
    email: "",
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch patients on modal open (step 0)
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://prms-test.onrender.com/api/patients");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (Array.isArray(data.patients)) {
          setPatients(data.patients);
        } else if (Array.isArray(data)) {
          setPatients(data);
        } else {
          setError("Unexpected data format from server");
        }
      } catch (err) {
        setError("Failed to load patients.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // Filter patients by search term (name or patientId)
  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      p.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle selecting existing patient -> fills formData & go to next step
  const handleSelectPatient = (patient: Patient) => {
    setFormData({
      name: `${patient.firstName} ${patient.lastName}`,
      age: patient.age.toString(),
      gender: patient.gender,
      patientId: patient.patientId,
      email: patient.email,
    });
    setPatientType("existing");
    setStep(1);
  };

  // Handle new patient input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Navigate with patient data
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
      setFormData({ name: "", age: "", gender: "", patientId: "", email: "" });
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
          className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-3xl font-inter relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 cursor-pointer text-xl text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>

          {step === 0 && (
            <>
              <h2 className="text-lg font-semibold mb-4">
                Search Existing Patient
              </h2>

              <input
                type="text"
                placeholder="Search by name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />
              {loading && <p>Loading patients...</p>}
              {error && <p className="text-red-600">{error}</p>}

              {!loading && !error && filteredPatients.length === 0 && (
                <p>No patients found.</p>
              )}
              {!loading && filteredPatients.length > 0 && (
                <div className="max-h-52 overflow-auto mb-6 border rounded">
                  {/* Header row */}
                  <div className="grid grid-cols-4 gap-2 font-semibold text-sm px-2 py-2 bg-gray-100 border-b">
                    <span>Patient ID</span>
                    <span>Name</span>
                    <span>Age</span>
                    <span>Gender</span>
                  </div>

                  {/* Patient list */}
                  <ul className="divide-y">
                    {filteredPatients.map((p) => (
                      <li
                        key={p._id}
                        className="cursor-pointer px-2 py-3 hover:bg-gray-50"
                        onClick={() => handleSelectPatient(p)}
                      >
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <span>{p.patientId}</span>
                          <span>
                            {p.firstName} {p.lastName}
                          </span>
                          <span>{p.age}</span>
                          <span>{p.gender}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  className="bg-[#00538D] text-white px-4 py-2 rounded hover:bg-[#00528de7] transition ease-in"
                  onClick={() => {
                    setPatientType("new");
                    setStep(1);
                    setFormData({
                      name: "",
                      age: "",
                      gender: "",
                      patientId: "",
                      email: "",
                    });
                  }}
                >
                  New Patient
                </button>
                <button
                  className="border border-gray-400 text-[#00538D] px-4 py-2 rounded"
                  onClick={handleBack}
                >
                  Go Back
                </button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold mb-4">
                {patientType === "new"
                  ? "New Patient Info"
                  : "Confirm Patient Info"}
              </h2>
              <span className="font-semibold">Name</span>

              <input
                title="Name"
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full mb-2 mt-1 p-2 border rounded"
                disabled={patientType === "existing"} // disable if existing patient
              />
              <span className="font-semibold">Age</span>

              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full mb-2  mt-1  p-2 border rounded"
                disabled={patientType === "existing"}
              />
              <span className="font-semibold">Gender</span>

              <input
                type="text"
                name="gender"
                placeholder="Gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full mb-4 mt-1  p-2 border rounded"
                disabled={patientType === "existing"}
              />
              <div className="flex gap-2">
                <button
                  className="bg-[#00538D] text-white px-4 py-2 rounded hover:bg-[#00528de7] transition ease-in"
                  onClick={handleWritePrescription}
                  disabled={!formData.name || !formData.age || !formData.gender}
                >
                  Write Prescription
                </button>
                <button
                  className="border border-gray-400 text-[#00538D] px-4 py-2 rounded"
                  onClick={handleBack}
                >
                  Back
                </button>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

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

type Prescription = {
  name: string;
  age: string;
  gender: string;
  dateOfPrescription: string;
  doctorInformation: string;
  inscription: Medicine[];
  instructions: string;
  createdAt: string;
  patientId: string;
  email: string;
};

type Medicine = {
  name: string;
  dosage: string;
  frequency: number;
  quantity: number;
};

const HomePage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  // specific prescription modal
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedPrescription(null);
    setIsModalOpen(false);
  };

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
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  const modalContentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    const downloadBtn = document.getElementById("download-pdf-btn");
    if (downloadBtn) downloadBtn.classList.add("no-pdf");

    if (modalContentRef.current) {
      html2pdf()
        .from(modalContentRef.current)
        .set({
          margin: 0.5,
          filename: `${
            selectedPrescription?.name || "prescription"
          } Prescription.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .save()
        .then(() => {
          if (downloadBtn) downloadBtn.classList.remove("no-pdf");
        });
    } else {
      if (downloadBtn) downloadBtn.classList.remove("no-pdf");
    }
  };

  const handleDownloadPNG = async () => {
    if (modalContentRef.current) {
      const canvas = await html2canvas(modalContentRef.current);
      const link = document.createElement("a");
      link.download = `${
        selectedPrescription?.name || "prescription"
      } Prescription.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

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
            <table className="w-full text-sm border-collapse ">
              <thead className="">
                <tr className="border-b">
                  <th className="border-b px-2 py-2 text-start text-xs text-gray-600">
                    PATIENT NAME
                  </th>
                  <th className="border-b px-2 py-1 text-start text-xs text-gray-600">
                    DATE
                  </th>
                  <th className="border-b px-2 py-1 text-start text-xs text-gray-600">
                    TIME
                  </th>
                  <th className="border-b px-2 py-1 text-start text-xs text-gray-600">
                    DOCTOR
                  </th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.slice(0, 4).map((prescription, index) => (
                  <tr
                    key={index}
                    className="opacity-0 translate-y-2 animate-fadeInUp hover:bg-gray-50 cursor-pointer"
                    onClick={() => openModal(prescription)}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: "forwards",
                    }}
                  >
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
      <AnimatePresence>
        {/* Modal */}
        {isModalOpen && selectedPrescription && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            {/* Fixed width wrapper for modal and buttons */}
            <div className="relative w-[550px]">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-[550px] h-[700px] overflow-y-auto relative"
                ref={modalContentRef}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-4 text-xl text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>

                <div className="text-center mb-6">
                  <div className="flex justify-center mb-2">
                    <img src={logo} className="w-40" />
                  </div>
                  <h2 className="font-semibold text-base mt-1">
                    {" "}
                    {selectedPrescription.doctorInformation}
                  </h2>
                  <p className="text-xs text-gray-700 italic">
                    General Doctor, St. Ignatius Medical Center
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800 border-t border-b py-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-xs">NAGA CITY</h3>
                    <p className="text-xs italic">St. Ignatius Medical</p>
                    <p className="text-xs italic">Naga City, 4400</p>
                    <p className="text-xs italic">Philippines</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs">
                      CONTACT INFORMATION
                    </h3>
                    <p className="text-xs italic">
                      ignatiusmedicalcenter@gmail.com
                    </p>
                    <p className="text-xs italic">0912 345 6789</p>
                    <p className="text-xs italic">(2) 123 456 78</p>
                  </div>
                </div>

                <div className="flex mb-4 text-lg">
                  <p className="flex items-center w-full justify-between">
                    <span className="font-semibold text-[14px]">Name:</span>
                    <span className="border-b border-gray-400 flex-grow text-center ml-2 text-[13px]">
                      {selectedPrescription.name}
                    </span>
                  </p>
                  <p className="flex items-center w-full justify-between ml-6">
                    <span className="font-semibold text-[14px]">Age:</span>
                    <span className="border-b border-gray-400 flex-grow text-center ml-2 text-[14px]">
                      {selectedPrescription.age}
                    </span>
                  </p>
                  <p className="flex items-center w-full justify-between ml-6">
                    <span className="font-semibold text-[14px]">Sex:</span>
                    <span className="border-b border-gray-400 flex-grow text-center ml-2 text-[14px]">
                      {selectedPrescription.gender}
                    </span>
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800 border-tpy-4 mb-4">
                  {" "}
                  <p className="flex items-center w-full justify-between">
                    <span className="font-semibold text-[14px]">
                      Patient ID:
                    </span>
                    <span className="border-b border-gray-400 flex-grow text-center ml-2 text-[14px]">
                      {selectedPrescription.patientId}
                    </span>
                  </p>
                  <p className="flex items-center w-full justify-between">
                    <span className="font-semibold text-[14px]">Email:</span>
                    <span className="border-b border-gray-400 flex-grow text-center ml-2 text-[14px]">
                      {selectedPrescription.email}
                    </span>
                  </p>
                </div>
                {/* Rx and Medicine List */}
                {/**/}
                <div className="flex">
                  <div>
                    <div className="text-3xl font-bold mr-6 text-gray-700">
                      ℞
                    </div>
                    <div className="text-base space-y-2 ml-10">
                      {selectedPrescription.inscription.map((med, idx) => (
                        <div key={idx}>
                          <p>
                            {idx + 1}. {med.name} — {med.dosage}
                          </p>
                          <p>
                            Sig: {med.frequency}x/day, Quantity: {med.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-10 text-right text-sm">
                  <p className="font-semibold">
                    {selectedPrescription.doctorInformation}
                  </p>
                  <p>
                    LICENSE NO. <span className="font-bold">123456</span>
                  </p>
                  <p>
                    PTR NO.{" "}
                    <span className="underline text-blue-600">7891011</span>
                  </p>
                </div>
              </motion.div>
              {/* Download buttons */}
              <button
                id="download-pdf-btn"
                onClick={handleDownloadPDF}
                className="absolute top-4 -left-40 px-3 py-2 w-40 bg-blue-600 text-white rounded hover:bg-blue-500 z-50 text-base font-medium"
              >
                Download PDF
              </button>
              <button
                id="download-png-btn"
                onClick={handleDownloadPNG}
                className="absolute top-20 -left-40 px-3 py-2 w-40 bg-blue-600 text-white rounded hover:bg-blue-500 z-50 text-base font-medium"
              >
                Download PNG
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;

<style>
  {`
  .no-pdf {
    display: none !important;
  }
`}
</style>;
