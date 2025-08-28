import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useAuth0 } from '@auth0/auth0-react';

const Dashboard = () => {
  const [scores, setScores] = useState(null);
  const { user } = useAuth0();
  useEffect(() => {
    axios
      .post("https://wellnest-5zry.onrender.com/api/user-scores", {
        email: user.email,
      })
      .then((res) => setScores(res.data))
      .catch((err) => console.error("Error fetching scores:", err));
  }, []);

  if (!scores) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading your scores...
      </div>
    );
  }

  // Helper to get latest score
  const getLatest = (arr) => (arr && arr.length ? arr[arr.length - 1] : 0);

  // Helper to prepare data for chart
  const prepareChartData = (arr) =>
    arr.map((score, index) => ({ name: `${index + 1}`, score }));

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-8">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">
        Your Mental Health Dashboard 
      </h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-purple-500 text-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold">Depression</h2>
          <p className="text-3xl font-bold">{getLatest(scores.depressionScores)}</p>
        </div>
        <div className="bg-blue-500 text-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold">Anxiety</h2>
          <p className="text-3xl font-bold">{getLatest(scores.anxietyScores)}</p>
        </div>
        <div className="bg-pink-500 text-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold">OCD</h2>
          <p className="text-3xl font-bold">{getLatest(scores.ocdScores)}</p>
        </div>
        <div className="bg-green-500 text-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold">Wellness</h2>
          <p className="text-3xl font-bold">{getLatest(scores.wellnessScores)}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "Depression", data: scores.depressionScores, color: "#8884d8" },
          { title: "Anxiety", data: scores.anxietyScores, color: "#82ca9d" },
          { title: "OCD", data: scores.ocdScores, color: "#ffc658" },
          { title: "Wellness", data: scores.wellnessScores, color: "#ff6b6b" },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
              {item.title} Scores Over Time
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prepareChartData(item.data)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill={item.color} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
