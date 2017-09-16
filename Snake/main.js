var stage;
var snake;
var food;
var running;
var speedCounter = 0;
var fps;
var score = 0;
var textOverlay;

$(document).ready(function () {
    init();
});

function init() {
    fps = 60;
    //init stage
    stage = new createjs.Stage("gameArea");
    stage.canvas.style.background = "#000000" //black background
        //create ticker
    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(fps); //in this game fps means snake speed
    createjs.Ticker.paused = true;

    // Overlay 
    textOverlay = new createjs.Text();
    textOverlay.set({
        text: "Press any key to start \n Use arrow keys or WASD to move!",
        font: "24px Arial",
        color: "#ffffff",
        textAlign: "center",
        textBaseline: "middle",
        x: stage.canvas.width / 2,
        y: stage.canvas.height / 2
    });
    stage.addChild(textOverlay);
    stage.update();

    //add key event listener
    document.addEventListener("keydown", keyDown, false);
}

function start() {
    score = 0
    stage.removeAllChildren();
    //create snake and load default
    snake = new Snake();
    snake.loadDefaultSnake();
    //create food rect
    food = new createjs.Shape();
    food.graphics.beginFill('#006600').drawRect(0, 0, snake.size, snake.size);
    //start location is on top half to make sure its not on snake
    food.x = Math.floor(Math.random() * (stage.canvas.width / snake.size)) * snake.size;
    food.y = Math.floor(Math.random() * (stage.canvas.height / snake.size)) * snake.size;
    stage.addChild(food);
    //set food in background
    stage.setChildIndex(food, 0);
    createjs.Ticker.paused = false;
}

function tick(event) {
    if (event.paused)
        return;

    if (speedCounter >= snake.speed) {
        speedCounter = 0;
        snake.move();
        stage.update();
        snake.calcSpeed();
        checkFoodHit();
        isGameLost();
    }
    speedCounter++;
}

//if key is pressed
function keyDown(e) {
    if (!createjs.Ticker.paused) {
        if (snake.readyToMove) {
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
    } else {
        //press any key to start
        start();
    }
}

//if snake hits food make snake bigger and move food
function checkFoodHit() {
    if (food.y == snake.rects[0].y && food.x == snake.rects[0].x) {
        food.x = Math.floor(Math.random() * (stage.canvas.width / snake.size)) * snake.size;
        food.y = Math.floor(Math.random() * (stage.canvas.height / snake.size)) * snake.size;
        snake.addRect();
        score++;
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

    if (wallHitted || selfHitted) {
        createjs.Ticker.paused = true;
        stage.addChild(textOverlay);
        stage.update();
        $("#ResultScore").html("<b>You lost. Your Score is: " + score + "</b>")
    } else {
        $("#ResultScore").html("<b>Score: " + score + "</b>")
    }
}
