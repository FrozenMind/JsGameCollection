//Game File to create gameobject

var Game = function(socket1, socket2) {
  this.s1 = socket1;
  this.s2 = socket2;
  this.ready = 0;
  this.gameObjects = {
    player1: {
      x: 50,
      y: 150
    },
    player2: {
      x: 450,
      y: 150
    },
    ball: {
      x: 250,
      y: 200
    },
    score: {
      player1: 0,
      player2: 0
    },
    name: {
      player1: this.s1.name,
      player2: this.s2.name
    }
  };
  this.active = false;
}

Game.prototype.isReady = function(name) {
  if (this.s1.name == name || this.s2.name == name) {
    this.ready++;
  }
  if (this.ready == 2) {
    this.active = true;
    return true;
  } else {
    return false;
  }
}

Game.prototype.getGameObjects = function() {
  if (this.active)
    return this.gameObjects;
}

Game.prototype.startInterval = function() {
  this.active = true;
}

Game.prototype.stopInterval = function() {
  this.active = false;
}

Game.prototype.startCounter = function() {
  var count = 3;
  var s1Copy = this.s1;
  var s2Copy = this.s2;
  var counterInterval = setInterval(function() {
    s1Copy.emit('counter', count);
    s2Copy.emit('counter', count);
    count--;
    if (count == -1) {
      s1Copy.emit('counter', -1); //-1 says delete label
      s2Copy.emit('counter', -1);
      clearInterval(counterInterval);
    }
  }, 1000);
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

Game.prototype.broadcast = function(key, val) {
  this.s1.emit(key, val);
  this.s2.emit(key, val);
}

module.exports = Game;
