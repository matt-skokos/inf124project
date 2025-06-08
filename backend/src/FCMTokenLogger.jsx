// src/FCMTokenLogger.jsx
import React, { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

export default function FCMTokenLogger() {
  useEffect(() => {
    // 1) Initialize Firebase App
    const app = initializeApp(firebaseConfig);

    // 2) Register the service worker at '/firebase-messaging-sw.js'
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);

          // 3) Initialize Messaging
          const messaging = getMessaging(app);

          // 4) Request Notification Permission
          Notification.requestPermission()
            .then((permission) => {
              if (permission !== 'granted') {
                console.warn('Notification permission not granted');
                return;
              }

              // 5) Call getToken() with your Web Push VAPID Key
              return getToken(messaging, {
                vapidKey: 'YOUR_PUBLIC_VAPID_KEY_FROM_FIREBASE_CONSOLE',
              });
            })
            .then((currentToken) => {
              if (currentToken) {
                console.log('FCM registration token:', currentToken);
                // → At this point, you can POST this token to your backend:
                //    fetch('/api/notifications/register', { method: 'POST', body: JSON.stringify({ userId: 'abc123', token: currentToken }) });
              } else {
                console.warn('No registration token available. Request permission to generate one.');
              }
            })
            .catch((err) => {
              console.error('An error occurred while retrieving token. ', err);
            });
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    } else {
      console.error('Service workers are not supported in this browser.');
    }
  }, []);

  return null; // This component only runs the effect; no UI needed
}
