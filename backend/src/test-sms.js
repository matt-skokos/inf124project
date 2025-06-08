require('dotenv').config();
const { sendSMS, validateAndFormatPhone } = require('./services/smsService');

// Test configuration
console.log('🧪 Testing Twilio SMS Service');
console.log('================================');

// Check environment variables
const requiredEnvVars = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_FROM_NUMBER'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  process.exit(1);
}

console.log('✅ Environment variables loaded:');
console.log(`   Account SID: ${process.env.TWILIO_ACCOUNT_SID.substring(0, 10)}...`);
console.log(`   From Number: ${process.env.TWILIO_FROM_NUMBER}`);

// Test phone number validation
console.log('\n📞 Testing phone number validation:');
const testNumbers = [
  '(555) 123-4567',
  '555-123-4567',
  '5551234567',
  '+15551234567',
  '15551234567',
  'invalid',
  '',
];

testNumbers.forEach(number => {
  try {
    const formatted = validateAndFormatPhone(number);
    console.log(`   ✅ "${number}" → "${formatted}"`);
  } catch (err) {
    console.log(`   ❌ "${number}" → Error: ${err.message}`);
  }
});

// Test SMS sending (replace with your verified number)
async function testSMSSending() {
  console.log('\n📱 Testing SMS sending:');
  console.log('   (Replace +1YOUR_VERIFIED_NUMBER with your actual verified number)');
  
  try {
    // For testing, use a placeholder number - user should replace this
    const testNumber = '+1YOUR_VERIFIED_NUMBER'; // ⚠️ Replace with your verified number
    const testMessage = '🏄‍♂️ Test message from your surf app! Twilio integration is working.';
    
    if (testNumber === '+1YOUR_VERIFIED_NUMBER') {
      console.log('   ⚠️  Test skipped: Please replace +1YOUR_VERIFIED_NUMBER with your verified number');
      return;
    }
    
    const msg = await sendSMS(testNumber, testMessage);
    console.log(`   ✅ SMS sent successfully! SID: ${msg.sid}`);
    console.log(`   📋 Status: ${msg.status}`);
    console.log(`   💰 Price: ${msg.price} ${msg.priceUnit || 'USD'}`);
    
  } catch (err) {
    console.error('   ❌ SMS sending failed:', err.message);
    
    // Provide helpful error messages
    if (err.code === 21211) {
      console.log('   💡 Tip: Make sure the phone number is verified in your Twilio console');
    } else if (err.code === 20003) {
      console.log('   💡 Tip: Check your Twilio credentials');
    }
  }
}

// Run the tests
testSMSSending().then(() => {
  console.log('\n🎉 Twilio SMS test completed!');
}).catch(err => {
  console.error('\n💥 Test failed:', err);
});