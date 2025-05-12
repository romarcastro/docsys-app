import React, { useEffect, useState } from "react";

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
}

const PatientsList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("https://prms-test.onrender.com/api/patients");
        const patientData = await res.json();

        if (res.ok && Array.isArray(patientData.data)) {
          setPatients(patientData.data);
        } else {
          setError("Unexpected response format or no patients found.");
        }
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Failed to fetch patients.");
      }
    };

    fetchPatients();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Patient List</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {patients.length === 0 && !error ? (
        <p>Loading patients...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Condition</th>
              <th>Date Admitted</th>
              <th>Gender</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient._id}>
                <td>{patient.patientId}</td>
                <td>
                  {patient.firstName} {patient.lastName}
                </td>
                <td>{patient.age}</td>
                <td>{patient.condition}</td>
                <td>{new Date(patient.dateAdmitted).toLocaleDateString()}</td>
                <td>{patient.gender}</td>
                <td>{patient.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientsList;
