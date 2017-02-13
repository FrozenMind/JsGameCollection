var stage;
var snake;
var food;
var running;
var speedCounter = 0;
var fps;

$(document).ready(function () {
    init();
});

function init() {
    fps = 60;
    //init stage
    stage = new createjs.Stage("gameArea");
    stage.canvas.style.background = "#000000" //black background
        //create Snake with a little snake to start
    snake = new Snake();
    snake.loadDefaultSnake();
    //create food rect
    food = new createjs.Shape();
    food.graphics.beginFill(snake.color).drawRect(0, 0, snake.size, snake.size);
    //start location is on top half to make sure its not on snake
    food.x = Math.floor(Math.random() * (stage.canvas.width / snake.size)) * snake.size;
    food.y = Math.floor(Math.random() * (stage.canvas.height / snake.size)) * snake.size;
    stage.addChild(food);
    //create ticker
    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(fps); //in this game fps means snake speed
    //add key event listener
    document.addEventListener("keydown", keyDown, false);
}

function tick(event) {
    if (event.paused)
        return;

    if(speedCounter >= snake.speed){
      speedCounter = 0;
      snake.move();
      stage.update();
      snake.calcSpeed();
      checkFoodHit();
      isGameLost();
    }
    speedCounter ++;
}

//if key is pressed
function keyDown(e) {
    if(snake.readyToMove){
      switch (e.keyCode) {
      case 38: //38 = up
      case 87: //87 = w
          if (snake.direction != 3) {
              snake.direction = 1;
              snake.readyToMove = false;
          }
          break;
      case 39: //39 = right
      case 68: //39 = d
          if (snake.direction != 4) {
              snake.direction = 2;
              snake.readyToMove = false;
          }
          break;
      case 40: //40 = down
      case 83: //40 = s
          if (snake.direction != 1) {
              snake.direction = 3;
              snake.readyToMove = false;
          }
          break;
      case 37: //37 = left
      case 65: //37 = a
          if (snake.direction != 2) {
              snake.direction = 4;
              snake.readyToMove = false;
          }
          break;
      }
    }
}

//if snake hits food make snake bigger and move food
function checkFoodHit() {
    if (food.y == snake.rects[0].y && food.x == snake.rects[0].x) {
        food.x = Math.floor(Math.random() * (stage.canvas.width / snake.size)) * snake.size;
        food.y = Math.floor(Math.random() * (stage.canvas.height / snake.size)) * snake.size;
        console.log("new food at: " + food.x + " " + food.y);
        snake.addRect();
    }
}

//check if game is lost
function isGameLost() {
    var headPosX = snake.rects[0].x;
    var headPosY = snake.rects[0].y;

    // true if snake hits a wall
    var wallHitted = headPosY < 0 || // top wall
        headPosY + snake.size > stage.canvas.height || // bottom wall
        headPosX < 0 || // left wall
        headPosX + snake.size > stage.canvas.width; // right wall

    // true if snake hits itself
    var selfHitted = false;
    for (var i = 2; i < snake.rects.length; i++) {
        selfHitted = headPosX == snake.rects[i].x && headPosY == snake.rects[i].y;
        if (selfHitted)
            break;
    }

    if(wallHitted || selfHitted){
      createjs.Ticker.paused = true;
      console.log("you lost. Your Score is: " + snake.rects.length);
      $("#ResultScore").html("<b>You lost. Your Score is: " + snake.rects.length + "</b>")
    }
}
