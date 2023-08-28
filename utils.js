const createTransporter = require("./transporter");

const sendEmail = async (recipientEmail, subject, content) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail({
    from: process.env.EMAIL,
    to: recipientEmail,
    subject: subject,
    html: content,
  });
};

module.exports = sendEmail;
