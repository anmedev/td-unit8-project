//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-IMPORTS-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
const express = require('express');
const router = express.Router();
const Book = require("../models/book");

/* GET home page. */
router.get("/", async function(req, res, next) {
  res.redirect("/books");
});

module.exports = router;