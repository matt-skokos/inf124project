// src/sendNotification.js
const admin = require('./fcm');

async function sendPush(deviceToken, payload) {
  const message = {
    token: deviceToken,
    notification: {
      title: payload.title,
      body: payload.body,
    },
    data: payload.data || {},
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('FCM message sent:', response);
    return response;
  } catch (err) {
    console.error('Error sending FCM message:', err);
    throw err;
  }
}

module.exports = sendPush;
