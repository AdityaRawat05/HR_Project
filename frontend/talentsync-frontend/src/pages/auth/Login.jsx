import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ ONLY email & password
      const res = await loginUser({
        email,
        password,
      });

      // 🔥 BACKEND se role aata hai: HR / CANDIDATE / EMPLOYEE
      const backendRole = res.data.role.toLowerCase(); // hr / candidate / employee
      const accessToken = res.data.access;

      // ✅ Save in context + localStorage
      login(accessToken, backendRole);

      // ✅ Redirect by role
      if (backendRole === "hr") {
        navigate("/hr/dashboard", { replace: true });
      } else if (backendRole === "candidate") {
        navigate("/candidate/dashboard", { replace: true });
      } else if (backendRole === "employee") {
        navigate("/employee/dashboard", { replace: true });
      } else {
        setError("Invalid role assigned");
      }

    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-center mb-2">
          Login to TalentSync
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Access your dashboard
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2 mt-1"
              placeholder="user@test.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2 mt-1"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
