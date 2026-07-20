
const africastalking = require("africastalking")({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

const sms = africastalking.SMS;

async function sendSMS(to, message) {
  try {
    const response = await sms.send({
      to: [to],
      message: message
    });

    console.log("SMS sent:", response);
  } catch (error) {
    console.error("SMS failed:", error);
  }
}

module.exports = sendSMS;