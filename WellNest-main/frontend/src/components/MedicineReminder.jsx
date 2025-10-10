import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const backendUrl = "https://well-nest-final-molh.vercel.app";

const MedicineReminder = () => {
  const { user } = useAuth0();
  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState("daily");
  const [reminders, setReminders] = useState([]);

  // Fetch reminders for this user
  useEffect(() => {
    if (user?.email) fetchReminders();
  }, [user]);

  const fetchReminders = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/reminders/get-reminders`, {
        email: user.email,
      });
      // Combine active and history if you want to show all
      setReminders([...res.data.active, ...res.data.history]);
    } catch (err) {
      console.error("Error fetching reminders:", err.message);
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!medicine || !time) return alert("Please fill in all required fields");

    try {
      await axios.post(`${backendUrl}/api/reminders/add-reminder`, {
        email: user.email,
        medicine,
        dosage,
        time,
        repeat,
        status: "Active", // default status
      });
      alert("💊 Reminder added successfully!");
      setMedicine("");
      setDosage("");
      setTime("");
      fetchReminders();
    } catch (err) {
      console.error("Error adding reminder:", err.message);
    }
  };

  const deleteReminder = async (id) => {
    if (!window.confirm("Delete this reminder?")) return;
    try {
      await axios.delete(`${backendUrl}/api/reminders/delete-reminder/${id}`);
      fetchReminders();
    } catch (err) {
      console.error("Error deleting reminder:", err.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        💊 Medicine Reminder Dashboard
      </h2>

      {/* Add Reminder */}
      <form
        onSubmit={handleAddReminder}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <input
          type="text"
          placeholder="Medicine Name"
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
          required
        />
        <input
          type="text"
          placeholder="Dosage (optional)"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
          required
        />
        <select
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <button
          type="submit"
          className="md:col-span-2 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          ➕ Add Reminder
        </button>
      </form>

      {/* Reminders List */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          ⏰ Active Reminders
        </h3>
        {reminders.length > 0 ? (
          <ul className="space-y-3">
            {reminders.map((r) => (
              <li
                key={r._id}
                className="flex justify-between items-center border border-gray-200 p-3 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {r.medicine}{" "}
                    <span className="text-sm text-gray-500">
                      ({r.dosage || "as prescribed"})
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    ⏰ {r.time} | 🔁 {r.repeat} | 🟢 {r.status}
                  </p>
                </div>
                <button
                  onClick={() => deleteReminder(r._id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  ❌ Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No reminders added yet.</p>
        )}
      </div>
    </div>
  );
};

export default MedicineReminder;
