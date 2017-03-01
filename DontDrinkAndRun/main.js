var stage;
var fps = 30;
var player, area;

loadImages();

$(document).ready(function () {
    init();
});


function init(){
  stage = new createjs.Stage("gameArea");
  stage.canvas.style.background = "#000000"

  //create ticker
  createjs.Ticker.addEventListener("tick", render);
  createjs.Ticker.paused = false;
  createjs.Ticker.setFPS(fps);
}

function start(){
  area = new Area(3);
  player = new Player(30, -10, 30, 'img/player.png');
  stage.addChild(player.animation);
  createjs.Ticker.paused = true;
}

function render(){
 if(!createjs.Ticker.paused)
    stage.update();
}


function keyDown(e){

}

function loadImages(){
  var preload = new createjs.LoadQueue();
  preload.addEventListener('fileload', handleFileComplete);
  preload.loadFile('img/player.png');
}

function handleFileComplete(e){
  console.log(e.result);
  start();
}
