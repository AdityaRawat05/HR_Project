import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

const EmployeeDashboard = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ================= SEND QUESTION ================= */
  const sendQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await api.post("/chatbot/ask/", { question });

      const botMsg = {
        sender: "bot",
        text: res.data.answer || "No response from HR assistant.",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg flex flex-col">

        {/* ================= HEADER ================= */}
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">HR Assistant 🤖</h2>
            <p className="text-sm text-gray-500">
              Ask HR-related questions anytime
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* ================= MESSAGES ================= */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
              Ask about leave policy, work hours, benefits, etc.
            </p>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[75%] p-3 rounded-lg text-sm break-words
                ${
                  msg.sender === "user"
                    ? "bg-teal-600 text-white ml-auto"
                    : "bg-gray-200 text-gray-800"
                }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <p className="text-gray-400 text-sm">
              HR Assistant is typing...
            </p>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* ================= INPUT ================= */}
        <form
          onSubmit={sendQuestion}
          className="p-4 border-t flex gap-2"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
