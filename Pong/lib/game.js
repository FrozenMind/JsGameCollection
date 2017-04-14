//Game File to create gameobject

var Game = function(socket1, socket2) {
    this.s1 = socket1;
    this.s2 = socket2;
    this.ready = 0;
    //TODO: init players and ball
}

Game.prototype.isReady = function(name) {
    if (this.s1.name == name || this.s2.name == name) {
        this.ready++;
    }
    if (this.ready == 2) {
        return true;
    } else {
        return false;
    }
}

Game.prototype.getGameObject = function() {
    //TODO: return game object if interval is active
}

Game.prototype.startInterval = function() {
    //TODO: activate interval
}

Game.prototype.stopInterval = function() {
    //TODO: pause interval
}

Game.prototype.startCounter = function() {
    //TODO:
}

Game.prototype.isGoal = function() {
    //TODO: return if ball is in goal or not
}

Game.prototype.update = function() {
    //TODO: update players and ball
}

Game.prototype.movePlayer = function(socket, upOrDown) {
    //TODO: move player up or down depends on what key he send
}

module.exports = Game;
