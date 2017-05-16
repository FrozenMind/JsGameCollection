//client main file
var socket = undefined,
  stage,
  width, height, //stage width and height
  rect_player1, rect_player2, cir_ball, //players and ball drawing object
  btn_search, btn_ready, //btn to search for a game and press ready
  txt_status, //show different texts like are u ready, please wait, ..
  txt_score, //shows score label
  txt_counter, //show counter
  playerHeight, playerWidth, //width and height is clientside for now
  myName

//if document is loaded
$(document).ready(function() {
  init(); //connect to server and create socket events
});
//init stage childs which are needed in whole game
function initStage(opt) {
  stage = new createjs.Stage('gameArea') //create stage
  stage.canvas.style.background = "#ffffff" //set stage bg
  width = stage.canvas.width
  height = stage.canvas.height
  playerWidth = opt.playerWidth //TODO: move to serverside
  playerHeight = opt.playerHeight //TODO: move to serverside
  //create objects to draw game
  rect_player1 = new createjs.Shape()
  rect_player1.x = playerWidth * 2
  rect_player1.y = height / 2 - playerHeight / 2
  rect_player1.graphics.beginFill("#000000").drawRect(0, 0, playerWidth, playerHeight)
  rect_player2 = new createjs.Shape()
  rect_player2.x = width - playerWidth * 2
  rect_player2.y = height / 2 - playerHeight / 2
  rect_player2.graphics.beginFill("#000000").drawRect(0, 0, playerWidth, playerHeight)
  rect_ball = new createjs.Shape()
  rect_ball.x = width / 2
  rect_ball.y = height / 2
  rect_ball.graphics.beginFill("#000000").drawCircle(0, 0, opt.ballSize)
  //buttons have onClick events
  btn_search = new createjs.Shape()
  btn_search.x = 0
  btn_search.y = 0
  btn_search.graphics.beginFill("#ff0000").drawRect(0, 0, 200, 50)
  btn_search.addEventListener('click', function(event) {
    socket.emit('search', myName)
  });
  btn_ready = new createjs.Shape()
  btn_ready.x = 0
  btn_ready.y = 0
  btn_ready.graphics.beginFill("#ff0000").drawRect(0, 0, 200, 50)
  btn_ready.addEventListener('click', function(event) {
    socket.emit('ready', true)

  });
  txt_status = new createjs.Text() //waiting for player or wait till player is ready or start search
  txt_status.set({
    text: "Start Search For Opponent",
    font: "12px Arial",
    color: "#000000",
    x: 10,
    y: 10
  })
  txt_score = new createjs.Text() //score of player one : score of player two
  txt_score.set({
    text: "0 : 0",
    font: "12px Arial",
    color: "#000000",
    x: width / 2,
    y: 10
  })
  txt_counter = new createjs.Text() //counter label to show when game is going to start
  txt_counter.set({
    text: "3",
    font: "30px Arial",
    color: "#ff0000",
    textAlign: 'center',
    textBaseline: 'middle',
    x: width / 2,
    y: 50
  })
  //default is search button active
  stage.update() //update stage once
}
//add button to search for a game on stage
function showSearchButton() {
  stage.addChild(btn_search)
  txt_status.text = "Start Search For Opponent"
  stage.addChild(txt_status)
  stage.update()
}
//init all events (document and socket)
function init() {
  socket = io() //connect to server
  //add key event listener
  document.addEventListener("keydown", keyDown, false)
  document.addEventListener("keyup", keyUp, false)
  //start button
  $("#startButton").click(function() {
    //tell server that somebody connected
    if ($("#nameInput").val() != "") {
      myName = $("#nameInput").val()
      socket.emit('join', $("#nameInput").val())
      $("#nameView").text("Name: " + $("#nameInput").val())
      $("#nameInput").remove()
      $("#startButton").remove()
    }
  })
  //joinRes returns gameObject data
  socket.on('joinRes', function(data) {
    initStage(data) //init stage objects
    showSearchButton()
  })
  //draw objects (players, ball and score
  socket.on('drawGame', function(data) {
    //server will send these in interval based on server tick
    rect_player1.x = data.player1.x
    rect_player1.y = data.player1.y
    rect_player2.x = data.player2.x
    rect_player2.y = data.player2.y
    rect_ball.x = data.ball.x
    rect_ball.y = data.ball.y
    txt_score.text = data.name.player1 + " - " + data.score.player1 + " : " + data.score.player2 + " - " + data.name.player2
    console.log("Game updated")
    stage.update()
  })
  //draw counter
  socket.on('counter', function(data) {
    //check if counter object is on stage, else add it
    if (stage.getChildIndex(txt_counter) == -1)
      stage.addChild(txt_counter)
    //if counter data is not -1 (done code) draw new number else removeChild
    if (data == -1)
      stage.removeChild(txt_counter)
    else
      txt_counter.text = data
    stage.update(); //update stage
  })
  //draw goal animation
  socket.on('goal', function(data) {
    //TODO: play goal animation
  });
  //server tells if theres an opponent for u or u need to wait
  socket.on('searchRes', function(data) {
    //false = please wait, true = opponent found
    if (!data) {
      //remove button and show please wait text
      stage.removeChild(btn_search)
      txt_status.text = "Please Wait For Opponent..."
      stage.update()
    } else {
      //opponent found, show ready button
      console.log('Enemy found.')
      stage.removeChild(btn_search)
      stage.removeChild(txt_status)
      txt_status.text = "Press to ready"
      stage.addChild(btn_ready)
      stage.addChild(txt_status)
      stage.update()
    }
  })
  //u are ready, so server tells if your opponent is ready too
  socket.on('readyRes', function(data) {
    //false = please wait, true = opponent found
    if (data == false) {
      //show please wait label
      stage.removeChild(btn_ready)
      txt_status.text = "Please Wait Till Opponent is ready..."
      stage.update()
    } else {
      //both players are ready, so draw basic start positions
      //server will overwrite this within few milliseconds via drawGame event
      console.log('Game start now.')
      stage.removeChild(btn_ready)
      stage.removeChild(txt_status)
      stage.addChild(rect_player1)
      stage.addChild(rect_player2)
      stage.addChild(rect_ball)
      stage.addChild(txt_score)
      stage.update()
    }
  })
  socket.on('done', function(data) {
    socket.emit('doneRes', true)
    stage.removeAllChildren()
    stage.update()
    showSearchButton()
  })
}
//on key down tell server whether u pressed up or down
function keyDown(e) {
  if (e.keyCode == 38 || e.keyCode == 40) //up = 38, down = 40
    socket.emit('keyDown', e.keyCode)
}
//on key up tell server stop move his player
function keyUp(e) {
  if (e.keyCode == 38 || e.keyCode == 40) //up = 38, down = 40
    socket.emit('keyUp', e.keyCode)
}
