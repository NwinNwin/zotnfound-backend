const express = require("express");
const sendEmail = require("../utils");

const emailRouter = express();
emailRouter.use(express.json());

emailRouter.get("/", (req, res) => {
  sendEmail("dangnn1@uci.edu", "hello", "friend")
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

emailRouter.post("/", (req, res) => {
  sendEmail(req.body.userEmail)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

module.exports = emailRouter;
