import { Navigate, Outlet, redirect, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("access_token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{redirectTo: location.pathname}} />;
  }

  return <Outlet />;
}
