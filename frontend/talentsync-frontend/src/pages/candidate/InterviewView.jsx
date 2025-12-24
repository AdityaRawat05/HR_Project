import { useEffect, useState } from "react";
import api from "../../utils/axios";

const InterviewView = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [slots, setSlots] = useState([]);
  const [myInterviews, setMyInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= FORMAT TIME ================= */
  const formatTime = (time) => {
    if (!time) return "-";
    return time.slice(0, 5);
  };

  /* ================= LOAD JOBS ================= */
  useEffect(() => {
    api
      .get("/jobs/")
      .then((res) => setJobs(res.data || []))
      .catch(() => setError("Failed to load jobs"));
  }, []);

  /* ================= LOAD SLOTS ================= */
  const loadSlots = async (jobId) => {
    setSelectedJob(jobId);
    setSlots([]);
    setError("");

    if (!jobId) return;

    setLoading(true);
    try {
      const res = await api.get(`/interviews/slots/${jobId}/`);
      setSlots(res.data || []);
    } catch {
      setError("Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD MY INTERVIEWS ================= */
  const loadMyInterviews = async () => {
    try {
      const res = await api.get("/interviews/my/");
      setMyInterviews(res.data || []);
    } catch {
      setError("Failed to load interviews");
    }
  };

  useEffect(() => {
    loadMyInterviews();
  }, []);

  /* ================= BOOK SLOT ================= */
  const bookSlot = async (slotId) => {
    try {
      await api.post(`/interviews/book/${slotId}/`);
      alert("Interview booked successfully ✅");

      loadMyInterviews();
      loadSlots(selectedJob);
    } catch {
      alert("Slot already booked ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Interview Booking</h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      {/* ================= JOB SELECT ================= */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <select
          value={selectedJob}
          onChange={(e) => loadSlots(e.target.value)}
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

      {/* ================= AVAILABLE SLOTS ================= */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">Available Slots</h2>

        {!selectedJob && (
          <p className="text-gray-500">Please select a job</p>
        )}

        {loading && <p className="text-gray-500">Loading slots...</p>}

        {selectedJob && !loading && slots.length === 0 && (
          <p className="text-gray-500">No slots available</p>
        )}

        {!loading &&
          slots.map((slot) => (
            <div
              key={slot.id}
              className="flex justify-between items-center border p-3 rounded mb-2 hover:bg-gray-50"
            >
              <span className="font-medium">
                {slot.date} | {formatTime(slot.start_time)} -{" "}
                {formatTime(slot.end_time)}
              </span>

              <button
                onClick={() => bookSlot(slot.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
              >
                Book
              </button>
            </div>
          ))}
      </div>

      {/* ================= MY INTERVIEWS ================= */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">My Interviews</h2>

        {myInterviews.length === 0 ? (
          <p className="text-gray-500">No interviews scheduled</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b text-gray-600">
              <tr>
                <th className="text-left p-2">Job</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {myInterviews.map((i) => (
                <tr
                  key={i.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-2">{i.job_title}</td>
                  <td className="p-2">
                    {i.slot ? i.slot.date : "-"}
                  </td>
                  <td className="p-2">
                    {i.slot
                      ? `${formatTime(i.slot.start_time)} - ${formatTime(
                          i.slot.end_time
                        )}`
                      : "-"}
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

export default InterviewView;
