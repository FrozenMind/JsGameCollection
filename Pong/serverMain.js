//Nodejs server main file

var bunyan = require('bunyan');
var net = require('net');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var game = require('./lib/game.js');


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
    socket.on('test', function(data) {
        log.debug(data);
        socket.emit('test', "echo: " + data);
    });
    //on socket disconnect
    socket.on("disconnect", function(data) {
        log.debug("User disconnected from HTTP");
    });
    //on socket error
    socket.on("error", function(err) {
        log.error(err);
    });
});

function onKeyDown() {
    //TODO: tell game to moveplayer
}

function onReady() {
    //TODO: if both are ready start game
}
