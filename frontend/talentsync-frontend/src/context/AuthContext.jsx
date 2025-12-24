import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 IMPORTANT: page reload par localStorage se load
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }

    setLoading(false);
  }, []);

  const login = (accessToken, userRole) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("role", userRole.toLowerCase());

    setToken(accessToken);
    setRole(userRole.toLowerCase());
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
  };

  // ⏳ jab tak localStorage load ho raha hai
 if (loading) {
  return null;
}
  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
