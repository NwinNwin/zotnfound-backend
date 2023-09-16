const express = require("express");
const sendEmail = require("../utils");
const fs = require("fs");
const itemsRouter = express.Router();

const pool = require("../server/db");
const template = fs.readFileSync("./email-template/index.html", "utf-8");
const isPositionWithinBounds = require("../util/inbound");
//Add a item
itemsRouter.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      islost,
      location,
      date,
      itemDate,
      email,
      image,
      isResolved,
      isHelped,
    } = req.body;

    if (!isPositionWithinBounds(location[0], location[1])) {
      res.json("ITEM OUT OF BOUNDS (UCI ONLY)");
    }

    

    // await pool.query(
    //   "INSERT INTO leaderboard (email, points) VALUES ($1, $2)", ["stevenz9@uci.edu", 2]
    // )

    const item = await pool.query(
      "INSERT INTO items (name, description, type, islost, location, date, itemDate, email, image, isResolved, isHelped) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [
        name,
        description,
        type,
        islost,
        location,
        date,
        itemDate,
        email,
        image,
        isResolved,
        isHelped,
      ]
    );

    const nearbyItems = await pool.query(
      "SELECT DISTINCT email FROM items WHERE type=$1 AND islost=$2 AND email!=$3",
      [type, !islost, email]
    );

    let contentString = "";

    for (let i = 0; i < nearbyItems.rows.length; i++) {
      let email = nearbyItems.rows[i].email;
      contentString += `A new added item, ${name}, is near your items!`;

      const dynamicContent = {
        content: contentString,
        image: image,
        url: `https://zotnfound.com/${item.rows[0].id}`,
      };

      const customizedTemplate = template
        .replace("{{content}}", dynamicContent.content)
        .replace("{{image}}", dynamicContent.image)
        .replace("{{url}}", dynamicContent.url);

      sendEmail(email, "A nearby item was added!", customizedTemplate);

      contentString = "";
    }

    res.json(item.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

//Get all items
itemsRouter.get("/", async (req, res) => {
  try {
    const allItems = await pool.query("SELECT * FROM items");
    res.json(allItems.rows);
  } catch (error) {
    console.error(error);
  }
});

//Get a item
itemsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await pool.query("SELECT * FROM items WHERE id=$1", [id]);
    res.json(item.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// Retrieve Items by Category
itemsRouter.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const items = await pool.query("SELECT * FROM items WHERE type=$1", [
      category,
    ]);
    res.json(items.rows);
  } catch (error) {
    console.error(error);
  }
});

//Update a item
itemsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      type,
      islost,
      location,
      date,
      itemDate,
      email,
      image,
      isResolved,
      isHelped,
    } = req.body;

    const item = await pool.query(
      "UPDATE items SET name=$1, description=$2, type=$3, islost=$4, location=$5, date=$6, itemDate=$7, email=$8, image=$9, isResolved=$11, isHelped=$12 WHERE id=$10 RETURNING *",
      [
        name,
        description,
        type,
        islost,
        location,
        date,
        itemDate,
        email,
        image,
        id,
        isResolved,
        isHelped,
      ]
    );

    res.json(item.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

//Delete a item
itemsRouter.delete("/:id", async (req, res) => {
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

module.exports = itemsRouter;
