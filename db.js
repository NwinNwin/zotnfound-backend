const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  password: "Katy3568",
  host: "localhost",
  port: 5432,
  database: "zotnfound",
});

module.exports = pool;
