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
