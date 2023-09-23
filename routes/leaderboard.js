const express = require("express");
const leaderboardRouter = express.Router();

const pool = require("../server/db");

// add a user to leaderboard
leaderboardRouter.post("/", async (req, res) => {
  try {
    const { email, points } = req.body; // Get email and points from request body

    if (!email || !points) {
      return res.status(400).send("Email and points are required");
    }

    await pool.query(
      "INSERT INTO leaderboard (email, points) VALUES ($1, $2)",
      [email, points]
    );

    res.status(201).send("User added to leaderboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// get all users on leaderboard (descending)
leaderboardRouter.get("/", async (req, res) => {
  try {
    const lbData = await pool.query(
      "SELECT * FROM leaderboard ORDER BY points DESC"
    );
    res.json(lbData.rows);
  } catch (error) {
    console.log(error);
  }
});

// update user's points
leaderboardRouter.put("/", async (req, res) => {
  try {
    await pool.query("UPDATE leaderboard SET points=100 WHERE email=$1", [
      "test@gmail.com",
    ]);

    // this could be how we udpate the points
    // const point = await pool.query("SELECT points FROM leaderboard WHERE email=$1", ["test@gmail.com"])
    // await pool.query("UPDATE leaderboard SET points=$1 WHERE email=$2", [point.rows[0].points, "test@gmail.com"])
  } catch (err) {
    console.error(err);
  }
});

// delete user from leaderboard
leaderboardRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract id from request body
    if (!id) {
      return res.status(400).send("id is required");
    }
    await pool.query("DELETE FROM leaderboard WHERE id=$1", [id]);
    res.status(200).send("User deleted from leaderboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = leaderboardRouter;
