//Game File to create gameobject
var Game = function(socket1, socket2) {
  this.s1 = socket1; //player1
  this.s2 = socket2; //player2
  this.ready = 0; //counter to check who is ready
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
  }; //gameObjects contains both player, ball, score and name
  //client will draw this one if it receives this
  this.active = false; //is game running?
}

Game.prototype.isReady = function(name) {
  //check if socket is one of the 2 player
  if (this.s1.name == name || this.s2.name == name) {
    //increase ready
    this.ready++;
  }
  if (this.ready == 2) {
    //both player are ready, so start game, server will call broadcast method
    //TODO: understand which context is necessary here and call broadcast method
    this.active = true;
    return true;
  } else {
    return false;
  }
}

Game.prototype.getGameObjects = function() {
  //if game is active return gameObjects
  if (this.active)
    return this.gameObjects;
}

Game.prototype.startInterval = function() {
  //start game
  this.active = true;
}

Game.prototype.stopInterval = function() {
  //game is paused or stopped
  this.active = false;
}

Game.prototype.drawCounter = function() {
  var count = 3;
  //copy sockets because this context isn't available in interval
  //TODO: save context so clone can be deleted
  var s1Copy = this.s1;
  var s2Copy = this.s2;
  //inteval send every second the number 3 - 0
  var counterInterval = setInterval(function() {
    //TODO: user broadcast method on right context
    s1Copy.emit('counter', count);
    s2Copy.emit('counter', count);
    count--;
    //if 0 is send clearInterval
    if (count == -1) {
      //TODO: user broadcast method on right context
      s1Copy.emit('counter', -1); //-1 says delete label
      s2Copy.emit('counter', -1);
      clearInterval(counterInterval);
    }
  }, 1000);
}

Game.prototype.isGoal = function() {
  //TODO: check if ball is in goal, maybe move into update method
}

Game.prototype.update = function() {
  //TODO: update players and ball and return gameObjects in interval while game is active
  //here a server tick is necessary
}

Game.prototype.movePlayer = function(name, upOrDown) {
  //TODO: move player up or down depends on what key he send
}

Game.prototype.broadcast = function(key, val) {
  //communicate with both sockets by calling one method
  this.s1.emit(key, val);
  this.s2.emit(key, val);
}

module.exports = Game; //export module to use in "serverMain.js" file
