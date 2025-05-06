import React, { useEffect, useState } from "react";
import Sidebar from "../pages/components/Sidebar";
import Navbar from "../pages/components/Navbar";

type Prescription = {
  name: string;
  dateOfPrescription: string;
  doctorInformation: string;
  instructions: string;
};

const AllPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [sortKey, setSortKey] = useState<"name" | "dateOfPrescription" | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch(
          "https://docsys-app-server.onrender.com/api/prescriptions"
        );
        const data = await res.json();
        if (res.ok) {
          setPrescriptions(data.data);
        } else {
          console.error("Fetch failed:", data.message);
        }
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
      }
    };

    fetchPrescriptions();
  }, []);

  const sortedPrescriptions = [...prescriptions].sort((a, b) => {
    if (!sortKey) return 0;
    if (sortKey === "dateOfPrescription") {
      // Compare as dates
      const aDate = new Date(a.dateOfPrescription);
      const bDate = new Date(b.dateOfPrescription);
      if (aDate < bDate) return sortOrder === "asc" ? -1 : 1;
      if (aDate > bDate) return sortOrder === "asc" ? 1 : -1;
      return 0;
    } else {
      // Compare as strings
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
  });

  const handleSort = (key: "name" | "dateOfPrescription") => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen font-inter">
      <Sidebar />
      <Navbar />

      <main className="ml-[300px] pt-28 justify-center h-full px-8">
        <h2 className="text-lg font-semibold text-[#0077B6] mb-6">
          Prescriptions
        </h2>
        <div className="mb-4 flex gap-2">
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
        <table className="w-full text-sm border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="border px-2 py-1 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Patient Name{" "}
                {sortKey === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                className="border px-2 py-1 cursor-pointer"
                onClick={() => handleSort("dateOfPrescription")}
              >
                Date{" "}
                {sortKey === "dateOfPrescription"
                  ? sortOrder === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th className="border px-2 py-1">Doctor</th>
              <th className="border px-2 py-1">Instructions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPrescriptions.map((prescription, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{prescription.name}</td>
                <td className="border px-2 py-1">
                  {prescription.dateOfPrescription}
                </td>
                <td className="border px-2 py-1">
                  {prescription.doctorInformation}
                </td>
                <td className="border px-2 py-1">
                  {prescription.instructions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default AllPrescriptions;
