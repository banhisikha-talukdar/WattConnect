import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function AuthForm({ mode }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isExistingCustomer, setIsExistingCustomer] = useState(null); // null, true, false

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: "customer",
    consumerNumber: "",
    usageType: "",
    category: "",
  });

  const categoryOptions = {
    domestic: [
      "LT-I Jeevan Dhara",
      "LT-II Domestic A",
      "LT-III Domestic B",
      "LT-X Electric Vehicle Charging",
      "LT-VII Agriculture",
    ],
    commercial: [
      "LT-IV Commercial",
      "LT-V General Purpose",
      "LT-VI Public Lighting",
      "LT-VIII(i) Small Industries Rural",
      "LT-VIII(ii) Small Industries Urban",
      "LT-XI Interstate Sale",
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "signup" && formData.role === "customer" && isExistingCustomer === null) {
      alert("Please answer whether you are an existing customer.");
      return;
    }

    if (mode === "signup" && formData.role === "customer" && isExistingCustomer === true) {
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

    const endpoint =
      mode === "signup"
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
            isExistingCustomer:
              formData.role === "customer" ? isExistingCustomer : undefined,
            ...(formData.role === "customer" &&
              isExistingCustomer === true && {
                consumerNumber: formData.consumerNumber,
                usageType: formData.usageType,
                category: formData.category,
              }),
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

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || data.message || "Something went wrong");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (mode === "signup" && formData.role === "customer") {
        if (isExistingCustomer === true) {
          navigate("/customer/dashboard");
        } else {
          navigate("/customer/new-application");
        }
      } else if (mode === "login") {
        if (data.user?.role === "admin" || formData.role === "admin") {
          navigate("/admin/home");
        } else {
          navigate("/customer/dashboard");
        }
      } else if (formData.role === "admin") {
        navigate("/admin/home");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (error) {
      console.error("Network or server error:", error);
      alert("Network or server error. Please check your connection and try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          onChange={(e) => handleInputChange("password", e.target.value)}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <select
        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={formData.role}
        onChange={(e) => {
          handleInputChange("role", e.target.value);
          if (mode === "signup") {
            setIsExistingCustomer(null); // reset only during signup
          }
        }}
      >
        <option value="customer">Customer</option>
        <option value="admin">Admin</option>
      </select>

      {mode === "signup" && formData.role === "customer" && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Are you an existing customer?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="existingCustomer"
                checked={isExistingCustomer === true}
                onChange={() => setIsExistingCustomer(true)}
              />
              Yes
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="existingCustomer"
                checked={isExistingCustomer === false}
                onChange={() => setIsExistingCustomer(false)}
              />
              No
            </label>
          </div>
        </div>
      )}

      {mode === "signup" && formData.role === "customer" && isExistingCustomer === true && (
        <>
          <input
            type="text"
            placeholder="Consumer Number (12 digits)"
            value={formData.consumerNumber}
            required
            maxLength={12}
            pattern="\d{12}"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              handleInputChange("consumerNumber", numericValue);
            }}
          />

          <select
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.usageType}
            onChange={(e) => {
              handleInputChange("usageType", e.target.value);
              handleInputChange("category", "");
            }}
          >
            <option value="">Select Usage Type</option>
            <option value="domestic">Domestic</option>
            <option value="commercial">Commercial</option>
          </select>

          {formData.usageType && (
            <select
              required
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
            >
              <option value="">Select Category</option>
              {categoryOptions[formData.usageType]?.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </>
      )}

      <button
        type="submit"
        className="bg-[#01217e] hover:bg-[#f0920f] text-white font-semibold py-2 rounded transition duration-200 px-6 mx-auto block"
      >
        {mode === "login" ? "Login" : "Sign Up"}
      </button>
    </form>
  );
}
