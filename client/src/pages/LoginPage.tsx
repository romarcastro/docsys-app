import React from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";

// Import your logo if you want
import logo from "../assets/ignatius-logo.svg";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setName, name } = useUser();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.displayName) {
        setName(user.displayName); // 👈 Save to context
      }

      navigate("/home");
    } catch (error) {
      console.error("Google Sign-In Error", error);
    }
  };

  if (name) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-inter p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center"
      >
        <img src={logo} alt="Logo" className="w-32 mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to St. Ignatius
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Please sign in to continue
        </p>

        <button
  onClick={handleGoogleLogin}
  className="flex items-center justify-center gap-3 border-2 border-blue-500 text-blue-500 font-semibold py-2 px-4 rounded-lg w-full hover:bg-blue-50 transition"
>
  <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M533.5 278.4c0-18.5-1.6-36.5-4.7-53.8H272v101.7h146.7c-6.3 33.8-25.1 62.5-53.5 81.6v67.8h86.4c50.7-46.7 81.9-115.4 81.9-197.3z"
      fill="#4285F4"
    />
    <path
      d="M272 544.3c72.6 0 133.7-24.1 178.2-65.5l-86.4-67.8c-24 16-54.8 25.3-91.8 25.3-70.6 0-130.4-47.7-151.8-111.7H32.5v70.1c44.6 87.8 136 149.6 239.5 149.6z"
      fill="#34A853"
    />
    <path
      d="M120.2 324.6c-10.4-31.1-10.4-64.4 0-95.5v-70.1H32.5c-36.8 73.5-36.8 161.7 0 235.2l87.7-69.6z"
      fill="#FBBC04"
    />
    <path
      d="M272 107.7c39.5 0 75 13.6 102.9 40.2l77.4-77.4C405.7 24.2 344.6 0 272 0 168.5 0 77.1 61.8 32.5 149.6l87.7 69.5c21.4-64 81.2-111.7 151.8-111.7z"
      fill="#EA4335"
    />
  </svg>
  Sign in with Google
</button>

      </motion.div>
    </div>
  );
};

export default LoginPage;
