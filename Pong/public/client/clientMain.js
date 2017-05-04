//client main file
var socket = undefined;
var stage;
var width, height; //stage width and height
var rect_player1, rect_player2, cir_ball; //players and ball drawing object
var btn_search, btn_ready; //btn to search for a game and press ready
var txt_status; //show different texts like are u ready, please wait, ..
var txt_score; //shows score label
var txt_counter; //show counter
var playerHeight, playerWidth; //width and height is clientside for now
//TODO: move width and height to server side.

$(document).ready(function() {
  initStage(); //init stage objects
  initSocket(); //connect to server and create socket events
});

//TODO: init the player and ball on event based on serverside
//TODO2: so its not fix, so u can make different game modes
function initStage() {
  stage = new createjs.Stage('gameArea'); //create stage
  stage.canvas.style.background = "#ffffff"; //set stage bg
  width = stage.canvas.width;
  height = stage.canvas.height;
  playerWidth = 20; //TODO: move to serverside
  playerHeight = 100; //TODO: move to serverside
  //create objects to draw game
  rect_player1 = new createjs.Shape();
  rect_player1.x = playerWidth * 2;
  rect_player1.y = height / 2 - playerHeight / 2;
  rect_player1.graphics.beginFill("#000000").drawRect(0, 0, playerWidth, playerHeight);
  rect_player2 = new createjs.Shape();
  rect_player2.x = width - playerWidth * 2;
  rect_player2.y = height / 2 - playerHeight / 2;
  rect_player2.graphics.beginFill("#000000").drawRect(0, 0, playerWidth, playerHeight);
  rect_ball = new createjs.Shape();
  rect_ball.x = width / 2;
  rect_ball.y = height / 2;
  rect_ball.graphics.beginFill("#000000").drawCircle(0, 0, 10);
  //buttons have onClick events
  btn_search = new createjs.Shape();
  btn_search.x = 0;
  btn_search.y = 0;
  btn_search.graphics.beginFill("#ff0000").drawRect(0, 0, 200, 50);
  btn_search.addEventListener('click', function(event) {
    if ($("#nameInput").val() != "") {
      socket.emit('search', $("#nameInput").val());
      $("#nameInput").remove();
    }
  });
  btn_ready = new createjs.Shape();
  btn_ready.x = 0;
  btn_ready.y = 0;
  btn_ready.graphics.beginFill("#ff0000").drawRect(0, 0, 200, 50);
  btn_ready.addEventListener('click', function(event) {
    socket.emit('ready', true);

  });
  txt_status = new createjs.Text(); //waiting for player or wait till player is ready or start search
  txt_status.set({
    text: "Start Search For Opponent",
    font: "12px Arial",
    color: "#000000",
    x: 10,
    y: 10
  });
  txt_score = new createjs.Text(); //score of player one : score of player two
  txt_score.set({
    text: "0 : 0",
    font: "12px Arial",
    color: "#000000",
    x: width / 2,
    y: 10
  });
  txt_counter = new createjs.Text(); //counter label to show when game is going to start
  txt_counter.set({
    text: "3",
    font: "30px Arial",
    color: "#ff0000",
    textAlign: 'center',
    textBaseline: 'middle',
    x: width / 2,
    y: 50
  });
  //default is search button active
  stage.addChild(btn_search);
  stage.addChild(txt_status);
  stage.update(); //update stage once
  //add key event listener
  document.addEventListener("keydown", keyDown, false);
  document.addEventListener("keyup", keyUp, false);
}

function initSocket() {
  socket = io(); //connect to server
  //draw objects (players, ball and score)
  socket.on('drawGame', function(data) {
    //server will send these in interval based on server tick
    rect_player1.x = data.player1.x;
    rect_player1.y = data.player1.y;
    rect_player2.x = data.player2.x;
    rect_player2.y = data.player2.y;
    rect_ball.x = data.ball.x;
    rect_ball.y = data.ball.y;
    txt_score.text = data.name.player1 + " - " + data.score.player1 + " : " + data.score.player2 + " - " + data.name.player2;
    console.log("Game updated");
    stage.update();
  });
  //draw counter
  socket.on('counter', function(data) {
    //check if counter object is on stage, else add it
    if (stage.getChildIndex(txt_counter) == -1)
      stage.addChild(txt_counter);
    //if counter data is not -1 (done code) draw new number else removeChild
    if (data == -1)
      stage.removeChild(txt_counter);
    else
      txt_counter.text = data;
    stage.update(); //update stage
  });
  //draw goal animation
  socket.on('goal', function(data) {
    //TODO: play goal animation
  });
  //server tells if theres an opponent for u or u need to wait
  socket.on('searchRes', function(data) {
    //false = please wait, true = opponent found
    if (data == false) {
      //remove button and show please wait text
      stage.removeChild(btn_search);
      txt_status.text = "Please Wait For Opponent...";
      stage.update();
    } else {
      //opponent found, show ready button
      console.log('Enemy found.')
      stage.removeChild(btn_search);
      stage.removeChild(txt_status);
      txt_status.text = "Press to ready"
      stage.addChild(btn_ready);
      stage.addChild(txt_status);
      stage.update();
    }
  });
  //u are ready, so server tells if your opponent is ready too
  socket.on('readyRes', function(data) {
    //false = please wait, true = opponent found
    if (data == false) {
      //show please wait label
      stage.removeChild(btn_ready);
      txt_status.text = "Please Wait Till Opponent is ready...";
      stage.update();
    } else {
      //both players are ready, so draw basic start positions
      //server will overwrite this within few milliseconds via drawGame event
      console.log('Game start now.')
      stage.removeChild(btn_ready);
      stage.removeChild(txt_status);
      stage.addChild(rect_player1);
      stage.addChild(rect_player2);
      stage.addChild(rect_ball);
      stage.addChild(txt_score);
      stage.update();
    }
  });
}

//on key down tell server whether u pressed up or down
function keyDown(e) {
  if (e.keyCode == 38 || e.keyCode == 40) //up = 38, down = 40
    socket.emit('keyDown', e.keyCode);
}
//on key up tell server stop move his player
function keyUp(e) {
  if (e.keyCode == 38 || e.keyCode == 40) //up = 38, down = 40
    socket.emit('keyUp', e.keyCode);
}
