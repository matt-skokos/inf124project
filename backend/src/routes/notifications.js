// backend/src/routes/notifications.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = require('../db');           // your Firestore instance
const { sendSMS } = require('../services/smsService');

// 1) Register an FCM token for a user
router.post('/register', async (req, res) => {
  const { userId, token } = req.body;
  if (!userId || !token) {
    return res.status(400).json({ error: 'Missing userId or token.' });
  }
  try {
    await db.collection('users')
      .doc(userId)
      .set(
        { fcmTokens: admin.firestore.FieldValue.arrayUnion(token) },
        { merge: true }
      );
    res.json({ success: true });
  } catch (err) {
    console.error('Error registering token:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2) Send a push notification to a single FCM token
router.post('/push', async (req, res) => {
  const { token, notification, data } = req.body;
  if (!token || !notification) {
    return res.status(400).json({ error: 'Missing token or notification payload.' });
  }
  try {
    const message = { token, notification, data };
    const messageId = await admin.messaging().send(message);
    res.json({ success: true, messageId });
  } catch (err) {
    console.error('Error sending push:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3) Send a push to all tokens registered to a user
router.post('/push/user', async (req, res) => {
  const { userId, notification, data } = req.body;
  if (!userId || !notification) {
    return res.status(400).json({ error: 'Missing userId or notification payload.' });
  }
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const tokens = userDoc.data().fcmTokens || [];
    if (!tokens.length) {
      return res.status(400).json({ error: 'No FCM tokens for this user.' });
    }
    const response = await admin.messaging().sendMulticast({
      tokens,
      notification,
      data,
    });
    res.json({ success: true, responses: response.responses });
  } catch (err) {
    console.error('Error sending multicast push:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4) NEW: Send an SMS to a user by UID
router.post('/sms/user', async (req, res) => {
  const { userId, body } = req.body;
  if (!userId || !body) {
    return res.status(400).json({ error: 'Missing userId or body.' });
  }
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const phone = userDoc.data().phone;
    if (!phone) {
      return res.status(400).json({ error: 'User has no phone number on record.' });
    }
    const msg = await sendSMS(phone, body);
    res.json({ success: true, sid: msg.sid });
  } catch (err) {
    console.error('Error sending SMS:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
