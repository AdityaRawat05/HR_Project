import { useState, useContext } from "react";
import { registerUser } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate"); // 🔥 lowercase only
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 🔥 SEND ROLE IN LOWERCASE
      const res = await registerUser({
        email,
        password,
        role, // "candidate" | "employee" | "hr"
      });

      // 🔥 BACKEND RESPONSE SAFE HANDLING
      if (res.data?.access && res.data?.role) {
        const backendRole = res.data.role.toLowerCase();

        // save token + role
        login(res.data.access, backendRole);

        // 🔥 CORRECT ROUTES
        if (backendRole === "hr") {
          navigate("/hr/dashboard", { replace: true });
        } else if (backendRole === "candidate") {
          navigate("/candidate/dashboard", { replace: true });
        } else if (backendRole === "employee") {
          navigate("/employee/dashboard", { replace: true });
        } else {
          setError("Invalid role returned from server");
        }
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setError("Registration failed. Email may already exist.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">

        <h2 className="text-2xl font-bold text-center">Create Account</h2>
        <p className="text-center text-gray-500 mb-6">
          Join the TalentSync network today
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ROLE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="candidate">Candidate</option>
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
            </select>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Register Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
