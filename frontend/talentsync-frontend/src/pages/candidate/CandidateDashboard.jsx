import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api";

const CandidateDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
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

  /* ================= FETCH APPLICATIONS ================= */
  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/candidates/my-resumes/`,
        authHeader
      );
      setApplications(res.data);
    } catch {
      setApplications([]);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  /* ================= UPLOAD RESUME ================= */
  const uploadResume = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!selectedJob || !resumeFile) {
      setError("Please select a job and upload resume");
      return;
    }

    const formData = new FormData();
    formData.append("job", selectedJob);
    formData.append("resume_file", resumeFile);

    try {
      const res = await axios.post(
        `${API_BASE}/candidates/upload/`,
        formData,
        authHeader
      );

      setMessage(`Application submitted | Status: ${res.data.status}`);
      setSelectedJob("");
      setResumeFile(null);
      fetchApplications();
    } catch {
      setError("Resume upload failed");
    }
  };

  const latestApplication = applications[0];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Candidate Dashboard</h1>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* ERROR / MESSAGE */}
      {error && <div className="bg-red-100 text-red-600 p-3 mb-4">{error}</div>}
      {message && (
        <div className="bg-green-100 text-green-600 p-3 mb-4">{message}</div>
      )}

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Jobs Applied</p>
          <h2 className="text-2xl font-bold">{applications.length}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Latest Status</p>
          <h2 className="text-xl font-bold">
            {latestApplication ? latestApplication.status : "—"}
          </h2>
        </div>
      </div>

      {/* ================= APPLY ================= */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload Resume & Apply</h2>

        <form onSubmit={uploadResume} className="space-y-4">
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="w-full"
          />

          <button className="bg-indigo-600 text-white px-6 py-2 rounded">
            Upload Resume
          </button>
        </form>
      </div>

      {/* ================= APPLICATION STATUS ================= */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Application Status</h2>

        {!latestApplication ? (
          <p className="text-gray-500">No applications yet</p>
        ) : (
          <div>
            <p><b>Job:</b> {latestApplication.job_title}</p>
            <p>
              <b>Score:</b>{" "}
              {latestApplication.score
                ? `${latestApplication.score.toFixed(2)}%`
                : "-"}
            </p>

            <span
              className={`inline-block mt-2 px-3 py-1 rounded text-sm
              ${
                latestApplication.status === "REJECTED"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {latestApplication.status}
            </span>
          </div>
        )}
      </div>

      {/* ================= INTERVIEW SECTION ================= */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Interviews</h2>

        <p className="text-gray-600 mb-4">
          View and book interview slots for shortlisted jobs.
        </p>

        <button
          onClick={() => navigate("/candidate/interviews")}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          View Interview Slots
        </button>
      </div>
    </div>
  );
};

export default CandidateDashboard;
