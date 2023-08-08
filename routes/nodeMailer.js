const express = require("express");
const createTransporter = require("../transporter");

const emailRouter = express();
emailRouter.use(express.json());

const sendEmail = async (recipientEmail) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail({
    from: process.env.EMAIL,
    to: recipientEmail,
    subject: "Testing NodeMailer",
    text: "You smell... like the smelly smell smell",
  });
};

emailRouter.get("/", (req, res) => {
  sendEmail()
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

emailRouter.post("/", (req, res) => {
  sendEmail(req.body.userEmail)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

module.exports = emailRouter;
