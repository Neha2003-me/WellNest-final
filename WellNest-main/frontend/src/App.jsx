import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; // Import useAuth0 hook
import Home from "./components/Home";
import LoggedIn from "./components/LoggedIn";
import Profile from "./components/Profile"; 
import Dashboard from "./components/Dashboard";

function App() {
  const { isAuthenticated, isLoading } = useAuth0(); // Use Auth0's authentication state

  // Show a loading spinner while Auth0 is checking authentication status
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/loggedin" /> : <Home />}
        />
        <Route
          path="/loggedin"
          element={isAuthenticated ? <LoggedIn /> : <Navigate to="/" />}
        />
        <Route
          path="/loggedin/profile"
          element={
            isAuthenticated ? <Profile /> : <Navigate to="/" />
          }
        />
        <Route
          path="/loggedin/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
