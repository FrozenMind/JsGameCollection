//Nodejs server main file

var bunyan = require('bunyan');
var net = require('net');
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

//TCP Server erzeugen!
server = net.createServer(function(sck) {
    log.debug("Client connected to TCP Server");
    //on data received
    sck.on('data', function(data) {
        log.debug(data);
    });
    //on socket disconnect
    sck.on("end", function() {
        log.debug("Client disconnected from TCP Server");
    });
    //on socket error (i.e. socket disconnect without closing)
    sck.on('error', function(sckErr) {
        log.error(sckErr);
    });
}).listen(69001, function() {
    log.debug("TCP Server listening on Port 69001");
});

//TCP Server Error
server.on("error", function(err) {
    log.error(err);
});

function onKeyDown() {
    //TODO: tell game to moveplayer
}

function onReady() {
    //TODO: if both are ready start game
}
