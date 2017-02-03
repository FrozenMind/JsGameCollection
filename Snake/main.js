var stage;
var snake;

init();

function init() {
    //init stage
    stage = new createjs.Stage("gameArea");
    //create Snake with a little snake to start
    snake = new Snake();
    snake.loadDefaultSnake();

    //create ticker
    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setInterval(1000 / 60);
}

function tick() {
    stage.update();
}

//if key is pressed
function keyDown(e) {
    switch (e.keyCode) {
        case "":

            break;
    }
}

//if key is released
function keyUp(e) {
    switch (e.keyCode) {
        case "":

            break;
    }
}
