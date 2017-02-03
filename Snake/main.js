var stage;
var snake;
var food;

init();

function init() {
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
    food.x = Math.floor(Math.random() * stage.canvas.width - snake.size);
    food.y = Math.floor(Math.random() * stage.canvas.height - snake.size);
    stage.addChild(food);
    //create ticker
    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(5); //in this game fps means snake speed
    //add key event listener
    document.addEventListener("keydown", keyDown, false);
}

function tick() {
    snake.move();
    checkFoodHit();
    checkLoss();
    stage.update();
}

//if key is pressed
function keyDown(e) {
    console.log(e);
    switch (e.keyCode) {
        case 38: //38 = up
            if (snake.direction != 3) {
                snake.direction = 1;
            }
            break;
        case 39: //39 = right
            if (snake.direction != 4) {
                snake.direction = 2;
            }
            break;
        case 40: //40 = down
            if (snake.direction != 1) {
                snake.direction = 3;
            }
            break;
        case 37: //37 = left
            if (snake.direction != 2) {
                snake.direction = 4;
            }
            break;
    }
}

//if snake hits food make snake bigger and move food
function checkFoodHit() {
    if (food.y + snake.size >= snake.rects[0].y && food.y <= snake.rects[0].y + snake.size && food.x <= snake.rects[0].x + snake.size && food.x + snake.size >= snake.rects[0].x) {
        food.x = Math.floor(Math.random() * (stage.canvas.width - snake.size));
        food.y = Math.floor(Math.random() * (stage.canvas.height - snake.size));
        snake.addRect();
    }
}

//check if snake is out of window
function checkLoss() {

    if (snake.rects[0].y < 0 || snake.rects[0].y + snake.size > stage.canvas.height || snake.rects[0].x < 0 || snake.rects[0].x + snake.size > stage.canvas.width) {
        console.log("you lost. Your Score is: " + snake.rects.length);
        //alert("you lost. Your Score is: " + snake.rects.length);
        init();
    }
}
