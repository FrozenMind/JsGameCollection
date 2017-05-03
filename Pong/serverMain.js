//Nodejs server main file for Pong
var bunyan = require('bunyan');
var net = require('net');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Game = require('./lib/game.js');

var searchQueue = []; //all sockets that search a game
var games = []; //has all active games

//create logger --> info and error is logged into a file
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

//on User Connection to HTTP Server return Website
app.get('/', function(req, res) {
  app.use(express.static('public'));
  res.sendFile(__dirname + '/public/index.html');
});

//connection between server and website (via socket io)
io.on('connection', function(socket) {
  log.debug(socket.handshake.address + " connected.");
  //on socket disconnect
  socket.on('disconnect', function(data) {
    log.debug("User disconnected from HTTP");
    //remove from searchQueue if its in
    if (searchQueue.indexOf(socket) != -1)
      searchQueue.splice(socket);
  });
  //on socket error
  socket.on('error', function(err) {
    log.error(err);
    //remove from searchQueue if its in
    if (searchQueue.indexOf(socket) != -1)
      searchQueue.splice(socket);
  });
  //##################
  //#pong game events#
  //##################
  socket.on('search', function(data) {
    //save user name to socket
    socket.name = data;
    //TODO: check that name is unique
    log.debug(socket.name + " started Searching");
    //add socket to searchQueue
    searchQueue.push(socket);
    //if more than 2 are searching connect them as Opponents
    if (searchQueue.length >= 2) { //false = please wait, true = ready
      //tell first 2 sockets of queue that they found a game
      searchQueue[0].emit('searchRes', true);
      searchQueue[1].emit('searchRes', true);
      //create new game with first 2 sockets
      var opt = {
        ballSpeed: 5,
        width: 400, //TODO: get client size
        height: 300, //TODO: get client size
        ballSize: 10,
        playerWidth: 20,
        playerHeight: 100,
        playerSpeed: 5
      };
      games.push(new Game(searchQueue[0], searchQueue[1], opt));
      log.debug("Game created with: " + searchQueue[0].name + ", " + searchQueue[1].name);
      //splice first 2 sockets from searchQueue
      searchQueue.splice(0, 2);
    } else {
      //tell socket to wait
      socket.emit('searchRes', false);
    }
  });
  socket.on('ready', function(data) { //true=player ready
    log.debug(socket.name + " is ready");
    //check if both players are ready, by telling him that one player is ready
    games[findGameID(socket.name)].isReady(socket.name);
  });
  socket.on('keyDown', function(data) {
    log.debug(socket.name + " pressed " + data); //up = 38, down = 40
    //tell game that one player moved
    games[findGameID(socket.name)].movePlayer(socket.name, data);
  });
});

//find game ID which has one socket with this name
function findGameID(sName) {
  for (i = games.length - 1; i >= 0; i--) {
    if (games[i].s1.name == sName || games[i].s2.name == sName)
      return i;
  }
  return -1; //socket is in no active game
}
