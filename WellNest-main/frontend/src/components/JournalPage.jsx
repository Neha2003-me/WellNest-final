import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

// Color helpers
const getSurface = (dark) =>
  dark
    ? "rgba(255,255,255,0.06)"
    : "rgba(255,255,255,0.75)";

const getBorder = (dark) =>
  dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(10,10,20,0.06)";

const getShadow = (dark) =>
  dark
    ? "0 10px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)"
    : "0 12px 35px rgba(20,40,80,0.12), inset 0 1px 0 rgba(255,255,255,0.5)";

const moodColor = (m, dark) => {
  const map = {
    happy: dark ? "#62d28a" : "#1a8e49",
    calm: dark ? "#82cfff" : "#1162a5",
    sad: dark ? "#8aa0ff" : "#3b4db5",
    stressed: dark ? "#ffb07c" : "#bb4b0e",
    grateful: dark ? "#f6dc7b" : "#9c7a00",
  };
  const key = String(m || "").toLowerCase();
  return map[key] || (dark ? "#e0e0e5" : "#4a6fa5");
};

// Skeleton loader
const Skeleton = ({ darkMode }) => (
  <div
    style={{
      background: getSurface(darkMode),
      border: getBorder(darkMode),
      boxShadow: getShadow(darkMode),
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: 14,
        width: "40%",
        borderRadius: 8,
        background:
          darkMode
            ? "linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.15), rgba(255,255,255,0.06))"
            : "linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0.12), rgba(0,0,0,0.06))",
        animation: "shimmer 1.5s infinite",
        backgroundSize: "200% 100%",
      }}
    />
    <div style={{ height: 10 }} />
    <div
      style={{
        height: 10,
        width: "100%",
        borderRadius: 8,
        background:
          darkMode
            ? "linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12), rgba(255,255,255,0.06))"
            : "linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0.1), rgba(0,0,0,0.06))",
        animation: "shimmer 1.5s infinite",
        backgroundSize: "200% 100%",
      }}
    />
    <div style={{ height: 8 }} />
    <div
      style={{
        height: 10,
        width: "70%",
        borderRadius: 8,
        background:
          darkMode
            ? "linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12), rgba(255,255,255,0.06))"
            : "linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0.1), rgba(0,0,0,0.06))",
        animation: "shimmer 1.5s infinite",
        backgroundSize: "200% 100%",
      }}
    />
  </div>
);

// Modular Journal Entry Component
const JournalEntry = ({ entry, darkMode }) => (
  <div
    style={{
      background: getSurface(darkMode),
      border: getBorder(darkMode),
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      boxShadow: getShadow(darkMode),
      transition: "transform 220ms ease, box-shadow 220ms ease, background 220ms ease",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      cursor: "default",
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
    onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <h4
        style={{
          color: darkMode ? "#f6f7fb" : "#263a5a",
          margin: 0,
          letterSpacing: "0.2px",
        }}
      >
        {entry.title}
      </h4>
      {entry.mood && (
        <span
          style={{
            color: darkMode ? "#0b0b12" : "#ffffff",
            backgroundColor: moodColor(entry.mood, darkMode),
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: "0.8rem",
            fontWeight: 600,
            textTransform: "capitalize",
            whiteSpace: "nowrap",
          }}
        >
          {entry.mood}
        </span>
      )}
    </div>

    <p
      style={{
        marginTop: 10,
        lineHeight: 1.7,
        color: darkMode ? "#e8eaf3" : "#333a44",
      }}
    >
      {entry.content}
    </p>

    <small style={{ color: darkMode ? "#a8acb8" : "#7a8596" }}>
      {new Date(entry.createdAt).toLocaleString()}
    </small>
  </div>
);

const JournalPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(true);

  const BASE_URL = "https://well-nest-final-molh.vercel.app";

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchEntries = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/journal/${user.email}`);
        setEntries(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching journal entries:", err);
        setEntries([]);
      } finally {
        setLoadingEntries(false);
      }
    };

    fetchEntries();
  }, [isAuthenticated, user]);

  const addEntry = async () => {
    if (!isAuthenticated || !user) return;
    if (!title || !content) return;

    try {
      const res = await axios.post(`${BASE_URL}/api/journal/add`, {
        userEmail: user.email,
        title,
        content,
        mood,
      });
      setEntries([res.data.journal, ...entries]);
      setTitle("");
      setContent("");
      setMood("");
    } catch (err) {
      console.error("Error adding journal entry:", err);
    }
  };

  const bgGradient = useMemo(
    () =>
      darkMode
        ? "radial-gradient(1200px 600px at 20% 10%, #2f335a 0%, rgba(18,18,28,1) 45%), radial-gradient(1000px 500px at 80% 0%, #1a2040 0%, rgba(10,10,18,1) 55%)"
        : "radial-gradient(1200px 600px at 20% 10%, #e8f1ff 0%, #f3f7ff 45%), radial-gradient(1000px 500px at 80% 0%, #fef6ff 0%, #f9fbff 55%)",
    [darkMode]
  );

  if (isLoading) return <div style={{ padding: 24 }}>Loading authentication...</div>;
  if (!isAuthenticated) return <div style={{ padding: 24 }}>Please log in to access your journal.</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "48px 20px",
        background: bgGradient,
        fontFamily: "'Poppins', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, sans-serif",
        transition: "background 280ms ease, color 280ms ease",
      }}
    >
      {/* Page container */}
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              color: darkMode ? "#f6f7fb" : "#263a5a",
              margin: 0,
              fontSize: "2.1rem",
              letterSpacing: "0.2px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span role="img" aria-label="pen">🖋️</span> Daily Reflections
          </h2>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
            style={{
              position: "relative",
              height: 36,
              width: 70,
              borderRadius: 999,
              border: getBorder(darkMode),
              background: getSurface(darkMode),
              boxShadow: getShadow(darkMode),
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: darkMode ? "flex-end" : "flex-start",
              padding: 4,
              transition: "all 220ms ease",
              color: darkMode ? "#f6f7fb" : "#263a5a",
            }}
          >
            <span
              style={{
                height: 28,
                width: 28,
                borderRadius: "50%",
                background: darkMode ? "#9fb0ff" : "#ffffff",
                boxShadow: darkMode
                  ? "0 4px 12px rgba(0,0,0,0.5)"
                  : "0 4px 12px rgba(20,40,80,0.25)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              {darkMode ? "🌙" : "☀️"}
            </span>
          </button>
        </div>

        {/* Entry Form */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginBottom: 28,
            background: getSurface(darkMode),
            border: getBorder(darkMode),
            padding: 22,
            borderRadius: 20,
            boxShadow: getShadow(darkMode),
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 12 }}>
            <input
              style={{
                padding: "14px 14px",
                borderRadius: 12,
                border: getBorder(darkMode),
                backgroundColor: darkMode ? "rgba(255,255,255,0.06)" : "#ffffff",
                color: darkMode ? "#f5f7fb" : "#233046",
                fontSize: 16,
                outline: "none",
                transition: "border-color 180ms ease, box-shadow 180ms ease",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(76,128,255,0.25)")}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.08)")}
            />
            <input
              style={{
                padding: "14px 14px",
                borderRadius: 12,
                border: getBorder(darkMode),
                backgroundColor: darkMode ? "rgba(255,255,255,0.06)" : "#ffffff",
                color: darkMode ? "#f5f7fb" : "#233046",
                fontSize: 16,
                outline: "none",
                transition: "border-color 180ms ease, box-shadow 180ms ease",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                textTransform: "capitalize",
              }}
              type="text"
              placeholder="Mood (optional)"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(76,128,255,0.25)")}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.08)")}
            />
          </div>

          <textarea
            style={{
              padding: 14,
              borderRadius: 12,
              border: getBorder(darkMode),
              backgroundColor: darkMode ? "rgba(255,255,255,0.06)" : "#ffffff",
              color: darkMode ? "#f5f7fb" : "#233046",
              fontSize: 16,
              minHeight: 140,
              resize: "vertical",
              outline: "none",
              transition: "border-color 180ms ease, box-shadow 180ms ease",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
            placeholder="Write your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(76,128,255,0.25)")}
            onBlur={(e) => (e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.08)")}
          />

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={addEntry}
              style={{
                padding: "12px 20px",
                background: darkMode
                  ? "linear-gradient(90deg, #6e86ff, #3f56cf)"
                  : "linear-gradient(90deg, #4a8af5, #3461c8)",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: 0.3,
                transition: "transform 120ms ease, filter 200ms ease",
                boxShadow: darkMode
                  ? "0 8px 20px rgba(0,0,0,0.35)"
                  : "0 8px 20px rgba(52,97,200,0.35)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              onMouseDown={(e) => (e.currentTarget.style.filter = "brightness(0.95)")}
              onMouseUp={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              Add Entry
            </button>

            {/* Secondary clear button */}
            {(title || content || mood) && (
              <button
                onClick={() => {
                  setTitle("");
                  setContent("");
                  setMood("");
                }}
                style={{
                  padding: "12px 16px",
                  background: "transparent",
                  border: getBorder(darkMode),
                  borderRadius: 12,
                  cursor: "pointer",
                  color: darkMode ? "#d7dbeb" : "#2b3b58",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Journal Entries */}
        <h3
          style={{
            marginBottom: 14,
            color: darkMode ? "#f0f2f9" : "#2b3b58",
            letterSpacing: 0.2,
          }}
        >
          Previous Entries
        </h3>

        {loadingEntries ? (
          <>
            <Skeleton darkMode={darkMode} />
            <Skeleton darkMode={darkMode} />
            <Skeleton darkMode={darkMode} />
          </>
        ) : entries.length === 0 ? (
          <div
            style={{
              background: getSurface(darkMode),
              border: getBorder(darkMode),
              boxShadow: getShadow(darkMode),
              borderRadius: 20,
              padding: 28,
              textAlign: "center",
              color: darkMode ? "#cbd2e4" : "#58719a",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 6 }}>✨</div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>No entries yet</div>
            <div>Start journaling your thoughts above.</div>
          </div>
        ) : (
          entries.map((entry) => (
            <JournalEntry key={entry._id} entry={entry} darkMode={darkMode} />
          ))
        )}
      </div>

      {/* Keyframes for shimmer (mounted globally once) */}
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>
    </div>
  );
};

export default JournalPage;