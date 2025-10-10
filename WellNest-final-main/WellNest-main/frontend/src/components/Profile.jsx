import React from "react";
import { useAuth0 } from "@auth0/auth0-react"; // Import useAuth0 hook

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Show a loading spinner while Auth0 is checking authentication status
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect or show a message if the user is not authenticated
  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-cyan-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {/* Profile Picture */}
        <img
          src={user.picture}
          alt={user.name}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />

        {/* User Name */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          {user.name}
        </h1>

        {/* User Email */}
        <p className="text-gray-600 mb-4">{user.email}</p>

        {/* Additional User Info (if available) */}
        {user.given_name && (
          <p className="text-gray-600">
            First Name: <span className="font-medium">{user.given_name}</span>
          </p>
        )}
        {user.family_name && (
          <p className="text-gray-600">
            Last Name: <span className="font-medium">{user.family_name}</span>
          </p>
        )}

        {/* Logout Button */}
        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
          className="mt-6 bg-[#29b5f6] text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;