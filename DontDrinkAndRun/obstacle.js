function Obstacle(image) {
    this.image = new createjs.Bitmap(image);
    this.image.x = WIDTH;
    this.image.y = HEIGHT - this.image.getBounds().height;
}