const express = require("express");
const sendEmail = require("../utils");

const itemsRouter = express.Router();

const pool = require("../server/db");

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
    } = req.body;

    const item = await pool.query(
      "INSERT INTO items (name, description, type, islost, location, date, itemDate, email, image) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [name, description, type, islost, location, date, itemDate, email, image]
    );

    // Check for nearby items
    const nearbyItems = await pool.query(
      "SELECT email, name, id FROM items WHERE ST_DWithin(ST_SetSRID(ST_MakePoint(location[2], location[1]), 4326)::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, 120) AND id != $3 AND islost != $4 AND type = $5",
      [location[1], location[0], item.rows[0].id, islost, type]
    );

    // If there are nearby items, send an email
    if (nearbyItems.rowCount > 0) {
      // Loop through the nearby items and send emails. This assumes you want to notify all nearby item owners.
      for (let nearbyItem of nearbyItems.rows) {
        sendEmail(
          nearbyItem.email,
          "A nearby item was added!",
          `${name} is near your item ${nearbyItem.name}: ${nearbyItem.id}`
        );
      }
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

itemsRouter.get("/lol", async (req, res) => {
  try {
    res.json("HI");
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
    } = req.body;

    const item = await pool.query(
      "UPDATE items SET name=$1, description=$2, type=$3, islost=$4, location=$5, date=$6, itemDate=$7, email=$8, image=$9 WHERE id=$10 RETURNING *",
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
