//client main file
var socket = undefined;

$(document).ready(function() {
    socket = io.connect('81.169.173.33:69001');
});

function onKeyDown() {
    //TODO: if up or down pressed tell server what key is pressed
    socket.emit('key', data);
}

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
