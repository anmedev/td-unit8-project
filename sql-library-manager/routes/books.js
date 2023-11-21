//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-IMPORTS-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

const express = require('express');
const router = express.Router();
const Book = require("../models").Book;

//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-ASYNC ERROR HANDLER-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-ROUTES-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

// Gets all the books in the database and lists them on the main page.
router.get("/", asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render("index", {books, title: "Books"});
}));

// Displays the "Create New Book" form.
router.get("/books/new", asyncHandler(async (req, res) => {
  res.render("new-book", {book: {}, title: "New Book"});
}));

// Posts a new book to the database.
router.post("/books/new", asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.redirect("/books");
}))



module.exports = router;
