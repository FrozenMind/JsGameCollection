function Snake() {
    this.color = "#000000";
    this.speed = 5;
    this.size = 15;
    this.rects = [];
    this.direction; //1=up, 2=right, 3=down, 4=left

    this.loadDefaultSnake = function() {
        this.rects.push(new createjs.Shape());
        this.rects[this.rects.length - 1].graphics.beginFill(this.color).drawRect(stage.canvas.width / 2 - 3 * this.size, stage.canvas.height / 2, this.size, this.size);
        console.log(stage.canvas.width);
        stage.addChild(this.rects[this.rects.length - 1]);
        this.rects.push(new createjs.Shape());
        this.rects[this.rects.length - 1].graphics.beginFill(this.color).drawRect(stage.canvas.width / 2 - 2 * this.size, stage.canvas.height / 2, this.size, this.size);
        stage.addChild(this.rects[this.rects.length - 1]);
        this.rects.push(new createjs.Shape());
        this.rects[this.rects.length - 1].graphics.beginFill(this.color).drawRect(stage.canvas.width / 2 - this.size, stage.canvas.height / 2, this.size, this.size);
        stage.addChild(this.rects[this.rects.length - 1]);
        this.direction = 4;
    };

    this.addRect = function(x, y) {
        this.rects.push(new createjs.Shape());
        this.rects[this.rects.length - 1].graphics.beginFill(this.color).drawRect(x, y, this.size, this.size);
        stage.addChild(this.rects[this.rects.length - 1]);
    };
}
