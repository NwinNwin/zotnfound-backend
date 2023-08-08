require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const express = require("express");
const pool = require("./db");
const OAuth2 = google.auth.OAuth2;
const cors = require("cors");
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });

  return transporter;
};

const sendEmail = async (recipientEmail) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail({
    from: process.env.EMAIL,
    to: recipientEmail,
    subject: "Testing NodeMailer",
    text: "You smell... like the smelly smell smell",
  });
};

app.get("/", (req, res) => {
  sendEmail()
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.post("/send_email", (req, res) => {
  sendEmail(req.body.userEmail)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

//Add a item
app.post("/items", async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      isLost,
      location,
      date,
      itemDate,
      email,
      image,
    } = req.body;

    const item = await pool.query(
      "INSERT INTO items (name, description, type, isLost, location, date, itemDate, email, image) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [name, description, type, isLost, location, date, itemDate, email, image]
    );

    res.json(item.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

//Get all items
app.get("/items", async (req, res) => {
  try {
    const allItems = await pool.query("SELECT * FROM items");
    res.json(allItems.rows);
  } catch (error) {
    console.error(error);
  }
});

//Get a item
app.get("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await pool.query("SELECT * FROM items WHERE id=$1", [id]);
    res.json(item.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

//Update a item
app.put("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      type,
      isLost,
      location,
      date,
      itemDate,
      email,
      image,
    } = req.body;

    const item = await pool.query(
      "UPDATE items SET name=$1, description=$2, type=$3, isLost=$4, location=$5, date=$6, itemDate=$7, email=$8, image=$9 WHERE id=$10 RETURNING *",
      [
        name,
        description,
        type,
        isLost,
        location,
        date,
        itemDate,
        email,
        image,
        id,
      ]
    );

    res.json(item.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

//Delete a item
app.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await pool.query(
      "DELETE FROM items WHERE id=$1 RETURNING *",
      [id]
    );
    res.json(deletedItem.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
