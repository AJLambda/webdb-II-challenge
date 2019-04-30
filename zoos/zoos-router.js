const knex = require("knex");
const router = require("express").Router();

const knexConfig = {
  client: "sqlite3",
  connection: {
    // string or object
    filename: "./data/lambda.sqlite3" // from the root folder
  },
  useNullAsDefault: true
  //debug: true,
};
const db = knex(knexConfig);

// GET /api/zoos
router.get("/", (req, res) => {
  // select * from roles
  db("zoos") //<< return a promise with all the rows
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
