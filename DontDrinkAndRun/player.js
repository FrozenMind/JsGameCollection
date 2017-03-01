function Player(x, g, js, imgUrl){
  this.gravity = g;
  this.jumpSpeed = js;
  this.img = new Image();
  this.img.src = imgUrl;
  //animation hinzufügern
  this.data = {
    framerate: 10,
    images : [this.img],
    frames: {width: 50, height: 60, regX:0, regY: 0},
    animations: {	'walk': [0,8],
            'jump': [5]
          }
  };//end of data
  this.spritesheet = new createjs.SpriteSheet(this.data);
  this.animation = new createjs.Sprite(this.spritesheet);
  this.animation.x = x;
  this.animation.y = stage.canvas.height - 60;  //TODO: this.img.height
  this.animation.gotoAndPlay('walk');

}

Player.prototype.jump = function(){

}

Player.prototype.update = function(){

}
