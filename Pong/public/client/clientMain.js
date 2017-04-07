//client main file
var socket = undefined;

$(document).ready(function() {
    initSocket();
});

function initSocket() {
    socket = io();

    socket.on('initGame', function(data) {
        //TODO: initalize game area and draw start objects
    });

    socket.on('gameObjectReceived', function(data) {
        //TODO: draw game out of objects
    });

    socket.on('counter', function(data) {
        //TODO: draw counter
    });

    socket.on('goal', function(data) {
        //TODO: play goal animation
    });
}

function onKeyDown() {
    //TODO: if up or down pressed tell server what key is pressed
    //socket.send('key', data);
}
