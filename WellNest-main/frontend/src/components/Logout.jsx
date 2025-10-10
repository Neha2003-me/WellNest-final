import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setIsLogin }) => {
  const navigate = useNavigate();

  // Perform logout actions when the component mounts
  useEffect(() => {
    // Clear user session or token
    localStorage.removeItem('token'); // Example: Clear a stored token
    setIsLogin(false); // Update login state in the parent component

    // Redirect to login page after a short delay (optional)
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000); // Redirect after 2 seconds

    // Cleanup the timer to avoid memory leaks
    return () => clearTimeout(timer);
  }, [navigate, setIsLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">You have been logged out</h1>
        <p className="text-gray-600 mb-6">Thank you for using WellNest. We hope to see you again soon!</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};

export default Logout;