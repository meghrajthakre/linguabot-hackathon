import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
const Login = () => {
  const [show, setShow] = useState(false);
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    email: "freeTire@mail.com",
    password: "12345",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", form, {
        withCredentials: true,
      });

      setUser(res.data.user);   // 🔥 update auth context
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f3efe6] to-[#e8e1d2] px-6">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/40">

        <div className="flex flex-col items-center mb-6">
          <div className="bg-yellow-400 text-white px-4 py-2 rounded-xl font-bold text-lg shadow">
            🤖 LinguaBot
          </div>
          <h2 className="text-2xl font-bold mt-4 text-gray-800">
            Welcome Back
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              type="email"
              placeholder="Email address"
              className="w-full pl-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              name="password"
              value={form.password} 
              onChange={handleChange}
              required
              type={show ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <div
              className="absolute right-3 top-3.5 cursor-pointer text-gray-400"
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-xl shadow-md transition"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have account?
          <Link to="/signup" className="text-yellow-600 font-semibold ml-1">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;