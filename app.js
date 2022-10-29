var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

var indexRouter = require('./routes/index');

const that = this;
const Server = require('socket.io').Server;

const a = new Server();

const user_data = {  };

app.io = new Server();

app.io.on('connection', (socket) => {

  socket.on('chat-msg-1', (msg) => {
    app.io.emit('chat-msg-2', msg);
  });

  socket.on('user-connect', (name) => {
    setName(name, socket);
    app.io.emit('user-connect-2', name);
  });

  socket.on('disconnect', () => {
    app.io.emit('user-disconnect', getName(socket.id));
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

function setName(name, socket) {
  user_data[socket.id] = name;
}

function getName(id) {
  return user_data[id];
}
