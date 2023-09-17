const express = require("express");
const leaderboardRouter = express.Router();

const pool = require("../server/db");

// add a user to leaderboard
leaderboardRouter.post("/", async (req, res) => {
  try {
    const lbData = await pool.query(
      "INSERT INTO leaderboard (email, points) VALUES ($1, $2)",
      ["test@gmail.com", 5]
    );
  } catch (err) {
    console.error(err);
  }
});

// get all users on leaderboard (descending)
leaderboardRouter.get("/", async (req, res) => {
  try {
    await pool.query("SELECT * FROM leaderboard ORDER BY points DESC");
  } catch (error) {
    console.log(error);
  }
});

// update user's points
leaderboardRouter.put("/", async(req, res) => {
    try{
        await pool.query("UPDATE leaderboard SET points=100 WHERE email=$1", ["test@gmail.com"])

        // this could be how we udpate the points
        // const point = await pool.query("SELECT points FROM leaderboard WHERE email=$1", ["test@gmail.com"])
        // await pool.query("UPDATE leaderboard SET points=$1 WHERE email=$2", [point.rows[0].points, "test@gmail.com"])
    } catch(err){
        console.error(err)
    }
})

// delete user from leaderboard
leaderboardRouter.delete("/", async(req, res) => {
    try{
        await pool.query("DELETE FROM leaderboard WHERE email=$1", ["test@gmail.com"])
    } catch(err){
        console.error(err)
    }
})

module.exports = leaderboardRouter;
