//client main file
var socket = undefined;
var stage;
var width, height;
var rect_player1, rect_player2, cir_ball;
var btn_search, btn_ready;
var txt_status, txt_score, name1, name2;
var playerHeight, playerWidth;


$(document).ready(function() {
  initStage();
  initSocket();
});

function initStage() {
  stage = new createjs.Stage('gameArea');
  stage.canvas.style.background = "#ffffff";
  width = stage.canvas.width;
  height = stage.canvas.height;
  playerWidth = 20;
  playerHeight = 100;
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
  btn_search = new createjs.Shape();
  btn_search.x = 0;
  btn_search.y = 0;
  btn_search.graphics.beginFill("#ff0000").drawRect(0, 0, 200, 50);
  btn_search.addEventListener('click', function(event) {
    if ($("#nameInput").val() != "") {
      socket.emit('search', $("#nameInput").val());
    }
  });
  btn_ready = new createjs.Shape();
  btn_ready.x = 0;
  btn_ready.y = 0;
  btn_ready.graphics.beginFill("#ff0000").drawRect(0, 0, 200, 50);
  btn_ready.addEventListener('click', function(event) {
    socket.emit('ready', 1);

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
  stage.addChild(btn_search);
  stage.addChild(txt_status);
  stage.update();
}

function initSocket() {
  socket = io();

  socket.on('initGame', function(data) {
    //TODO: initalize game area and draw start objects
  });

  socket.on('drawGame', function(data) {
    //TODO: draw game out of objects
    rect_player1.x = data.player1.x;
    rect_player1.y = data.player1.y;
    rect_player2.x = data.player2.x;
    rect_player2.y = data.player2.y;
    rect_ball.x = data.ball.x;
    rect_ball.y = data.ball.y;
    txt_score.text = data.name.player1 + " " + data.score.player1 + " : " + data.score.player2 + " " + data.name.player2;
    console.log("Game updated");
    stage.update();
  });

  socket.on('counter', function(data) {
    if (stage.getChildIndex(txt_counter) == -1)
      stage.addChild(txt_counter);
    if (data == -1)
      stage.removeChild(txt_counter);
    else
      txt_counter.text = data;
    stage.update();
  });

  socket.on('goal', function(data) {
    //TODO: play goal animation
  });

  socket.on('searchRes', function(data) {
    if (data == 1) { //1 = please wait, 0 = ready
      stage.removeChild(btn_search);
      txt_status.text = "Please Wait For Opponent...";
      stage.update();
    } else {
      console.log('Enemy found.')
      stage.removeChild(btn_search);
      stage.removeChild(txt_status);
      txt_status.text = "Press to ready..."
      stage.addChild(btn_ready);
      stage.addChild(txt_status);
      stage.update();
    }
  });

  socket.on('readyRes', function(data) {
    if (data == 1) { //1 = please wait, 0 = all players ready
      stage.removeChild(btn_ready);
      txt_status.text = "Please Wait Till Opponent is ready...";
      stage.update();
    } else {
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

function onKeyDown(e) {
  //TODO: if up or down pressed tell server what key is pressed
  if (e.keyCode == "38" || e.keyCode == "40") { //up = 38, down = 40
    var data = undefined;
    data.key = e.keyCode;
    socket.emit('keyDown', data);
  }
}
