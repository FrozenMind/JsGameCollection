var stage;
var fps = 30;
var player, area;
var queue;
var WIDTH;
var HEIGHT;

var images = [
    {
        key: "player",
        value: "http://games-broduction.com/Content/Games/DontDrinkAndRun/img/player.png"
    }
]


$(document).ready(function () {
    init();
    loadImages();
});


function init() {
    stage = new createjs.Stage("gameArea");
    stage.canvas.style.background = "#000000"
    WIDTH = stage.canvas.width;
    HEIGHT = stage.canvas.height;
    //create ticker
    createjs.Ticker.addEventListener("tick", render);
    createjs.Ticker.paused = true;
    createjs.Ticker.setFPS(fps);
}

function start() {
    area = new Area(3);
    player = new Player(30, -10, 30, queue.getResult("player"));
    stage.addChild(player.animation);
    createjs.Ticker.paused = false;
}

function render() {
    if (!createjs.Ticker.paused)
        stage.update();
}


function keyDown(e) {

}

function loadImages() {
    queue = new createjs.LoadQueue();
    queue.addEventListener('complete', handleFilesComplete);
    images.forEach(function (img) {
        var loadItemProps = {
            src: img.value,
            id: img.key,
            type: createjs.AbstractLoader.IMAGE,
            crossOrigin: false,
        }
        var loadItem = new createjs.LoadItem().set(loadItemProps);
        queue.loadFile(loadItem);
    })
}

function handleFilesComplete(e) {
    console.log(e.result);
    start();
}