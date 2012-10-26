
var Ball = function(config){
    this.style = config.style || 'blue';
    this.radius = config.radius;

    this.damping = config.damping || 1.5;

    this.x = config.x;
    this.y = config.y;
    
    this.velx = 0;
    this.vely = 0;

    this.maxX = config.maxX;
    this.maxY = config.maxY;

}

Ball.prototype.update = function(timeDiff) {
    this.x += this.velx*timeDiff/20;
    this.y += this.vely*timeDiff/20;
    
    if (this.x-this.radius <= 0 ||  this.x+this.radius>=this.maxX ) {
        this.velx *= -1*this.damping;
    }

    if(this.y-this.radius<=0 || this.y+this.radius>=this.maxY){
        this.vely *= -1*this.damping;
    }
}

Ball.prototype.draw = function(scaledPage){
    scaledPage.fillCircle(this.x, this.y, this.radius, this.style);
}

