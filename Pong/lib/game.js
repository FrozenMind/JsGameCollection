//Game File to create gameobject
var Game = function(socket1, socket2, opt) {
  this.s1 = socket1; //player1
  this.s2 = socket2; //player2
  this.ready = 0; //counter to check who is ready
  this.gameObjects = {
    player1: {
      x: 50,
      y: 100
    },
    player2: {
      x: 350,
      y: 100
    },
    ball: {
      x: 200,
      y: 150
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
  //opt has lot of values
  this.ballSpeed = opt.ballSpeed; //speed ball is moving (xSpeed +ySpeed = ballSpeed)
  this.xSpeed = this.ballSpeed - 1;
  this.ySpeed = 1;
  this.width = opt.width; //stage width
  this.height = opt.height; //stage.height
  this.ballSize = opt.ballSize;
  this.playerWidth = opt.playerWidth;
  this.playerHeight = opt.playerHeight;
  this.playerSpeed = opt.playerSpeed;
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
  //TODO: ball movement does everything wrong --> FIX IT
  if (this.active) {
    //check goal
    if (this.gameObjects.ball.x < 0 || this.gameObjects.ball.x + this.ballSize > this.width) {
      //give score to player
      if (this.gameObjects.ball.x < 0) {
        this.gameObjects.score.player1++;
      } else {
        this.gameObjects.score.player2++;
      }
      //TODO: wait a sec, maybe start a new counter
      //for now reset ball to mid
      this.gameObjects.ball.x = 200; //TODO: DEL later
      this.gameObjects.ball.y = 150; //TODO: DEL later
      this.xSpeed = 4; //TODO: DEL later
      this.ySpeed = 1; //TODO: DEL later
    } else if (this.gameObjects.ball.y <= 0 || this.gameObjects.ball.y + this.ballSize >= this.height) {
      //ball hit top or bottom
      this.ySpeed *= -1;
      if (this.gameObjects.ball.y <= 0) {
        this.gameObjects.ball.y = this.ballSize;
      } else {
        this.gameObjects.ball.y = this.height - this.ballSize;
      }
    }
    //check if ball hits player
    if (this.gameObjects.ball.x - this.ballSize <= this.gameObjects.player1.x + this.playerWidth) {
      if (this.gameObjects.ball.y + this.ballSize > this.gameObjects.player1.y && this.gameObjects.ball.y - this.ballSize < this.gameObjects.player1.y + this.playerHeight) {
        var ss = (this.gameObjects.ball.y - this.gameObjects.player1.y) / (this.playerHeight / 2);
        if (ss > 1) {
          this.ySpeed = (this.ballSpeed - 1) * (2 - ss);
        } else if (ss < 1) {
          this.ySpeed = (this.ballSpeed - 1) * (1 - ss);
          this.ySpeed *= (-1);
        } else {
          this.ySpeed = 0;
        }
        this.xSpeed = this.ballSpeed - Math.abs(this.ySpeed);
      }
    } else if (this.gameObjects.ball.x + this.ballSize >= this.gameObjects.player2.x) {
      if (this.gameObjects.ball.y + this.ballSize > this.gameObjects.player2.y && this.gameObjects.ball.y - this.ballSize < this.gameObjects.player2.y + this.playerHeight) {
        var ss = (this.gameObjects.ball.y - this.gameObjects.player2.y) / (this.playerHeight / 2);
        if (ss > 1) {
          this.ySpeed = (this.ballSpeed - 1) * (2 - ss);
        } else if (ss < 1) {
          this.ySpeed = (this.ballSpeed - 1) * (1 - ss);
          this.ySpeed *= (-1);
        } else {
          this.ySpeed = 0; //ball in mid of player
        }
        this.xSpeed = (this.ballSpeed - Math.abs(this.ySpeed)) * (-1); //*-1 because ball need to move to left side
      }
    }
    //move ball
    this.gameObjects.ball.x += this.xSpeed;
    this.gameObjects.ball.y += this.ySpeed;
  }
}

Game.prototype.movePlayer = function(name, upOrDown) {
  //move player up = 38 or down = 40
  if (this.s1.name == name) {
    switch (upOrDown) {
      case 38: //up
        if (this.gameObjects.player1.y > 0)
          this.gameObjects.player1.y -= this.playerSpeed;
        break;
      case 40: //down
        if (this.gameObjects.player1.y + this.playerHeight < this.height)
          this.gameObjects.player1.y += this.playerSpeed;
        break;
    }
  } else if (this.s2.name == name) {
    switch (upOrDown) {
      case 38: //up
        if (this.gameObjects.player2.y > 0)
          this.gameObjects.player2.y -= this.playerSpeed;
        break;
      case 40: //down
        if (this.gameObjects.player2.y + this.playerHeight < this.height)
          this.gameObjects.player2.y += this.playerSpeed;
        break;
    }
  }
}

Game.prototype.broadcast = function(key, val) {
  //communicate with both sockets by calling one method
  this.s1.emit(key, val);
  this.s2.emit(key, val);
}

module.exports = Game; //export module to use in "serverMain.js" file
