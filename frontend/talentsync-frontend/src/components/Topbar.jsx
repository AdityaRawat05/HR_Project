import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Topbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="flex justify-between items-center bg-white p-4 shadow">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <button
        onClick={logout}
        className="text-sm bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;
