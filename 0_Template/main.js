var stage;

init();

function init() {
    //init stage
    stage = new createjs.Stage("gameArea");
    stage.canvas.style.background = "#000000" //black background
    //create ticker
    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(30); //in this game fps means snake speed
    //add key event listener
    document.addEventListener("keydown", keyDown, false);
}

function tick() {
    stage.update();
}

//if key is pressed
function keyDown(e) {
    switch (e.keyCode) {
        case 38: //38 = up
        case 87: //87 = w

            break;
        case 39: //39 = right
        case 68: //39 = d

            break;
        case 40: //40 = down
        case 83: //40 = s

            break;
        case 37: //37 = left
        case 65: //37 = a

            break;
    }
}
