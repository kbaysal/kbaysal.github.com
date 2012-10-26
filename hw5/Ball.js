
var Square = function(config){
    this.style = config.style || '';
    this.size = config.size;

    this.x = config.x;
    this.y = config.y;

    this.maxSize = config.maxSize;
    this.minSize = config.minSize;
}

Square.prototype.update = function(timeDiff) {

}

Square.prototype.draw = function(scaledPage){
    scaledPage.fillRect(this.x-this.size/2, this.y-this.size/2, this.size, this.size, 'blue');
}

