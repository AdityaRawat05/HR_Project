import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

const HRInterviews = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");

  const [slots, setSlots] = useState([]);
  const [booked, setBooked] = useState([]);

  // create slot states
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // ================= LOAD JOBS =================
  useEffect(() => {
    axios
      .get(`${API_BASE}/jobs/`, authHeader)
      .then((res) => setJobs(res.data))
      .catch(() => setError("Failed to load jobs"));
  }, []);

  // ================= LOAD INTERVIEWS =================
  const loadInterviews = async (jobId) => {
    setSelectedJob(jobId);
    setSlots([]);
    setBooked([]);
    setError("");
    setMessage("");

    if (!jobId) return;

    try {
      const slotsRes = await axios.get(
        `${API_BASE}/interviews/slots/${jobId}/`,
        authHeader
      );
      setSlots(slotsRes.data || []);

      const bookedRes = await axios.get(
        `${API_BASE}/interviews/booked/${jobId}/`,
        authHeader
      );
      setBooked(bookedRes.data || []);
    } catch {
      setError("Failed to load interview data");
    }
  };

  // ================= CREATE SLOT =================
  const createSlot = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!selectedJob || !date || !startTime || !endTime) {
      setError("Please fill all fields");
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/interviews/slots/create/`,
        {
          job: selectedJob,
          date,
          start_time: startTime,
          end_time: endTime,
        },
        authHeader
      );

      setMessage("Interview slot created successfully");

      // reset fields
      setDate("");
      setStartTime("");
      setEndTime("");

      // reload slots
      loadInterviews(selectedJob);
    } catch {
      setError("Failed to create slot");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Interview Management (HR)
      </h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-100 text-green-600 p-3 mb-4 rounded">
          {message}
        </div>
      )}

      {/* ================= SELECT JOB ================= */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <label className="font-semibold block mb-2">Select Job</label>
        <select
          value={selectedJob}
          onChange={(e) => loadInterviews(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Job</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {/* ================= CREATE SLOT ================= */}
      {selectedJob && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Create Interview Slot
          </h2>

          <form
            onSubmit={createSlot}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border p-2 rounded"
            />

            <button
              type="submit"
              className="bg-indigo-600 text-white rounded px-4 py-2"
            >
              Create Slot
            </button>
          </form>
        </div>
      )}

      {/* ================= AVAILABLE SLOTS ================= */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">Available Slots</h2>

        {slots.length === 0 ? (
          <p className="text-gray-500">No available slots</p>
        ) : (
          <ul className="space-y-2">
            {slots.map((s) => (
              <li
                key={s.id}
                className="border p-3 rounded flex justify-between"
              >
                <span>
                  {s.date} | {s.start_time} - {s.end_time}
                </span>
                <span className="text-green-600 font-medium">
                  Available
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ================= BOOKED INTERVIEWS ================= */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">
          Booked Interviews
        </h2>

        {booked.length === 0 ? (
          <p className="text-gray-500">No interviews scheduled</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="py-2">Candidate</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {booked.map((i) => (
                <tr key={i.id} className="border-b text-center">
                  <td>{i.candidate_email}</td>
                  <td>{i.slot?.date}</td>
                  <td>
                    {i.slot?.start_time} - {i.slot?.end_time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HRInterviews;
