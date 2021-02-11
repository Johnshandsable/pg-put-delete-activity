const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  console.log('SERVER - GET inside /books ');

  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool
    .query(queryText)
    .then((result) => {
      // Sends back the results in an object
      res.send(result.rows);
    })
    .catch((error) => {
      console.log('error getting books', error);
      res.sendStatus(500);
    });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/', (req, res) => {
  console.log('SERVER - POST inside /books');
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  // Makes sure the user doesn't pass in empty values
  if (req.body.author || req.body.author == '') {
    res.sendStatus(400);
    return;
  }

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool
    .query(queryText, [newBook.author, newBook.title])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
router.put('/put/:id', (req, res) => {
  let bookId = req.params.id;
  console.log(`SERVER - PUT inside /books`);
  console.log('bookId', bookId);

  let queryText = `UPDATE "books" SET "isRead"=TRUE WHERE "id"=$1`;

  console.log(queryText);
  pool
    // passes in bookId to server
    .query(queryText, [bookId])
    .then((result) => {
      console.log('Updating a book as isRead with id:', bookId);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(`Error updating book`, error);
      res.sendStatus(500);
    });
});

// TODO - DELETE
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
router.delete('/delete/:id', (req, res) => {
  let bookId = req.params.id;
  console.log(`SERVER - DELETE inside /books`);
  console.log('bookId', bookId);

  let queryText = `DELETE FROM "books" WHERE "id"=$1`;
  console.log(queryText);
  pool
    // passes in bookId to server
    .query(queryText, [bookId])
    .then((result) => {
      console.log('Deleting song with id:', bookId);
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log(`Error deleting book`, error);
      res.sendStatus(500);
    });
});

module.exports = router;
