// src/services/notificationServices.js
/**
 * Service layer for storing & retrieving FCM tokens in Firestore.
 * Depends on db.js having already called admin.initializeApp().
 */

const db = require('../db');                 // Firestore instance (from db.js)
const admin = require('firebase-admin');      // For FieldValue.serverTimestamp()

/**
 * Save a device token for a given userId.
 * Documents go under: users/{userId}/deviceTokens/{autoId}
 * If the token already exists, do nothing.
 */
async function saveDeviceToken(userId, token) {
  const userDocRef = db.collection('users').doc(userId);
  const tokensCol = userDocRef.collection('deviceTokens');

  // Check if this token is already stored
  const existingSnapshot = await tokensCol.where('token', '==', token).limit(1).get();
  if (!existingSnapshot.empty) {
    return; // Already registered, skip
  }

  // Otherwise, add a new doc with server timestamp
  await tokensCol.add({
    token,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Retrieve all device tokens for a given userId.
 * Returns an array of string tokens.
 */
async function getUserDeviceTokens(userId) {
  const userDocRef = db.collection('users').doc(userId);
  const tokensSnapshot = await userDocRef.collection('deviceTokens').get();
  const tokens = [];
  tokensSnapshot.forEach(doc => {
    const data = doc.data();
    if (data && data.token) {
      tokens.push(data.token);
    }
  });
  return tokens;
}

module.exports = {
  saveDeviceToken,
  getUserDeviceTokens,
};
