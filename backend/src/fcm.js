// src/fcm.js
/**
 * Do NOT call initializeApp() here—that’s already done in db.js.
 * We simply re-export the same admin instance.
 */

const admin = require('firebase-admin');
module.exports = admin;