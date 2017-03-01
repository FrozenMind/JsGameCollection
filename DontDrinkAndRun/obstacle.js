function Obstacle(image){
  this.image = new createjs.Bitmap(image);
  this.image.x = stage.canvas.width;
  this.image.y = stage.canvas.height - this.image.getBounds().height;
}
