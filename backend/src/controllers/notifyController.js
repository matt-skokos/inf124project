// backend/src/controllers/notifyController.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const { sendSMS } = require('../services/smsService');
const locations = require('../data/locations'); // wherever you keep your spot data

/**
 * POST /api/notify
 * Body: { phone: string, locationId: string }
 * Sends an SMS with that location’s current data.
 */
router.post('/notify', async (req, res) => {
  const { phone, locationId } = req.body;
  if (!phone || !locationId) {
    return res.status(400).json({ error: 'phone and locationId required' });
  }

  // fetch your spot data however you store it
  const spot = locations.find(l => l.id === locationId);
  if (!spot) {
    return res.status(404).json({ error: 'Location not found' });
  }

  // build the message
  const msgBody = `Surf update for ${spot.name}:
• Swell: ${spot.swell.dir} ${spot.swell.val}
• Wind:  ${spot.wind.dir} ${spot.wind.val}
• Tide:  ${spot.tide}`;

  try {
    await sendSMS(phone, msgBody);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'SMS failed' });
  }
});

module.exports = router;
