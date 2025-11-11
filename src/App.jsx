import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AttendancePage from "./pages/Attendance";
import PrivateRoute from "./routes/PrivateRoute";
import GenerateAttendance from "./pages/GenerateAttendace";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/generate" element={<GenerateAttendance />} />
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendance" element={<AttendancePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </>
  );
}
