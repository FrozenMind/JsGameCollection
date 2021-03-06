//Nodejs server main file for Pong
var net = require('net'),
  express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  Game = require('./lib/game.js'),
  log = require('./lib/logger.js') //import bunyan logger

var searchQueue = [] //all sockets that search a game
var games = [] //has all active games

//game options about sizes and speeds
var gameOptions = {
  ballSpeed: 5,
  width: 400, //TODO: get client size
  height: 300, //TODO: get client size
  ballSize: 10,
  playerWidth: 10,
  playerHeight: 100,
  playerSpeed: 3
}

//start HTTP Server
http.listen(59001, function() {
  log.info('HTTP Server listening on Port 59001')
})

//on User Connection to HTTP Server return Website
app.get('/', function(req, res) {
  app.use(express.static('public'))
  res.sendFile(__dirname + '/public/index.html')
})

//connection between server and website (via socket io)
io.on('connection', function(socket) {
  log.debug(socket.handshake.address + " connected.")
  //on socket disconnect
  socket.on('disconnect', function(data) {
    log.debug("User disconnected from HTTP");
    //remove from searchQueue if its in
    if (searchQueue.indexOf(socket) != -1)
      searchQueue.splice(socket)
  })
  //on socket error
  socket.on('error', function(err) {
    log.error(err)
    //remove from searchQueue if its in
    if (searchQueue.indexOf(socket) != -1)
      searchQueue.splice(socket)
  })
  //##################
  //#pong game events#
  //##################
  //player chose his name so tell him gameObjects
  socket.on('join', function(data) {
    //save user name to socket
    socket.name = data
    socket.emit('joinRes', gameOptions)
  })
  //player started to search for a game
  socket.on('search', function(data) {
    //TODO: check that name is unique
    log.debug(socket.name + " started Searching")
    //add socket to searchQueue
    searchQueue.push(socket)
    //if more than 2 are searching connect them as Opponents
    if (searchQueue.length >= 2) { //false = please wait, true = ready
      //create new game with first 2 sockets
      //tell first 2 sockets of queue that they found a game
      searchQueue[0].emit('searchRes', true)
      searchQueue[1].emit('searchRes', true)
      games.push(new Game(searchQueue[0], searchQueue[1], gameOptions))
      log.debug("Game created with: " + searchQueue[0].name + ", " + searchQueue[1].name)
      //splice first 2 sockets from searchQueue
      searchQueue.splice(0, 2)
    } else {
      //tell socket to wait
      socket.emit('searchRes', false)
    }
  })
  socket.on('ready', function(data) { //true=player ready
    log.debug(socket.name + " is ready")
    //check if both players are ready, by telling him that one player is ready
    games[findGameID(socket.name)].isReady(socket.name)
  })
  socket.on('doneRes', function(data) {
    //tell server to remove this game object
    removeGame(socket.name)
  })
  socket.on('keyDown', function(data) {
    log.debug(socket.name + " pressed " + data) //up = 38, down = 40
    //tell game that one player moved
    games[findGameID(socket.name)].movePlayer(socket.name, data == 38 ? true : false, true)
  })
  socket.on('keyUp', function(data) {
    log.debug(socket.name + " released " + data) //up = 38, down = 40
    //tell game that one player stopped move
    games[findGameID(socket.name)].movePlayer(socket.name, data == 38 ? true : false, false)
  })
})

//find game ID which has one socket with this name
function findGameID(sName) {
  for (i = games.length - 1; i >= 0; i--) {
    if (games[i].s1.name == sName || games[i].s2.name == sName)
      return i
  }
  return -1 //socket is in no active game
}

//remove one gameObject
function removeGame(name) {
  var id = findGameID(name)
  if (id != -1) {
    games.splice(id, 1)
    log.info("Game " + id + " closed")
  }

}
