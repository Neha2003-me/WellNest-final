import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react'; // Import Auth0Provider
import './index.css';
import App from './App.jsx';

// Replace these with your Auth0 domain and client ID
const domain = "dev-wx0wzhodkgnv7da8.us.auth0.com";
const clientId = "bnnkhWTbW03AB7RripZ2qA9FA6xtDqft";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin, // Redirect to the current origin after login
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
);