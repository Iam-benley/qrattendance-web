// src/pages/GenerateAttendance.jsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getAuthUser } from "../utils/auth";
import { api } from "../api/axios";
import toast from "react-hot-toast";

export default function GenerateAttendance() {
  const [user, setUser] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authUser = getAuthUser();
    if (authUser) setUser(authUser);
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const validateRange = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both start and end dates.");
      return false;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      toast.error("Start date must be before end date.");
      return false;
    }
    return true;
  };

  const handleGenerateCSV = async () => {
    if (!validateRange()) return;
    const authUser = getAuthUser();
    if (!authUser || !authUser.code) {
      toast.error("User code not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      // Adjust endpoint name as needed on your backend.
      const response = await api.post(
        "/attendance/export",
        {
          from: fromDate,
          to: toDate,
          code: authUser.code,
        },
        {
          responseType: "blob", // important for file download
        }
      );

      // Attempt to detect filename from headers, fallback to a sensible default
      const disposition = response.headers?.["content-disposition"];
      let filename = `attendance_${fromDate}_${toDate}.csv`;
      if (disposition) {
        const match = disposition.match(/filename="?(.+)"?/);
        if (match && match[1]) filename = match[1];
      }

      // Create blob and download
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("CSV generated & downloaded.");
    } catch (error) {
      console.error("Export error:", error);
      const msg =
        error?.response?.data?.message ||
        "Failed to generate CSV. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">
              Generate Attendance
            </h1>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-gray-900">
                  {user?.name || "User"}
                </div>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-teal-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(user?.name)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="w-full px-4 sm:px-6 py-6 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Export Attendance CSV
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Select a date range and generate a CSV of attendance records.
              </p>
            </div>

            <div className="w-full bg-white rounded-2xl shadow-md p-8">
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-700 mr-2">
                    Date Range:
                  </label>

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  />

                  <span className="text-gray-400">—</span>

                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  />
                </div>

                <button
                  onClick={handleGenerateCSV}
                  disabled={loading}
                  className={`mt-2 w-64 py-3 rounded-2xl font-bold text-lg transition shadow-lg ${
                    loading
                      ? "bg-teal-400 cursor-not-allowed text-white"
                      : "bg-teal-700 hover:bg-teal-600 text-white"
                  }`}
                >
                  {loading ? "Generating..." : "Generate CSV"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
