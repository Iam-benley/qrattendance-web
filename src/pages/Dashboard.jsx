import React, { useEffect, useState } from "react";
import { QrCode, X } from "lucide-react";
import { getAuthUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import { api } from "../api/axios";
import toast from "react-hot-toast";

export default function QRGeneratorPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authUser = getAuthUser();
    if (authUser) {
      setUser(authUser);
    }
  }, []);

  const handleScanQR = async (result) => {
    if (!result) return;

    // Handle different result formats
    const scannedData =
      typeof result === "string"
        ? result
        : result[0]?.rawValue || result.text || result;
    console.log("Scanned QR:", scannedData);

    // Close scanner immediately
    setShowScanner(false);

    // Get user's code from localStorage
    const authUser = getAuthUser();
    if (!authUser || !authUser.code) {
      toast.error("User code not found. Please login again.");
      return;
    }

    try {
      // Call the API to scan the employee using the user's code from localStorage
      const response = await api.post("/qr/scan", {
        code: authUser.code,
      });

      const data = response.data;

      if (data.ok) {
        const { employee, alreadyScanned, scanTime } = data;

        if (alreadyScanned) {
          toast.success(
            `${employee.name} already scanned!\nFirst scan: ${new Date(
              scanTime
            ).toLocaleTimeString()}`,
            { duration: 4000 }
          );
        } else {
          toast.success(
            `✅ ${employee.name}\n${employee.position} - ${
              employee.section
            }\nScanned at: ${new Date(scanTime).toLocaleTimeString()}`,
            { duration: 4000 }
          );
        }
      } else {
        toast.error(data.message || "Scan failed");
      }
    } catch (error) {
      console.error("Scan error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to scan QR code. Please try again."
      );
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">
              QR Attendance
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

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Scan Event QR
              </h2>
              <button
                onClick={() => setShowScanner(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <Scanner
                onScan={handleScanQR}
                onError={(error) => console.error(error)}
              />
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              Point your camera at the event QR code
            </p>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="w-full px-4 sm:px-6 py-6 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Welcome, {user?.name || "User"}
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Scan an event QR code to record your attendance
              </p>
            </div>

            <button
              onClick={() => setShowScanner(true)}
              className="bg-teal-700 hover:bg-teal-600 text-white px-12 py-6 rounded-2xl font-bold text-xl transition flex items-center gap-4 shadow-lg hover:shadow-xl"
            >
              <QrCode className="w-8 h-8" />
              Scan QR Code
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
