module.exports = Game;

var Game = function(socket1, socket2) {
    //TODO: init players and ball
}

Game.prototype.getGameObject() {
    //TODO: return game object if interval is active
}

Game.prototype.startInterval() {
    //TODO: activate interval
}

Game.prototype.stopInterval() {
    //TODO: pause interval
}

Game.prototype.startCounter() {
    //TODO:
}

Game.prototype.isGoal() {
    //TODO: return if ball is in goal or not
}

Game.prototype.update() {
    //TODO: update players and ball
}

Game.prototype.movePlayer(socket, upOrDown) {
    //TODO: move player up or down depends on what key he send
}
