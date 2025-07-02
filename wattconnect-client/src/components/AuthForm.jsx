import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function AuthForm({ mode }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isNewApplicant, setIsNewApplicant] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "signup" && formData.role === "customer" && !isNewApplicant) {
      alert("Please answer whether you are a new applicant.");
      return;
    }

    if (
      mode === "signup" &&
      formData.role === "customer" &&
      isNewApplicant === "no"
    ) {
      const isValidConsumerNumber = /^\d{12}$/.test(formData.consumerNumber.trim());

      if (!isValidConsumerNumber) {
        alert("Invalid consumer number");
        return;
      }

      if (!formData.usageType.trim() || !formData.category.trim()) {
        alert("Please fill in usage type and category.");
        return;
      }
    }

    if (mode === "signup" && formData.role === "customer" && isExistingCustomer === null) {
      alert("Please answer whether you are an existing customer.");
      return;
    }
    if (mode === "signup" && formData.role === "customer" && isExistingCustomer === "yes") {
      const isValidConsumerNumber = /^\d{12}$/.test(formData.consumerNumber.trim());

      if (!isValidConsumerNumber) {
        alert("Invalid consumer number (must be exactly 12 digits)");
        return;
      }
      if (!formData.usageType || !formData.category) {
        alert("Please select both usage type and category.");
        return;
      }
    }

    const endpoint = mode === "signup" 
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    const payload =
      mode === "signup"
        ? {
            name: formData.fullName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          }
        : {
            email: formData.email,
            password: formData.password,
          };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("🟢 Response:", data);

      if (!response.ok) {
        alert(data.error || data.message || "Something went wrong");
        return;
      }
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user?.role === "admin") {
        navigate("/admin/home");
      } else if (mode === "signup" && formData.role === "customer") {
        if (isNewApplicant === "yes") {
          navigate("/customer/new-application");
        } else {
          navigate("/customer/dashboard");
        }
      } else {
        navigate("/customer/dashboard");
      }
    } catch (error) {
      console.error("Network or server error:", error);
      alert("Network or server error. Please check your connection and try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {mode === "signup" && (
        <>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => handleInputChange("fullName", e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => handleInputChange("username", e.target.value)}
          />
        </>
      )}

      <input
        type="email"
        placeholder="Email Address"
        value={formData.email}
        required
        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(e) => handleInputChange("email", e.target.value)}
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={formData.password}
          required
          className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <span className="absolute right-3 top-2/4 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <select
        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      >
        <option value="customer">Customer</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit" className="bg-[#01217e] hover:bg-[#f0920f] text-white font-semibold py-2 rounded transition duration-100 py-2 px-25 mx-auto block">
        {mode === "login" ? "Login" : "Sign Up"}
      </button>
    </form>
  );
}
