import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-5">
      <h1 className="text-xl font-bold mb-8">TalentSync</h1>

      <nav className="space-y-3">
        <NavLink className="block p-3 rounded bg-teal-600" to="/hr">
          Dashboard
        </NavLink>
        <NavLink className="block p-3 rounded hover:bg-slate-800" to="#">
          Jobs
        </NavLink>
        <NavLink className="block p-3 rounded hover:bg-slate-800" to="#">
          Candidates
        </NavLink>
        <NavLink className="block p-3 rounded hover:bg-slate-800" to="#">
          Interview Slots
        </NavLink>
        <NavLink className="block p-3 rounded hover:bg-slate-800" to="#">
          HR Chatbot
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
