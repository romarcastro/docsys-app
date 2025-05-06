import React, { useEffect, useState } from "react";
import Sidebar from "../pages/components/Sidebar";
import Navbar from "../pages/components/Navbar";

type Prescription = {
  name: string;
  dateOfPrescription: string;
  doctorInformation: string;
  createdAt: string;
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
            <tr className=" bg-gray-100">
              <th
                className="border-b px-5 py-1 cursor-pointer text-start"
                onClick={() => handleSort("name")}
              >
                Patient Name{" "}
                {sortKey === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                className="border-b px-2 py-2 cursor-pointer text-start "
                onClick={() => handleSort("dateOfPrescription")}
              >
                Date{" "}
                {sortKey === "dateOfPrescription"
                  ? sortOrder === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th className="border-b px-2 py-1 text-start">Time</th>
              <th className="border-b px-2 py-1 text-start">Doctor</th>
            </tr>
          </thead>
          <tbody>
            {sortedPrescriptions.map((prescription, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 ease-in duration-50 cursor-pointer"
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
      </main>
    </div>
  );
};

export default AllPrescriptions;
