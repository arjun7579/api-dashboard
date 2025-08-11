const nodemailer = require('nodemailer');
const AlertCooldown = require('../models/alertCooldownModel');
const User = require('../models/userModel');

// Configure Nodemailer transporter
// For testing, use a service like Ethereal: https://ethereal.email/
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send an email alert when an endpoint is down
const sendDownAlert = async (endpoint) => {
  try {
    const now = new Date();
    // Cooldown period: 1 hour (3600 * 1000 milliseconds)
    const cooldownPeriod = 3600 * 1000; 

    // Check if an alert was sent recently for this endpoint
    const cooldown = await AlertCooldown.findOne({ endpointId: endpoint._id });
    
    if (cooldown && (now - cooldown.lastAlerted < cooldownPeriod)) {
      // If within cooldown period, do not send another alert
      // console.log(`Alert for ${endpoint.name} is on cooldown.`);
      return;
    }

    // Find the owner of the endpoint to get their email
    const user = await User.findById(endpoint.user);
    if (!user) {
      console.error(`User not found for endpoint ${endpoint.name}`);
      return;
    }

    const mailOptions = {
      from: '"API-Pulse Alert" <noreply@apipulse.com>',
      to: user.email,
      subject: `🚨 Alert: Your API "${endpoint.name}" is Down!`,
      html: `
        <p>Hello ${user.name},</p>
        <p>This is an automated alert to inform you that your API endpoint is currently unreachable.</p>
        <ul>
          <li><strong>API Name:</strong> ${endpoint.name}</li>
          <li><strong>URL:</strong> ${endpoint.url}</li>
          <li><strong>Time of Failure:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        <p>We will continue to monitor the service and will notify you based on your alert settings.</p>
        <p>Regards,<br/>The API-Pulse Team</p>
      `,
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log(`Alert email sent to ${user.email}: ${info.messageId}`);
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // For Ethereal

    // Update the cooldown timestamp
    await AlertCooldown.findOneAndUpdate(
      { endpointId: endpoint._id },
      { lastAlerted: now },
      { upsert: true, new: true } // Create if doesn't exist, update otherwise
    );

  } catch (error) {
    console.error('Error sending alert email:', error);
  }
};

module.exports = { sendDownAlert };