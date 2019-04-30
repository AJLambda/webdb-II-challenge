const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const server = express();

server.use(helmet());
server.use(express.json());

const knexConfig = {
  client: "sqlite3", // client specifies the adapter
  connection: {
    // string or object
    filename: "./data/lambda.sqlite3" // from the root folder
  },
  useNullAsDefault: true,
  debug: true
};

const db = knex(knexConfig);

// GET /api/zoos
// When the client makes a GET request to this endpoint, return a list of all the zoos in the database. Remember to handle any errors and return the correct status code.
server.get("/api/zoos", (req, res) => {
  // select * from zoos
  db("zoos") //<< return a promise with all the rows
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET /api/zoos/:id
// When the client makes a GET request to /api/zoos/:id, find the zoo associated with the given id. Remember to handle errors and send the correct status code.
server.get("/api/zoos/:id", (req, res) => {
  // select * from zoos where id = :id
  db("zoos")
    .where({ id: req.params.id })
    .first()
    .then(zoo => {
      if (zoo) {
        res.status(200).json(zoo);
      } else {
        res.status(404).json({ message: "zoo not found" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// POST /api/zoos
// When the client makes a POST request to this endpoint, a new zoo should be created in the zoos table.
// Ensure the client passes a name property in the request body. If there's an error, respond with an appropriate status code, and send a JSON response of the form { error: "Some useful error message" }.
// Return the id of the inserted zoo and a 201 status code.
server.post("/api/zoos", (req, res) => {
  // insert into roles () values (req.body)
  if (!req.body.name) {
    res.status(400).json({ message: "please provide a name" });
  } else {
    db("zoos")
      .insert(req.body, "id")
      .then(ids => {
        db("zoos")
          .where({ id: ids[0] })
          .first()
          .then(zoo => {
            res.status(201).json(zoo);
          })
          .catch(err => {
            res.status(500).json(err);
          });
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
});

// PUT /api/zoos/:id
// When the client makes a PUT request to this endpoint passing an object with the changes, the zoo with the provided id should be updated with the new information.
server.put("/api/zoos/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} ${count > 1 ? "records" : "record"} updated`
        });
      } else {
        res.status(404).json({ message: "Zoo does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// DELETE /api/zoos/:id
// When the client makes a DELETE request to this endpoint, the zoo that has the provided id should be removed from the database.
server.delete("/api/zoos/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} ${count > 1 ? "records" : "record"} deleted`
        });
      } else {
        res.status(404).json({ message: "Zoo does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
