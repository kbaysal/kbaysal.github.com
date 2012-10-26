var MultiTouchApp = function(){
    this.setup();
    window.util.deltaTimeRequestAnimationFrame(this.draw.bind(this));
}

//==============================================
//SETUP
//==============================================

MultiTouchApp.prototype.setup = function(){
    window.util.patchRequestAnimationFrame();
    window.util.patchFnBind();
    this.initCanvas();
    //TouchHandler.init(this);
    this.initSquare();
}

MultiTouchApp.prototype.initCanvas = function(){
    this.body = $(document.body);
    this.body.width(document.body.offsetWidth);
    this.body.height(window.innerHeight - 20);
    this.width = 320;
    this.height = 480;
    this.canvas = window.util.makeAspectRatioCanvas(this.body, this.width/this.height);
    this.page = new ScaledPage(this.canvas, this.width);
};

MultiTouchApp.prototype.initSquare = function(){
    this.square = new Square({'x': this.width/2, 'y': this.height/2,
                            'size': Math.min(this.canvas.width()/2, this.canvas.height()/2),
                            'maxSize': Math.min(this.canvas.width(), this.canvas.height()), 'minSize': 5});
}

//==============================================
//DRAWING
//==============================================

MultiTouchApp.prototype.draw = function(timeDiff){
    this.clearPage();
    this.drawSquare(timeDiff);
    TouchHandler.drawBalls(timeDiff);
    //this.updateSquare();
}

MultiTouchApp.prototype.clearPage = function(){
    this.page.fillRect(0, 0, this.width, this.height, '#eee');
}

MultiTouchApp.prototype.drawSquare = function(timeDiff){
    //this.square.update(timeDiff);
    this.square.draw(this.page);
}

MultiTouchApp.prototype.updateSquare = function(){
}
