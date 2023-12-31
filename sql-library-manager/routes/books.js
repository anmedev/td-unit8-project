//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-IMPORTS-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

const express = require('express');
const router = express.Router();
const Book = require("../models").Book;

//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-ASYNC ERROR HANDLER-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

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
router.get("/new", asyncHandler(async (req, res) => {
  res.render("new-book", {book: {}, title: "New Book"});
}));

// Posts a new book to the database.
router.post("/new", asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new-book", {book, errors: error.errors, title: "New Book"})
    } else {
      throw error;
    }
  }
}));

// Displays the "Update Book" form when a book is clicked.
router.get("/:id", asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", {book, title: "Update Book"});
  } else {
    const err = new Error();
    err.status = 404;
    err.message = "Sorry! We don't have the page you're looking for!"
    next(err);
  }
}));

// Updates the book that was clicked in the database.
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books"); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("update-book", {book, errors: error.errors, title: "Update Book"})
    } else {
      throw error;
    }
  }
}));

// Deletes a book from the database.
router.post("/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;