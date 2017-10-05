function Snake() {
  this.color = "#ccc"; //white snake
  this.headColor = "#ff0000"; //head is read
  this.size = 20;
  this.rects = [];
  this.direction = 4; //1=up, 2=right, 3=down, 4=left
  this.speed = 15; //speed can be max fps count
  this.readyToMove = true
  this.startAmount = 7 //amout of elements in the start snake
}

Snake.prototype.loadDefaultSnake = function() {
  //head
  let tempRect = new createjs.Shape()
  tempRect.graphics.setStrokeStyle(1).beginStroke("#000")
  tempRect.graphics.beginFill(this.headColor).drawRect(0, 0, this.size, this.size);
  tempRect.x = stage.canvas.width / 2 - this.startAmount * this.size;
  tempRect.y = stage.canvas.height / 2;
  this.rects.push(tempRect);
  stage.addChild(tempRect);
  //tail
  for (let i = this.startAmount - 1; i > 0; i--) {
    let tempRect = new createjs.Shape()
    tempRect.graphics.setStrokeStyle(1).beginStroke("#000")
    tempRect.graphics.beginFill(this.color).drawRect(0, 0, this.size, this.size);
    tempRect.x = stage.canvas.width / 2 - i * this.size;
    tempRect.y = stage.canvas.height / 2;
    this.rects.push(tempRect);
    stage.addChild(tempRect);
  }
  this.direction = 4;
}

Snake.prototype.addRect = function() {
  let tempRect = new createjs.Shape()
  tempRect.graphics.setStrokeStyle(1).beginStroke("#000")
  tempRect.graphics.beginFill(this.color).drawRect(0, 0, this.size, this.size);
  // first set is out of bounds so that no flickr appears, move method will set it to the end
  tempRect.x = -this.size;
  tempRect.y = -this.size;
  this.rects.push(tempRect)
  stage.addChild(tempRect)
}

Snake.prototype.move = function() {
  //every rect should be set to the one before him
  for (i = this.rects.length - 1; i >= 1; i--) {
    this.rects[i].x = this.rects[i - 1].x;
    this.rects[i].y = this.rects[i - 1].y;
  }
  //rect 0 should get a new position
  switch (this.direction) {
    case 1: //up
      this.rects[0].y -= this.size;
      break;
    case 2: //right
      this.rects[0].x += this.size;
      break;
    case 3: //down
      this.rects[0].y += this.size;
      break;
    case 4: //left
      this.rects[0].x -= this.size;
      break;
  }
  this.readyToMove = true;
}

//calculate the speed by the size of the snake
Snake.prototype.calcSpeed = function() {
  if (this.speed > 3)
    this.speed = 15 - Math.floor(this.rects.length / 3)
}
