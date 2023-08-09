const Pool = require("pg").Pool;
const pgp = require("pg-promise")({});

const pool = new Pool({
  user: process.env.AWS_USER,
  password: process.env.AWS_PASSWORD,
  host: process.env.AWS_HOST,
  port: process.env.AWS_PORT,
  database: process.env.AWS_DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

// const cn = `postgres://${process.env.AWS_USER}:${encodeURIComponent(
//   process.env.AWS_PASSWORD
// )}@${process.env.AWS_HOST}:${process.env.AWS_PORT}/${process.env.AWS_DB_NAME}`; // For pgp
// const db = pgp(cn);

module.exports = pool ;
