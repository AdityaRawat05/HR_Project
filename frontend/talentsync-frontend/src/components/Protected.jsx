import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Protected = ({ children, allowedRoles }) => {
  const { token, role } = useContext(AuthContext);

  // 🔒 User not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Role check (CASE FIX 🔥)
  const normalizedRoles = allowedRoles?.map(r => r.toLowerCase());

  if (normalizedRoles && !normalizedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Access allowed
  return children;
};

export default Protected;
