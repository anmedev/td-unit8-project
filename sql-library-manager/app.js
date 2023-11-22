//-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-IMPORTS-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

const createError = require('http-errors');
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

// Creates a 404 Error Handler.
app.use(function(req, res, next) {
  res.render('page-not-found', {title: "Page Not Found"});
  // next(createError(404));
});

// Creates a global Error handler.
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', {title: "Page Not Found"});
  console.log('ERROR', err.message)
});

module.exports = app;