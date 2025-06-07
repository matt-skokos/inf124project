import React from 'react';
import ReactDOM from 'react-dom/client';
import { firebaseApp } from './firebase'; // Even if `firebaseApp` not used here, importing it ensures initializeApp() runs exactly once.
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import App from './App';
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);