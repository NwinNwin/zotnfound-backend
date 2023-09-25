const express = require("express");
const leaderboardRouter = express.Router();
const middleware = require("../middleware");

const pool = require("../server/db");

// add a user to leaderboard
leaderboardRouter.post("/", middleware.decodeToken, async (req, res) => {
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
leaderboardRouter.put("/", middleware.decodeToken, async (req, res) => {
  const { email, pointsToAdd } = req.body; // Assume you're sending email and pointsToAdd in the request body

  if (!email || typeof pointsToAdd !== "number") {
    return res.status(400).send("Invalid request parameters");
  }

  try {
    // First, fetch the current points of the user
    const currentPointsResult = await pool.query(
      "SELECT points FROM leaderboard WHERE email=$1",
      [email]
    );

    if (currentPointsResult.rows.length === 0) {
      return res.status(404).send("User not found");
    }

    const currentPoints = currentPointsResult.rows[0].points;
    const newPoints = currentPoints + pointsToAdd;

    // Now, update the user's points in the leaderboard
    await pool.query("UPDATE leaderboard SET points=$1 WHERE email=$2", [
      newPoints,
      email,
    ]);

    res.send("Points updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// delete user from leaderboard
leaderboardRouter.delete("/:id", middleware.decodeToken, async (req, res) => {
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
