function Piece() {
	this.x = 50;
	this.y = 50;
	this.width = 50;
	this.height = 70;
}

Piece.prototype.distance = function(a, b) {
	var x = b.x - a.x;
	var y = b.y - a.y;

	return Math.sqrt((x * x) + (y * y));
}

function Arrow(x, y, size, speed, color, monster, type) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.speed = speed;
	this.color = color;
	this.monster = monster;
	this.type = type;
}

Arrow.prototype = new Piece();
Arrow.prototype.constructor = Arrow;

Arrow.TYPE_LINE = 0;
Arrow.TYPE_CIRCLE = 1;

Arrow.prototype.drawPiece = function() {
	dx = this.monster.x - this.x;
	dy = this.monster.y - this.y;
	angle = Math.atan2(dx, dy);
	ex = Math.sin(angle);
	ey = Math.cos(angle);

	if (this.type === Arrow.TYPE_LINE) {
		game.ctx.beginPath();
		game.ctx.moveTo(this.x, this.y);
		game.ctx.lineTo(this.x + this.size * ex, this.y + this.size * ey);
		game.ctx.closePath();
		game.ctx.strokeStyle = this.color;
		game.ctx.stroke();
	} else if (this.type === Arrow.TYPE_CIRCLE) {
		game.ctx.beginPath();
		game.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, true);
		game.ctx.fillStyle = "rgb(0,90,150)";
		game.ctx.fill();
		game.ctx.closePath();
	}

	this.x += this.speed * ex;
	this.y += this.speed * ey;
}

function Monster(life, speed) {
	this.life = life;
	this.speed = speed;
	this.pathPoints = [
		{'x': 50, 'y': 550},
		{'x': 250, 'y': 550},
		{'x': 250, 'y': 50},
		{'x': 450, 'y': 50},
		{'x': 450, 'y': 550},
		{'x': 650, 'y': 550}
	]
	this.moveIntervalId = null;
	this.maxSpeed = speed;
	this.maxLife = life;
}

Monster.prototype = new Piece();
Monster.prototype.constructor = Monster;

Monster.prototype.move = function() {
	if(game.lives > 0) {
		// If monster has reached end of path, remove it
		if (this.pathPoints.length === 0) {
			if (this.remove()) {
				game.lives--;
			}
			return;
		}

		destinationPoint = this.pathPoints[0];
		dx = destinationPoint.x - this.x;
		dy = destinationPoint.y - this.y;
		angle = Math.atan2(dx, dy);

		this.x += Math.sin(angle);
		this.y += Math.cos(angle);

		// If monster has reached destination, move to next point
		if (this.distance(this, destinationPoint) === 0) {
			this.pathPoints.shift();
		}
	}
}

Monster.prototype.drawPiece = function() {
	game.ctx.beginPath();
	var cx = this.x;
	var cy = this.y;
	var radius = 30;
	var startAngle = 1 * Math.PI; // radians from x axis
	var endAngle = 0; // ditto
	var anticlockwise = false;
	var color = "0,0,0";
	var alpha = Math.max(this.life / this.maxLife, 0.3);
	if (this.speed !== this.maxSpeed) {
		color = "16,78,139";
	}
	game.ctx.fillStyle = "rgba(" + color + "," + alpha + ")";
	game.ctx.arc(cx, cy, radius, startAngle, endAngle, anticlockwise);
	game.ctx.fill();
	game.ctx.closePath();
	game.ctx.beginPath();
	game.ctx.lineTo(this.x-30, this.y);
	game.ctx.lineTo(this.x-30,this.y+25)
	game.ctx.lineTo(this.x-20,this.y+20);
	game.ctx.lineTo(this.x-10,this.y+25);
	game.ctx.lineTo(this.x,this.y+20);
	game.ctx.lineTo(this.x+10,this.y+25);
	game.ctx.lineTo(this.x+20,this.y+20);
	game.ctx.lineTo(this.x+30,this.y+25);
	game.ctx.lineTo(this.x+30,this.y);
	game.ctx.fill();
	game.ctx.closePath();
	game.ctx.beginPath();
	game.ctx.moveTo(this.x,this.y);
	game.ctx.arc(this.x,this.y-5, 16, 0, 2*Math.PI, true);
	game.ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
	game.ctx.fill();
	game.ctx.closePath();
	game.ctx.beginPath();
	game.ctx.moveTo(this.x,this.y);
	game.ctx.arc(this.x+3, this.y+3, 8, 0, 2*Math.PI, true);
	game.ctx.fillStyle = "rgba(0,181,250," + alpha + ")";
	game.ctx.fill();
	game.ctx.closePath();
}

Monster.prototype.takeDamage = function(damage) {
	this.life -= damage;
	// Remove this monster if it's life is <= 0
	if (this.life <= 0) {
		var index = game.monsterArray.indexOf(this);
		if (index >= 0) {
			if (this.remove()) {
				game.money += 10;
			}
		}
	}
}

Monster.prototype.slowBy = function(slowDown) {
	// Only slow monster if it hasn't reached a speed threshold
	if (this.speed < 50) {
		this.speed /= slowDown;
		clearInterval(this.moveIntervalId);
	   	this.moveIntervalId = setInterval(function() {
	    	this.move();
		}.bind(this), this.speed);
		game.intervalIds.push(this.moveIntervalId);
   }
}

Monster.prototype.remove = function() {
	var index = game.monsterArray.indexOf(this);
	if (index >= 0) {
		clearInterval(this.moveIntervalId);
		game.monsterArray.splice(index, 1);
		return true;
	}
	return false;
}


function Tower(speed, range, damage, price) {
	this.upgrade_level = 1;
	this.speed = speed;
	this.range = range;
	this.damage = damage;
	this.price = price;
	this.upgradePrice = price * 2;
	this.attackIntervalId = null;
	this.arrows = [];
}
Tower.prototype = new Piece();
Tower.prototype.constructor = Tower;

Tower.prototype.shootMonsters = function() {
	if (game.start === true) {
		for (var i = 0; i < game.monsterArray.length; i++) {
			var monster = game.monsterArray[i];
			if (this.distance(this, monster) <= this.range) {
				this.shootArrow(monster);
				break;
			}
		}
	}
}

Tower.prototype.remove = function() {
	var index = game.towerArray.indexOf(this);
	if (index >= 0) {
		clearInterval(this.attackIntervalId);
		game.towerArray.splice(index, 1);
		return true;
	}
	return false;
}

Tower.prototype.upgrade = function() {
	if ((game.money >= this.upgradePrice) && (this.upgrade_level < 4)) {
		this.price = this.upgradePrice;
		this.upgradePrice *= 2;  
	    this.range += Math.ceil(this.range / 2);
	    this.speed += Math.ceil(this.speed / 2);
	    this.damage *= 2;
	    this.upgrade_level++;
	    game.money -= this.price;
	}
}

Tower.prototype.drawPiece = function() {
	this.arrows.forEach(function(arrow) {
		arrow.drawPiece();
		// Check if arrow has hit its monster
		if (this.distance(arrow, arrow.monster) < 5) {
			var index = this.arrows.indexOf(arrow);
			if (index >= 0) {
				this.arrows.splice(index, 1);
				this.attack(arrow.monster);
			}
		}
	}.bind(this));
}

function BasicTower() {}
BasicTower.title = 'Basic Tower';
BasicTower.speed = 1000;
BasicTower.range = 120;
BasicTower.damage = 10;
BasicTower.price = 20;
BasicTower.prototype = new Tower(BasicTower.speed, BasicTower.range, BasicTower.damage, BasicTower.price);
BasicTower.prototype.constructor = BasicTower;

BasicTower.prototype.shootArrow = function(monster) {
	this.arrows.push(new Arrow(this.x, this.y, 15, 2.5, 'white', monster, Arrow.TYPE_LINE));
}

BasicTower.prototype.attack = function(monster) {
	monster.takeDamage(this.damage);
}

BasicTower.prototype.drawPiece = function() {
	Tower.prototype.drawPiece.call(this);
	game.ctx.beginPath();
	game.ctx.moveTo(this.x+3*this.width/10, this.y+this.height/2);
	game.ctx.lineTo(this.x-3*this.width/10, this.y+this.height/2);
	game.ctx.lineTo(this.x-3*this.width/10, this.y-2*this.height/14);
	game.ctx.lineTo(this.x-this.width/2,this.y-2*this.height/14);
	game.ctx.lineTo(this.x-this.width/2,this.y-this.height/2);
	game.ctx.lineTo(this.x-3*this.width/10,this.y-this.height/2);
	game.ctx.lineTo(this.x-3*this.width/10,this.y-5*this.height/14);
	game.ctx.lineTo(this.x-this.width/10,this.y-5*this.height/14);
	game.ctx.lineTo(this.x-this.width/10,this.y-this.height/2);
	game.ctx.lineTo(this.x+this.width/10,this.y-this.height/2);
	game.ctx.lineTo(this.x+this.width/10,this.y-5*this.height/14);
	game.ctx.lineTo(this.x+3*this.width/10,this.y-5*this.height/14);
	game.ctx.lineTo(this.x+3*this.width/10,this.y-this.height/2);
	game.ctx.lineTo(this.x+this.width/2,this.y-this.height/2);
	game.ctx.lineTo(this.x+this.width/2,this.y-2*this.height/14);
	game.ctx.lineTo(this.x+3*this.width/10,this.y-2*this.height/14);
	game.ctx.lineTo(this.x+3*this.width/10,this.y+this.height/2);
	game.ctx.closePath();
	game.ctx.fillStyle = "rgb(30, 30, 30)";
	game.ctx.fill();

	for (var i = 1; i < this.upgrade_level; i++) {
		game.ctx.beginPath();
		game.ctx.arc(this.x, this.y + 10 * (i - 1), 3, 0, 2 * Math.PI, true);
		game.ctx.fillStyle = "yellow";
		game.ctx.fill();
		game.ctx.closePath();
	}
}


function SlowTower() {}
SlowTower.title = 'Slow-Down Tower';
SlowTower.speed = 500;
SlowTower.range = 120;
SlowTower.damage = 0;
SlowTower.price = 40;
SlowTower.slowDown = 0.7;
SlowTower.prototype = new Tower(SlowTower.speed, SlowTower.range, SlowTower.damage, SlowTower.price);
SlowTower.prototype.constructor = SlowTower;
SlowTower.prototype.slowDown = SlowTower.slowDown;


SlowTower.prototype.shootArrow = function(monster) {
	this.arrows.push(new Arrow(this.x, this.y, 5, 2.5, 'blue', monster, Arrow.TYPE_CIRCLE));
}

SlowTower.prototype.attack = function(monster) {
	monster.slowBy(this.slowDown);
}

SlowTower.prototype.drawPiece = function() {
	Tower.prototype.drawPiece.call(this);
	game.ctx.beginPath();
	game.ctx.moveTo(this.x+3*this.width/10, this.y+this.height/2);
	game.ctx.lineTo(this.x-3*this.width/10, this.y+this.height/2);
	game.ctx.lineTo(this.x-3*this.width/10, this.y-2*this.height/14);
	game.ctx.lineTo(this.x-this.width/2,this.y-2*this.height/14);
	game.ctx.lineTo(this.x-this.width/2,this.y-this.height/2);
	game.ctx.lineTo(this.x-3*this.width/10,this.y-this.height/2);
	game.ctx.lineTo(this.x-3*this.width/10,this.y-5*this.height/14);
	game.ctx.lineTo(this.x-this.width/10,this.y-5*this.height/14);
	game.ctx.lineTo(this.x-this.width/10,this.y-this.height/2);
	game.ctx.lineTo(this.x+this.width/10,this.y-this.height/2);
	game.ctx.lineTo(this.x+this.width/10,this.y-5*this.height/14);
	game.ctx.lineTo(this.x+3*this.width/10,this.y-5*this.height/14);
	game.ctx.lineTo(this.x+3*this.width/10,this.y-this.height/2);
	game.ctx.lineTo(this.x+this.width/2,this.y-this.height/2);
	game.ctx.lineTo(this.x+this.width/2,this.y-2*this.height/14);
	game.ctx.lineTo(this.x+3*this.width/10,this.y-2*this.height/14);
	game.ctx.lineTo(this.x+3*this.width/10,this.y+this.height/2);
	game.ctx.closePath();
	game.ctx.fillStyle = "white";
	game.ctx.fill();

	for (var i = 1; i < this.upgrade_level; i++) {
		game.ctx.beginPath();
		game.ctx.arc(this.x, this.y + 10 * (i - 1), 3, 0, 2 * Math.PI, true);
		game.ctx.fillStyle = "red";
		game.ctx.fill();
		game.ctx.closePath();
	}
}

game.towerTypes = [BasicTower, SlowTower];
game.tower = game.towerTypes[0];