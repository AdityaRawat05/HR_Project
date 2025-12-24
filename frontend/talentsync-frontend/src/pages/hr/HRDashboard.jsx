import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api";

const HRDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  /* ================= FETCH JOBS ================= */
  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/jobs/`, authHeader);
      setJobs(res.data);
    } catch {
      setError("Failed to load jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* ================= CREATE JOB ================= */
  const createJob = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        `${API_BASE}/jobs/create/`,
        {
          title,
          description,
          skills,
          experience: Number(experience),
        },
        authHeader
      );

      setTitle("");
      setDescription("");
      setSkills("");
      setExperience("");
      fetchJobs();
    } catch {
      setError("Job creation failed. Fill all fields correctly.");
    }
  };

  /* ================= FETCH CANDIDATES ================= */
  const fetchCandidates = async (jobId) => {
    setSelectedJob(jobId);
    try {
      const res = await axios.get(
        `${API_BASE}/candidates/ranked/${jobId}/`,
        authHeader
      );
      setCandidates(res.data);
    } catch {
      setError("Failed to load candidates");
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateCandidateStatus = async (resumeId, status) => {
    try {
      await axios.patch(
        `${API_BASE}/candidates/update-status/${resumeId}/`,
        { status },
        authHeader
      );

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === resumeId ? { ...c, status } : c
        )
      );
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">HR Dashboard</h1>
          <p className="text-gray-500">Manage jobs & candidates</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/hr/interviews")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Interview Slots
          </button>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* ================= POST JOB ================= */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Post New Job</h2>

        <form onSubmit={createJob} className="space-y-4">
          <input
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          <textarea
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2 h-24"
          />

          <input
            type="text"
            placeholder="Required Skills (React, Django, SQL)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="number"
            placeholder="Experience (years)"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
            Create Job
          </button>
        </form>
      </div>

      {/* ================= JOB LIST ================= */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Open Jobs</h2>

        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs available</p>
        ) : (
          <ul className="space-y-2">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <span className="font-medium">{job.title}</span>
                <button
                  onClick={() => fetchCandidates(job.id)}
                  className="text-indigo-600 hover:underline"
                >
                  View Candidates
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ================= CANDIDATES ================= */}
      {selectedJob && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Candidates (Job ID: {selectedJob})
          </h2>

          {candidates.length === 0 ? (
            <p className="text-gray-500">No candidates yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b text-gray-600">
                <tr>
                  <th>Email</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td>{c.email}</td>
                    <td className="text-center">
                      {c.score ? `${c.score.toFixed(2)}%` : "-"}
                    </td>
                    <td className="text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs
                        ${
                          c.status === "SHORTLISTED"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="text-center space-x-2">
                      <button
                        onClick={() =>
                          updateCandidateStatus(c.id, "SHORTLISTED")
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          updateCandidateStatus(c.id, "REJECTED")
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default HRDashboard;
