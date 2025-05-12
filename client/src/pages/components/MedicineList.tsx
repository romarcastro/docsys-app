// MedicinesList.tsx
import React, { useEffect, useState } from "react";
interface Medicine {
  _id: string;
  medicineId: string;
  name: string;
  brand: string;
  dosageForm: string;
  quantity: number;
  price: number;
  expirationDate: string;
  prescriptionRequired: boolean;
  description: string;
}
const MedicinesList: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch("https://pims-d.onrender.com/inventory");
        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Fetched data:", data);

        if (res.ok && Array.isArray(data.data)) {
          setMedicines(data.data);
        } else if (res.ok && Array.isArray(data)) {
          setMedicines(data); // fallback if API returns array directly
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

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Medicine Inventory</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {medicines.length === 0 && !error ? (
        <p>Loading medicines...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Form</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Expires</th>
              <th>Rx</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med) => (
              <tr key={med._id}>
                <td>{med.medicineId}</td>
                <td>{med.name}</td>
                <td>{med.brand}</td>
                <td>{med.dosageForm}</td>
                <td>{med.quantity}</td>
                <td>{med.price}</td>
                <td>{new Date(med.expirationDate).toLocaleDateString()}</td>
                <td>{med.prescriptionRequired ? "Yes" : "No"}</td>
                <td>{med.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MedicinesList;
