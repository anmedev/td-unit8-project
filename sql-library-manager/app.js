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

// view engine setup
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
app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  res.status(404);
  err.message = "Sorry! We couldn't find the page you were looking for."
  res.render('page-not-found', {error: err})
  next(err);
});

// Creates a global Error handler.
app.use((req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || "Internal Server Error"
  res.status(err.status);
  res.send(err.message);
  console.log(`${err.status}: ${err.message}`);
  res.render('error', {error: err});
});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
