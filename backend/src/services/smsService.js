// backend/src/services/smsService.js
require('dotenv').config();

const twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Validate and format phone number to E.164 format
 * @param {string} phone - Phone number in various formats
 * @returns {string} - E.164 formatted phone number
 */
function validateAndFormatPhone(phone) {
  if (!phone) {
    throw new Error('Phone number is required');
  }

  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it doesn't start with +, add +1 for US numbers
  if (!cleaned.startsWith('+')) {
    if (cleaned.length === 10) {
      cleaned = '+1' + cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      cleaned = '+' + cleaned;
    } else {
      throw new Error('Invalid phone number format. Please use a valid US phone number.');
    }
  }

  // Basic E.164 validation (+ followed by 1-15 digits)
  if (!/^\+\d{1,15}$/.test(cleaned)) {
    throw new Error('Invalid phone number format. Must be in E.164 format (+1234567890)');
  }

  return cleaned;
}

/**
 * Send an SMS via Twilio.
 * @param {string} to    Phone number in various formats (will be converted to E.164)
 * @param {string} body  Message text
 * @returns {Promise<object>}  Twilio message response
 */
async function sendSMS(to, body) {
  try {
    // Validate and format phone number
    const formattedPhone = validateAndFormatPhone(to);
    
    if (!body || body.trim().length === 0) {
      throw new Error('Message body is required');
    }

    const msg = await twilio.messages.create({
      from: process.env.TWILIO_FROM_NUMBER,
      to: formattedPhone,
      body: body.trim(),
    });
    
    console.log(`SMS sent to ${formattedPhone}, SID=${msg.sid}`);
    return msg;
  } catch (err) {
    console.error(`Failed to send SMS to ${to}:`, err);
    throw err;
  }
}

module.exports = { sendSMS, validateAndFormatPhone };
