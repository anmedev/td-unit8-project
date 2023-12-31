//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-IMPORTS-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');

// Imports Sequilize instance.
const sequelize = require("./models/index").sequelize;

// Tests connection to the database.
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

// Imports Express.
const app = express();

// Sets view engine to Pug template.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-ERROR HANDLERS-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  res.status(404);
  res.render('page-not-found', {error: err});
});

/* Creates a global Error handler for all errors that are not 404 errors.*/
app.use((err, req, res, next) => {
  err.status = err.status || 500
  err.message = err.message || 'Internal Server Error';
  res.status(err.status)
  res.render('error', {error: err})
  console.log(`${err.status} : ${err.message}`);
});

module.exports = app;