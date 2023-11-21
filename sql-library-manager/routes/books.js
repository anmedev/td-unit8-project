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
    res.redirect("/books" + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new-book", {book, errors: error.errors, title: "New Book"})
      res.redirect("/books");
    } else {
      throw error;
    }
  }
}));

// Displays the "Update Book" form.
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  book ? res.render("update-book", {book, title: "Update Book"}) : res.sendStatus(404);
}));

// Updates Book in the database.
// router.post("/:id", asyncHandler(async (req, res) => {
//   const book = await Book.findByPk(req.params.id);
//   await book.update(req.body);
//   res.redirect("/books" + book.id);
// }))

router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(article) {
      await book.update(req.body);
      res.redirect("/books/" + book.id); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", {book, errors: error.errors, title: "Update Book"})
    } else {
      throw error;
    }
  }
}));

// Deletes a book from the database.
router.post("/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect("/books");
}))

module.exports = router;
