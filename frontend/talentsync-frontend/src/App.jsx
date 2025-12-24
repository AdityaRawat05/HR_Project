import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import HRDashboard from "./pages/hr/HRDashboard";
import HRInterviews from "./pages/hr/HRInterviews";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import InterviewView from "./pages/candidate/InterviewView";

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";

import ProtectedRoute from "./components/Protected";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= DEFAULT ================= */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ================= PUBLIC ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= HR ================= */}
        <Route
          path="/hr/dashboard"
          element={
            <ProtectedRoute allowedRoles={["hr"]}>
              <HRDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/interviews"
          element={
            <ProtectedRoute allowedRoles={["hr"]}>
              <HRInterviews />
            </ProtectedRoute>
          }
        />

        {/* ================= CANDIDATE ================= */}
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/interviews"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <InterviewView />
            </ProtectedRoute>
          }
        />

        {/* ================= EMPLOYEE ================= */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
