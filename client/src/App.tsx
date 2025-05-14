import { useEffect } from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import CreatePrescriptionPage from "./pages/CreatePrescriptionPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Prescriptions from "./pages/AllPrescriptions";
import Medicines from "./pages/Medicines";
import Patient from "./pages/Patients";
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  useEffect(() => {
    axios.get("http://localhost:5000/").catch((error) => console.error(error));
  }, []);
  return (
    <div>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePrescriptionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute>
                <Prescriptions />
              </ProtectedRoute>
            }
          />

          <Route path="/medicines" element={<Medicines />} />

          <Route path="/patients" element={<Patient />} />


        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
