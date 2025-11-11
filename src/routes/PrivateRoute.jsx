// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthed } from "../utils/auth";

export default function PrivateRoute() {
  const location = useLocation();
  if (!isAuthed()) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
