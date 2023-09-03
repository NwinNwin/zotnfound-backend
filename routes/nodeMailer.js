const express = require("express");
const sendEmail = require("../utils");

const emailRouter = express();
emailRouter.use(express.json());

emailRouter.post("/", (req, res) => {
  sendEmail(req.body.userEmail)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

module.exports = emailRouter;
