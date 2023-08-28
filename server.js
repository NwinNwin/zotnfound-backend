require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

// ROUTES
const items = require("./routes/items");
const nodemailer = require("./routes/nodeMailer");

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", async (req, res) => {
  try {
    res.json("Hello");
  } catch (error) {
    console.error(error);
  }
});
app.use("/items", items);
app.use("/nodemailer", nodemailer);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
