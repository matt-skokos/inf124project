import React from 'react';
import ReactDOM from 'react-dom/client';
import { firebaseApp, auth } from './firebase';
import { onIdTokenChanged } from 'firebase/auth';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App';
import './index.css';

// Keep localStorage ID_TOKEN up to date whenever Firebase refreshes it
onIdTokenChanged(auth, async (user) => {
  if (user) {
    const token = await user.getIdToken();
    localStorage.setItem('ID_TOKEN', token);
    localStorage.setItem('UID', user.uid); // Store UID for profile and other user-specific requests
  } else {
    localStorage.removeItem('ID_TOKEN');
    localStorage.removeItem('UID'); // Remove UID when user logs out
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
