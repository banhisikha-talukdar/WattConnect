import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function PendingApplications() {
    const navigate = useNavigate();
    // const { token, logout } = useContext(AuthContext);

    // const handleLogout = () => {
    //     logout(); 
    //     navigate("/");
    // };

    // useEffect(() => {
    //     if (!token) {
    //         navigate("/");
    //     }
    // }, [token, navigate]);

    const handleLogout = () => navigate("/");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#01217e]">Pending Applications</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          Logout
        </button>
      </header>

      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-600">You have no pending applications yet.</p>
        {/* Replace this with actual data mapping once backend is integrated */}
      </div>
    </div>
  );
}
