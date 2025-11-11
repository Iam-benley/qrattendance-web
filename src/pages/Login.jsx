// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { api } from "../api/axios";
import { KeyRound } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { setAuthUser } from "../utils/auth";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const nextUrl =
    new URLSearchParams(location.search).get("next") || "/dashboard";

  async function handleLogin() {
    const value = code.trim().toUpperCase();
    if (value.length !== 5) {
      toast.error("Please enter a valid 5-character code.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/login-with-code", {
        code: value,
      });

      if (!response.data.ok) {
        throw new Error(response.data.error || "Invalid code");
      }

      // ✅ Save login locally
      setAuthUser({
        userId: response.data.userId,
        name: response.data.name,
        code: value,
      });

      toast.success("Signed in!");
      navigate(nextUrl, { replace: true });
    } catch (err) {
      alert(err);
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src="../public/HRMDD LOGO.jpg" // or update filename if needed
            alt="HRMDD Logo"
            className="h-16 w-auto mb-3"
            onError={(e) => {
              e.currentTarget.src = "/HRMDD%20LOGO.png";
            }}
          />
          <p className="text-gray-600 text-sm sm:text-base">
            Enter your access code to continue
          </p>
        </div>

        {/* Input & Button */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Code (5 characters)
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                maxLength={5}
                value={code}
                onKeyDown={onKeyDown}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. VQDY4"
                className="w-full tracking-widest uppercase text-center sm:text-left pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-600 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition shadow-md text-lg"
          >
            {loading ? "Signing in..." : "Enter"}
          </button>
        </div>
      </div>
    </div>
  );
}
