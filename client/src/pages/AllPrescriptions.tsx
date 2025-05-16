import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../pages/components/Sidebar";
import Navbar from "../pages/components/Navbar";
import logo from "../assets/ignatius-logo.svg";
import { motion, AnimatePresence } from "framer-motion";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";

type Medicine = {
  name: string;
  dosage: string;
  brand: string;
  frequency: number;
  quantity: number;
};

type Prescription = {
  name: string;
  age: number;
  gender: string;
  dateOfPrescription: string;
  doctorInformation: string;
  createdAt: string;
  inscription: Medicine[];
  instructions: string;
};

type fetchedPatients = {
  patient_id: string;
  patient_name: string;
};

const AllPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<
    Prescription[]
  >([]);
  const [sortKey, setSortKey] = useState<"name" | "dateOfPrescription" | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch(
          "https://docsys-app-server.onrender.com/api/prescriptions"
        );
        const data = await res.json();
        if (res.ok) {
          setPrescriptions(data.data);
          setFilteredPrescriptions(data.data); // Initialize both
        } else {
          console.error("Fetch failed:", data.message);
        }
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleSort = (key: "name" | "dateOfPrescription") => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
  const openModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPrescription(null);
    setIsModalOpen(false);
  };
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredPrescriptions(prescriptions); // Show all
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = prescriptions.filter((prescription) =>
        prescription.name.toLowerCase().includes(lowerSearch)
      );
      setFilteredPrescriptions(filtered);
    }
  };

  const sortedPrescriptions = [...filteredPrescriptions].sort((a, b) => {
    if (!sortKey) return 0;
    if (sortKey === "dateOfPrescription") {
      const aDate = new Date(a.dateOfPrescription);
      const bDate = new Date(b.dateOfPrescription);
      if (aDate < bDate) return sortOrder === "asc" ? -1 : 1;
      if (aDate > bDate) return sortOrder === "asc" ? 1 : -1;
      return 0;
    } else {
      const aValue = a[sortKey].toLowerCase();
      const bValue = b[sortKey].toLowerCase();
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
  });

  const [patients, setPatients] = useState<fetchedPatients[]>([]);

  // Fetch Patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("https://prms-test.onrender.com/api/patients");
        const patientData = await res.json();
        if (res.ok) {
          setPatients(patientData.data);
          console.log(patientData);
          console.log(patients);
        } else {
          console.error("Fetch failed:", patientData.message);
        }
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    fetchPatients();
  }, []);

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

      <main className="ml-[300px] pt-28 justify-center h-full px-8">
        <h2 className="text-lg font-semibold text-[#0077B6] mb-6">
          All Prescriptions
        </h2>

        <div className="mb-4 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => handleSort("name")}
              className={`px-3 py-1 border rounded ${
                sortKey === "name" ? "bg-blue-100" : ""
              }`}
            >
              Sort by Name{" "}
              {sortKey === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </button>
            <button
              onClick={() => handleSort("dateOfPrescription")}
              className={`px-3 py-1 border rounded ${
                sortKey === "dateOfPrescription" ? "bg-blue-100" : ""
              }`}
            >
              Sort by Date{" "}
              {sortKey === "dateOfPrescription"
                ? sortOrder === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Patient"
              className="border rounded px-3 py-1"
            />
            <button
              onClick={handleSearch}
              className="px-3 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </div>

        <table className="w-full text-sm border-collapse ">
          <thead>
            <tr className=" border-b">
              <th
                className="border-b px-5 py-1 cursor-pointer text-start text-xs text-gray-600"
                onClick={() => handleSort("name")}
              >
                PATIENT NAME{" "}
                {sortKey === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                className="border-b px-2 py-2 cursor-pointer text-start text-xs text-gray-600"
                onClick={() => handleSort("dateOfPrescription")}
              >
                DATE{" "}
                {sortKey === "dateOfPrescription"
                  ? sortOrder === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
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
            {sortedPrescriptions.map((prescription, index) => (
              <tr
                key={index}
                onClick={() => openModal(prescription)}
                className="hover:bg-gray-50 ease-in duration-50 cursor-pointer opacity-0 translate-y-2 animate-fadeInUp"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <td className="border-b px-5 py-5">{prescription.name}</td>
                <td className="border-b px-2 py-1">
                  {new Date(prescription.dateOfPrescription).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
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
        <AnimatePresence>
          {/* Modal */}
          {isModalOpen && selectedPrescription && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            >
              {/* Fixed width wrapper for modal and buttons */}
              <div className="relative w-[550px]">
                <motion.div
                  key="modal-content"
                  initial={{ y: 100, scale: 0.95, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 100, scale: 0.95, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 15,
                  }}
                  ref={modalContentRef}
                  className="bg-white rounded-xl shadow-lg p-8 w-full max-w-[550px] h-[700px] overflow-y-auto relative"
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
                      <span className="border-b border-gray-400 flex-grow text-center ml-2 text-[14px]">
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
                            <p>{med.brand}</p>
                            <p>
                              Sig: {med.frequency}x/day, Quantity:{" "}
                              {med.quantity}
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
                {/* Download buttons*/}
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
      </main>
    </div>
  );
};

export default AllPrescriptions;

<style>
  {`
  .no-pdf {
    display: none !important;
  }
`}
</style>;
