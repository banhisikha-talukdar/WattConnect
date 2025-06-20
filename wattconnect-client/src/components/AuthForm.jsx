import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ mode }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          }
        : {
            email: formData.email,
            password: formData.password,
          };

    console.log("📤 Sending payload to:", endpoint);
    console.log("📦 Payload:", payload);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("🟢 Response:", data);

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      navigate("/customer/home");
    } catch (err) {
      console.error("❌ Network or server error:", err);
      alert("Network or server error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {mode === "signup" && (
        <>
          <input
            type="text"
            placeholder="Full Name"
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Username"
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </>
      )}

      <input
        type="email"
        placeholder="Email Address"
        required
        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        required
        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      <select
        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      >
        <option value="customer">Customer</option>
        <option value="admin">Admin</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200"
      >
        {mode === "login" ? "Login" : "Sign Up"}
      </button>
    </form>
  );
}
