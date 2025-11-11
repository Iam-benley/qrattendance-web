import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { api } from "../api/axios";
import { getAuthUser } from "../utils/auth";
import toast from "react-hot-toast";

export default function AttendancePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const [eventInfo, setEventInfo] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authUser = getAuthUser();
    if (!authUser) {
      navigate("/");
      return;
    }
    setUser(authUser);

    const eventId = searchParams.get("event");
    if (!eventId) {
      setStatus("error");
      setMessage("No event ID provided");
      return;
    }

    recordAttendance(eventId, authUser);
  }, [searchParams, navigate]);

  const recordAttendance = async (eventId, authUser) => {
    try {
      const response = await api.post("/api/attendance/record", {
        eventId,
        userId: authUser.userId,
        timestamp: new Date().toISOString(),
      });

      if (response.data.ok) {
        setStatus("success");
        setMessage(response.data.message || "Attendance recorded successfully!");
        setEventInfo(response.data.event);
        
        // Redirect back to dashboard after 3 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(response.data.error || "Failed to record attendance");
      }
    } catch (err) {
      console.error("Attendance error:", err);
      setStatus("error");
      setMessage(
        err.response?.data?.error || "Error recording attendance. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-teal-700 hover:text-teal-600 font-semibold mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {status === "loading" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin"></div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Recording Attendance
              </h2>
              <p className="text-gray-600">Please wait...</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Attendance Recorded!
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              {eventInfo && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                  <div className="text-sm text-gray-600 mb-1">Event:</div>
                  <div className="font-semibold text-gray-900">
                    {eventInfo.name || `Event ${eventInfo.id}`}
                  </div>
                  {eventInfo.time && (
                    <>
                      <div className="text-sm text-gray-600 mt-3 mb-1">Time:</div>
                      <div className="text-gray-900">
                        {new Date(eventInfo.time).toLocaleString()}
                      </div>
                    </>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-500">
                Redirecting to dashboard in 3 seconds...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Error
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-teal-700 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* User Info */}
        {user && (
          <div className="mt-6 bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Checked in as:</p>
            <p className="font-semibold text-gray-900">{user.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}

