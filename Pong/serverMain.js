//Nodejs server main file

var bunyan = require('bunyan');
var net = require('net');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Game = require('./lib/game.js');

var searchQueue = [];
var games = [];

//create logger
var log = bunyan.createLogger({
  name: 'ESPServerLogger',
  streams: [{
    level: 'debug',
    stream: process.stdout
  }, {
    level: 'info',
    path: __dirname + '/log/info.log'
  }, {
    level: 'error',
    path: __dirname + '/log/error.log'
  }]
});

//start HTTP Server
http.listen(59001, function() {
  log.info('HTTP Server listening on Port 59001');
});

//on User Connection to HTTP Server send Website
app.get('/', function(req, res) {
  app.use(express.static('public'));
  res.sendFile(__dirname + '/public/index.html');
});

//connection between server and website (http server)
io.on('connection', function(socket) {
  log.debug(socket.handshake.address + " connected.");
  //on socket disconnect
  socket.on('disconnect', function(data) {
    log.debug("User disconnected from HTTP");
    searchQueue.splice(socket);
  });
  //on socket error
  socket.on('error', function(err) {
    log.error(err);
  });

  //##################
  //#pong game events#
  //##################
  socket.on('search', function(data) {
    socket.name = data;
    log.debug(socket.name + " started Searching");
    searchQueue.push(socket);
    if (searchQueue.length >= 2) { //1 = please wait, 0 = ready
      searchQueue[0].emit('searchRes', 0);
      searchQueue[1].emit('searchRes', 0);
      games.push(new Game(searchQueue[0], searchQueue[1]));
      log.debug("Game created with: " + searchQueue[0].name + ", " + searchQueue[1].name);
      searchQueue.splice(0, 2);
      //TODO: start game with 2 players
    } else {
      socket.emit('searchRes', 1);
    }
  });
  socket.on('ready', function(data) { //1=player ready, just important that event is received (for now)
    log.debug(socket.name + " is ready");
    var go = games[0].isReady(socket.name);
    if (go) {
      log.debug("Both ready. Game start now.")
      games[0].broadcast('readyRes', 0);
      //draw counter
      games[0].startCounter();
      //draw game once and start
      games[0].broadcast('drawGame', games[0].getGameObjects());
      games[0].startInterval();
    } else {
      socket.emit('readyRes', 1);
    }
  });
  socket.on('keyDown', function(data) {
    log.debug(socket.name + " pressed " + data); //up = 38, down = 40
    games[0].movePlayer(socket, data);
  });
});
