import React, { useEffect, useState } from "react";
import axios from "axios";
import MedicineReminder from "./MedicineReminder";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
  LabelList,
} from "recharts";

import { useAuth0 } from "@auth0/auth0-react";

const Dashboard = () => {
  const [scores, setScores] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [quote, setQuote] = useState("");
  const { user } = useAuth0();

  const quotes = [
    "Healing takes time, and asking for help is a courageous step.",
    "You are stronger than you think and braver than you believe.",
    "Your feelings are valid, and so is your journey.",
    "Progress, not perfection, is what matters.",
    "Every day is a new opportunity to find peace within yourself.",
    "Self-care is how you take your power back.",
    "You deserve rest, love, and understanding—especially from yourself.",
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    if (user && user.email) {
      axios
        .post("https://well-nest-final-molh.vercel.app/api/user-scores", {
          email: user.email,
        })
        .then((res) => {
          setScores(res.data);
          setLoaded(true);
        })
        .catch((err) => {
          console.error("Error fetching scores:", err);
          if (err?.response?.status === 404) {
            // Gracefully handle new users with no data yet
            setScores({
              depressionScores: [],
              anxietyScores: [],
              ocdScores: [],
              wellnessScores: [],
            });
            setLoaded(true);
          } else {
            // Fallback: still allow UI to render onboarding safely
            setScores({
              depressionScores: [],
              anxietyScores: [],
              ocdScores: [],
              wellnessScores: [],
            });
            setLoaded(true);
          }
        });
    }
  }, [user]);

  if (!loaded) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold bg-[radial-gradient(1200px_600px_at_15%_-10%,#eef2ff,transparent_45%),radial-gradient(900px_450px_at_100%_-10%,#ffe4f1,transparent_55%),linear-gradient(to_bottom_right,#f8fbff,#fff)]">
        <div className="w-full max-w-md space-y-4 px-6">
          <div className="h-16 rounded-3xl bg-white/70 backdrop-blur border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] animate-pulse" />
          <div className="h-10 rounded-2xl bg-white/70 backdrop-blur border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] animate-pulse" />
          <div className="h-24 rounded-3xl bg-white/70 backdrop-blur border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] animate-pulse" />
          <div className="text-slate-600 text-center">Loading your scores...</div>
        </div>
      </div>
    );
  }

  const getLatest = (arr) => (arr && arr.length ? arr[arr.length - 1] : 0);
  const prepareChartData = (arr) =>
    (arr || []).map((score, index) => ({ name: `${index + 1}`, score }));

  const isArrayEmpty = (a) => Array.isArray(a) && a.length === 0;
  const isNewUser =
    isArrayEmpty(scores.depressionScores) &&
    isArrayEmpty(scores.anxietyScores) &&
    isArrayEmpty(scores.ocdScores) &&
    isArrayEmpty(scores.wellnessScores);

  const ChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white/90 backdrop-blur px-3 py-2 shadow-lg">
          <div className="text-xs text-slate-500">Entry {label}</div>
          <div className="text-sm font-semibold text-slate-700">
            Score: {payload[0].value}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-[radial-gradient(1200px_600px_at_15%_-10%,#e9edff,transparent_45%),radial-gradient(1000px_500px_at_100%_-10%,#ffe9f3,transparent_55%),linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)]">
      <div className="relative max-w-4xl mx-auto mb-10">
        <div className="absolute -top-12 -left-10 h-48 w-48 bg-violet-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-14 -right-10 h-56 w-56 bg-pink-300/30 rounded-full blur-3xl" />
        <div className="relative bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_60px_-20px_rgba(56,56,120,0.25)] ring-1 ring-violet-200/50 rounded-[28px] p-6 md:p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center text-2xl shadow-lg">
              🌿
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800">
              Hello, {user?.name?.split(" ")[0]}
            </h1>
          </div>
          <p className="text-lg md:text-xl text-slate-700 italic leading-relaxed max-w-2xl mx-auto">
            “{quote}”
          </p>
        </div>
      </div>

      {!isNewUser ? (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-8 tracking-tight">
            Your Mental Health Dashboard
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="group relative overflow-hidden rounded-3xl p-6 text-center border border-white shadow-[0_18px_50px_-20px_rgba(139,92,246,0.5)] ring-1 ring-violet-200/60 bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 text-white">
              <div className="absolute -top-10 -right-8 h-28 w-28 bg-white/20 rounded-full blur-2xl" />
              <h2 className="text-base font-semibold/relaxed opacity-95">Depression</h2>
              <p className="text-5xl font-black tracking-tight mt-2 drop-shadow-sm">
                {getLatest(scores.depressionScores)}
              </p>
              <div className="mt-3 text-xs opacity-90">Latest entry</div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl p-6 text-center border border-white shadow-[0_18px_50px_-20px_rgba(6,182,212,0.5)] ring-1 ring-cyan-200/60 bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 text-white">
              <div className="absolute -top-10 -right-8 h-28 w-28 bg-white/20 rounded-full blur-2xl" />
              <h2 className="text-base font-semibold/relaxed opacity-95">Anxiety</h2>
              <p className="text-5xl font-black tracking-tight mt-2 drop-shadow-sm">
                {getLatest(scores.anxietyScores)}
              </p>
              <div className="mt-3 text-xs opacity-90">Latest entry</div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl p-6 text-center border border-white shadow-[0_18px_50px_-20px_rgba(244,63,94,0.45)] ring-1 ring-rose-200/60 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 text-white">
              <div className="absolute -top-10 -right-8 h-28 w-28 bg-white/20 rounded-full blur-2xl" />
              <h2 className="text-base font-semibold/relaxed opacity-95">OCD</h2>
              <p className="text-5xl font-black tracking-tight mt-2 drop-shadow-sm">
                {getLatest(scores.ocdScores)}
              </p>
              <div className="mt-3 text-xs opacity-90">Latest entry</div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl p-6 text-center border border-white shadow-[0_18px_50px_-20px_rgba(16,185,129,0.5)] ring-1 ring-emerald-200/60 bg-gradient-to-br from-emerald-500 via-teal-500 to-lime-500 text-white">
              <div className="absolute -top-10 -right-8 h-28 w-28 bg-white/20 rounded-full blur-2xl" />
              <h2 className="text-base font-semibold/relaxed opacity-95">Wellness</h2>
              <p className="text-5xl font-black tracking-tight mt-2 drop-shadow-sm">
                {getLatest(scores.wellnessScores)}
              </p>
              <div className="mt-3 text-xs opacity-90">Latest entry</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Depression", data: scores.depressionScores, color: "#8b5cf6", gradId: "grad-dep" },
              { title: "Anxiety", data: scores.anxietyScores, color: "#06b6d4", gradId: "grad-anx" },
              { title: "OCD", data: scores.ocdScores, color: "#f59e0b", gradId: "grad-ocd" },
              { title: "Wellness", data: scores.wellnessScores, color: "#10b981", gradId: "grad-well" },
            ].map((item) => {
              const data = prepareChartData(item.data);
              const avg =
                data.length ? Math.round((data.reduce((s, d) => s + d.score, 0) / data.length) * 10) / 10 : 0;
              const maxVal = data.length ? Math.max(...data.map((d) => d.score)) : 0;

              return (
                <div
                  key={item.title}
                  className="relative overflow-hidden rounded-3xl p-6 bg-white/85 backdrop-blur-xl border border-white ring-1 ring-slate-200/60 shadow-[0_18px_55px_-30px_rgba(30,41,59,0.45)]"
                >
                  <div className="absolute -top-8 -left-8 h-24 w-24 bg-indigo-100/50 rounded-full blur-2xl" />
                  <div className="absolute -bottom-10 -right-10 h-28 w-28 bg-pink-100/50 rounded-full blur-2xl" />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg md:text-xl font-bold text-slate-800">
                        {item.title} Scores Over Time
                      </h2>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                          Avg: {avg}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                          Max: {maxVal}
                        </span>
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={data} barCategoryGap={18}>
                        <defs>
                          <linearGradient id={item.gradId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={item.color} stopOpacity={0.95} />
                            <stop offset="100%" stopColor={item.color} stopOpacity={0.55} />
                          </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#64748b" tickMargin={8} />
                        <YAxis stroke="#64748b" tickMargin={6} />
                        <Tooltip content={<ChartTooltip />} />
                        <Legend />

                        <ReferenceLine
                          y={avg}
                          stroke="#94a3b8"
                          strokeDasharray="4 4"
                          ifOverflow="extendDomain"
                          label={{
                            value: `Avg ${avg}`,
                            position: "right",
                            fill: "#64748b",
                            fontSize: 12,
                          }}
                        />

                        <Bar dataKey="score" fill={`url(#${item.gradId})`} radius={[12, 12, 8, 8]}>
                          <LabelList dataKey="score" position="top" className="fill-slate-600" />
                        </Bar>

                        {data.length > 8 && (
                          <Brush
                            dataKey="name"
                            height={18}
                            stroke="#cbd5e1"
                            travellerWidth={10}
                            fill="#f8fafc"
                          />
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 relative overflow-hidden rounded-3xl p-6 bg-white/85 backdrop-blur-xl border border-white ring-1 ring-slate-200/60 shadow-[0_18px_55px_-30px_rgba(30,41,59,0.45)]">
            <div className="absolute -top-8 -right-10 h-28 w-28 bg-emerald-100/50 rounded-full blur-2xl" />
            <div className="relative">
              <MedicineReminder />
            </div>
          </div>
        </>
      ) : (
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[28px] p-8 md:p-10 bg-white/85 backdrop-blur-xl border border-white ring-1 ring-violet-200/60 shadow-[0_24px_60px_-30px_rgba(56,56,120,0.45)]">
            <div className="absolute -top-16 -right-10 h-52 w-52 bg-violet-300/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-56 w-56 bg-pink-300/30 rounded-full blur-3xl" />
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-2xl shadow-lg mb-3">
                ✨
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800">
                Welcome! Let’s get started.
              </h2>
              <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
                We don’t see any previous entries for your account yet. Take a quick assessmentor add a reminder to begin tracking your journey.
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="rounded-2xl p-5 border border-slate-200/70 bg-white shadow-sm">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="font-semibold text-slate-800">Take your first assessments</div>
                  <div className="text-sm text-slate-600 mt-1">Complete Depression, Anxiety, etc questionnaires from the home page!</div>
                  <a href="/">
  <button className="mt-3 inline-flex items-center justify-center rounded-xl px-4 py-2 bg-blue-600 text-white font-semibold shadow hover:brightness-95">
    Go to Home
  </button>
</a>

                </div>
                <div className="rounded-2xl p-5 border border-slate-200/70 bg-white shadow-sm">
                  <div className="text-2xl mb-2">⏰</div>
                  <div className="font-semibold text-slate-800">Set a medicine reminder</div>
                  <div className="text-sm text-slate-600 mt-1">Stay consistent with gentle notifications on you email id!</div>
                  <a
                    href="#medicine"
                    className="mt-3 inline-flex items-center justify-center rounded-xl px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow hover:brightness-95"
                  >
                    Add reminder
                  </a>
                </div>
                <div className="rounded-2xl p-5 border border-slate-200/70 bg-white shadow-sm">
                  <div className="text-2xl mb-2">📈</div>
                  <div className="font-semibold text-slate-800">Learn how it works</div>
                  <div className="text-sm text-slate-600 mt-1">Your scores will be shown over visualized graphs!</div>
                  
                </div>
              </div>

              <div id="medicine" className="mt-8 relative overflow-hidden rounded-3xl p-6 bg-white/85 backdrop-blur-xl border border-white ring-1 ring-slate-200/60 shadow">
                <div className="absolute -top-8 -right-10 h-28 w-28 bg-emerald-100/50 rounded-full blur-2xl" />
                <div className="relative">
                  <MedicineReminder />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;