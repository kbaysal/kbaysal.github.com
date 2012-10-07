// Kiraz Baysal (kbaysal)
// Jason MacDonald (jcmacdon)
// Maddie Horowitz (mhorowit)

var game = new Game();

function Game() {
    this.level = 1;
    this.lives = 5;
    this.money = 100;
    this.time = 0;
    this.start = false;
    this.help = true;

    this.towerArray = [];
    this.monsterArray = [];
    this.monsterLife = 100;
    this.monsterSpeed = 10;
    this.maxMonsters = 20;
    this.monsterCount = 0;

    this.monstersPerLevel = 5;
    this.addMonsterRate = 5000;
    this.addMonsterIntervalId = null;
    this.towerSelected = null;
    this.intervalIds = [];

    this.backgroundColor = "rgb(29, 51, 65)";
    this.foregroundColor = "white";

    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
}

Game.prototype.reset = function() {
    this.level = 1;
    this.lives = 5;
    this.money = 100;
    this.time = 0;
    this.start = false;
    this.help = true;

    this.towerArray = [];
    this.monsterArray = [];
    this.monsterLife = 100;
    this.monsterSpeed = 10;
    this.maxMonsters = 20;
    this.monsterCount = 0;

    this.monstersPerLevel = 5;
    this.addMonsterRate = 5000;
    this.addMonsterIntervalId = null;
    this.towerSelected = null;
    this.intervalIds = [];

    this.tower = this.towerTypes[0];
}

Game.prototype.distance = function(x1, y1, x2, y2) {
    var x = x1 - x2;
    var y = y1 - y2;

    return Math.sqrt((x * x) + (y * y));
}

Game.prototype.createButton = function(bx, by, w, h, text) {
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = this.foregroundColor;
    this.ctx.fillRect(bx, by, w, h);
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillText(text, bx+w/2, by+h/2);
}

Game.prototype.drawSidebar = function() {
    // background
    var margin = 10;
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(600, 0, 200, 600);
    // title
    this.ctx.font = "900 24px Arial";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = this.foregroundColor;
    this.ctx.fillText("KINGDOM", 600+margin, 5);
    this.ctx.textAlign = "right";

    this.ctx.fillText("DEFENSE", 800-margin, 30);

    // draw game info
    var ytop = 70;
    var yoffset = 20;
    this.ctx.font = yoffset + "px Arial";
    yoffset+=3;
    this.ctx.textAlign = "left";
    this.ctx.fillText("Level: " + this.level , 620, ytop);
    ytop+=yoffset;
    this.ctx.fillText("Lives: " + this.lives , 620, ytop);
    ytop+=yoffset;
    this.ctx.fillText("Money: " + this.money , 620, ytop);
    ytop+=yoffset;
    this.ctx.fillText("Time: " + this.time , 620, ytop);
    ytop+=2*yoffset;
    this.ctx.strokeStyle = this.foregroundColor;
    this.ctx.beginPath();
    this.ctx.lineTo(600, 170);
    this.ctx.lineTo(800, 170);
    this.ctx.closePath();
    this.ctx.stroke();
    ytop+=2*yoffset;

    this.ctx.strokeStyle = "black";
    this.ctx.beginPath();
    this.ctx.lineTo(600, 0);
    this.ctx.lineTo(600, 600);
    this.ctx.closePath();
    this.ctx.stroke();
        
    this.ctx.font = "20px Arial";
    if (!this.start) {
        this.createButton(600+margin, 600-margin-40, 200/2-2*margin, 40, "Go!");
    }
    this.createButton(700+margin, 600-margin-40, 200/2-2*margin, 40, "Help");
}

Game.prototype.drawBuild = function(){
    var margin = 10;
    var ytop = 170;
    var ymargin = 25;
    this.ctx.font = "25px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = this.foregroundColor;
    // draw tower info
    if (this.towerSelected !== null) {
        this.ctx.fillText("Tower Info", 700, ytop);
        ytop+=25;
        this.ctx.font = "20px Arial";
        this.ctx.textAlign = "left";
        this.ctx.fillText("Upgrade Level: " + this.towerSelected.upgrade_level , 620, ytop);
        this.ctx.fillText("Speed: " + this.towerSelected.speed , 620, ytop+ymargin);
        this.ctx.fillText("Range: " + this.towerSelected.range , 620, ytop+2*ymargin);
        this.ctx.fillText("Damage: " + this.towerSelected.damage , 620, ytop+3*ymargin);
        this.ctx.fillText("Price: " + this.towerSelected.price , 620, ytop+4*ymargin);

        this.sellButton = ytop+5*ymargin;
        this.createButton(600+margin, this.sellButton, 200-2*margin, 40, "Sell for " + (this.towerSelected.price/2));
        if (this.towerSelected.upgrade_level < 4) {
            this.upgradeButton = ytop+7*ymargin;
            this.createButton(600+margin, this.upgradeButton, 200-2*margin, 40, "Upgrade for " + (this.towerSelected.upgradePrice));
            if(this.towerSelected.upgradePrice > this.money){
                this.ctx.fillStyle = "rgba(50, 92, 116, .85)";;
                this.ctx.fillRect(600+margin, this.upgradeButton, 200-2*margin, 40);
            }
        }
    } else {
        ytop += 10;
        this.ctx.font = "900 20px Arial";
        this.ctx.fillText("TOWERS", 700, ytop);
        ytop += 40;
        this.towerTypes.forEach(function(towerType){
            this.ctx.font = "20px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = this.foregroundColor;
            this.ctx.fillText(towerType.title, 700, ytop);
            this.ctx.textAlign = "left";
            this.ctx.font = "16px Arial";
            this.ctx.fillText("Damage: " + towerType.damage, 610, ytop+ymargin);

            if(towerType.slowDown === undefined){
                towerType.slowDown = 0;
            }

            this.ctx.fillText("Slow down: " + towerType.slowDown, 610, ytop+2*ymargin);
            this.ctx.fillText("Price: " + towerType.price, 610, ytop+3*ymargin);
            this.createButton(660, ytop+4*ymargin, 80, 30, "select");
            if(towerType.price > this.money){
                this.ctx.fillStyle = "rgba(50, 92, 116, .85)";;
                this.ctx.fillRect(660, ytop+4*ymargin, 80, 30);
            } else if(towerType === this.tower){
                this.ctx.strokeStyle = "red";
                this.ctx.lineWidth = 4;
                this.ctx.strokeRect(660, ytop+4*ymargin, 80, 30);
                this.createButton(660, ytop+4*ymargin, 80, 30, "selected");
                this.ctx.lineWidth = 1;
            }
            ytop += 165;
        }.bind(this));
    }
}


Game.prototype.drawStart = function(){
    var margin = 10;
    var ytop = 270;
    var ymargin = 25;
    this.ctx.font = "900 20px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = this.foregroundColor;
    var center = 700;

    if (this.lives <= 0) {
        this.ctx.fillText("YOU DIED!!", center, ytop+2*ymargin);
        this.ctx.font = "18px Arial";
        this.ctx.fillText("Press 'Restart'", center, ytop+3.5*ymargin);
        this.ctx.fillText("to play again", center, ytop+4.25*ymargin);
        this.createButton(600+margin, 600-margin-40, 200/2-2*margin, 40, "Restart");
        // Stop all current game activity
        this.intervalIds.forEach(function(intervalId) {
            clearInterval(intervalId);
        });
    } else {
        this.ctx.fillText("GHOSTS", center, ytop+ymargin);
        this.ctx.fillText("ARE ATTACKING", center, ytop+2*ymargin);
        this.ctx.fillText("YOUR", center, ytop+3*ymargin);
        this.ctx.fillText("ICE KINGDOM!!", center, ytop+4*ymargin);
    }
}

Game.prototype.drawHelp = function() {
    var margin = 50;
    var padding = 10;
    var top;
    var w = 800;
    var h = 600;

    this.ctx.fillStyle="rgba(0,0,0, 0.8)";
    this.ctx.fillRect(0, 0, w, 600);

    this.ctx.fillStyle="rgb(29,51,65)";
    this.ctx.fillRect(margin, margin, w - 2*margin, h - 2*margin);

    game.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.arc(w-margin-5, margin+5, 15, 0, 2*Math.PI, true);
    game.ctx.fill();
    game.ctx.closePath();

    game.ctx.beginPath();
    game.ctx.strokeStyle = "black";
    game.ctx.lineWidth = 3;
    game.ctx.lineTo(w-margin-13, margin-3);
    game.ctx.lineTo(w-margin+3, margin+13);
    game.ctx.stroke();
    game.ctx.closePath();

    game.ctx.beginPath();
    game.ctx.strokeStyle = "black";
    game.ctx.lineTo(w-margin+3, margin-3);
    game.ctx.lineTo(w-margin-13, margin+13);
    game.ctx.stroke();
    game.ctx.closePath();

    game.ctx.lineWidth = 1;

    this.ctx.font = "900 40px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = this.foregroundColor;
    this.ctx.fillText("KINGDOM DEFENSE", w/2, margin+10);
    top = margin+10+40+10;

    this.ctx.font = "20px Arial";
    this.ctx.fillText("Protect your Ice Kingdom from the ghosts", w/2, top);
    top+=margin;

    this.ctx.font = "18px Arial";
    this.ctx.textAlign = "left";

    var instructions = [
        "How to play:",
        " -  Build towers to attack or slow down ghosts",
        " -  Every ghost you kill earns you money to build or upgrade towers",
        " -  Before the game starts and between levels you are in 'Build' mode",
        "      -  This is the only time you can build/upgrade towers",
        "      -  After setting your towers, press 'Go!' to send the next level of ghosts",
        " -  Each level has " + this.monstersPerLevel + " ghosts; you start with " + this.lives + " lives",
        " -  When you die, press 'Restart' for a new game",
        "",
        "We hope you enjoy our game :)"
    ];

    instructions.forEach(function(instruction) {
        this.ctx.fillText(instruction, margin + padding, top);
        top += margin / 2;
    }.bind(this));

    this.ctx.textAlign = "right";
    this.ctx.font = "10px Arial";
    this.ctx.textBaseline = "bottom";
    this.ctx.fillText("made by Jason Macdonald, Kiraz Baysal and Maddie Horowitz", w-margin-5, h-margin-5);

}

Game.prototype.drawBackground = function() {
    this.ctx.fillStyle="rgb(80,110,120)";
    this.ctx.fillRect(0,0,600,600);
}

Game.prototype.drawRoad = function() {
    var margin = 10;
    var gameWidth = this.canvas.width;
    var gameHeight = this.canvas.height;
    var grid = 100;
    this.ctx.beginPath();
    this.ctx.moveTo(margin,margin);
    this.ctx.lineTo(margin,this.canvas.height-margin);
    this.ctx.lineTo(3*grid-margin,this.canvas.height-margin);
    this.ctx.lineTo(3*grid-margin,grid-margin);
    this.ctx.lineTo(4*grid+margin,grid-margin);
    this.ctx.lineTo(4*grid+margin,this.canvas.height-margin);
    this.ctx.lineTo(gameWidth,gameHeight-margin);
    this.ctx.lineTo(gameWidth,5*grid+margin);
    this.ctx.lineTo(5*grid-margin,5*grid+margin);
    this.ctx.lineTo(5*grid-margin,margin);
    this.ctx.lineTo(2*grid+margin,margin);
    this.ctx.lineTo(2*grid+margin,5*grid+margin);
    this.ctx.lineTo(grid-margin,5*grid+margin);
    this.ctx.lineTo(grid-margin,margin)
    this.ctx.fillStyle = "lightblue";
    this.ctx.fill();
    this.ctx.closePath();
        
    this.ctx.strokeStyle = "black";

    // yellow brick road
    for (var i = 1; i <= (gameHeight - 2*margin)/margin; i++) {
        if (i % 2 === 0) {
            this.ctx.strokeRect(margin, i*margin, 20, 10);
            this.ctx.strokeRect(margin+20, i*margin, 20, 10);
            this.ctx.strokeRect(margin+40, i*margin, 20, 10);
            this.ctx.strokeRect(margin+60, i*margin, 20, 10);

            this.ctx.strokeRect(2*grid+margin, i*margin, 20, 10);
            this.ctx.strokeRect(2*grid+margin+20, i*margin, 20, 10);
            this.ctx.strokeRect(2*grid+margin+40, i*margin, 20, 10);
            this.ctx.strokeRect(2*grid+margin+60, i*margin, 20, 10);

            this.ctx.strokeRect(4*grid+margin, i*margin, 20, 10);
            this.ctx.strokeRect(4*grid+margin+20, i*margin, 20, 10);
            this.ctx.strokeRect(4*grid+margin+40, i*margin, 20, 10);
            this.ctx.strokeRect(4*grid+margin+60, i*margin, 20, 10);
        } else {
            this.ctx.strokeRect(margin, i*margin, 5, 10);
            this.ctx.strokeRect(margin+5, i*margin, 20, 10);
            this.ctx.strokeRect(margin+25, i*margin, 20, 10);
            this.ctx.strokeRect(margin+45, i*margin, 20, 10);
            this.ctx.strokeRect(margin+65, i*margin, 15, 10);

            this.ctx.strokeRect(2*grid+margin, i*margin, 5, 10);
            this.ctx.strokeRect(2*grid+margin+5, i*margin, 20, 10);
            this.ctx.strokeRect(2*grid+margin+25, i*margin, 20, 10);
            this.ctx.strokeRect(2*grid+margin+45, i*margin, 20, 10);
            this.ctx.strokeRect(2*grid+margin+65, i*margin, 15, 10);

            this.ctx.strokeRect(4*grid+margin, i*margin, 5, 10);
            this.ctx.strokeRect(4*grid+margin+5, i*margin, 20, 10);
            this.ctx.strokeRect(4*grid+margin+25, i*margin, 20, 10);
            this.ctx.strokeRect(4*grid+margin+45, i*margin, 20, 10);
            this.ctx.strokeRect(4*grid+margin+65, i*margin, 15, 10);
        }
    }

    for (var i = 0; i<(grid+2*margin)/margin; i++) {
        if (i % 2 === 0) {
            this.ctx.strokeRect(grid-margin+(i*margin), 5*grid+margin, margin, 20);
            this.ctx.strokeRect(grid-margin+i*margin, 5*grid+margin+20, margin, 20);
            this.ctx.strokeRect(grid-margin+i*margin, 5*grid+margin+40, margin, 20);
            this.ctx.strokeRect(grid-margin+i*margin, 5*grid+margin+60, margin, 20);

            this.ctx.strokeRect(3*grid-margin+(i*margin), margin, margin, 20);
            this.ctx.strokeRect(3*grid-margin+i*margin, margin+20, margin, 20);
            this.ctx.strokeRect(3*grid-margin+i*margin, margin+40, margin, 20);
            this.ctx.strokeRect(3*grid-margin+i*margin, margin+60, margin, 20);

            this.ctx.strokeRect(5*grid-margin+(i*margin), 5*grid+margin, margin, 20);
            this.ctx.strokeRect(5*grid-margin+i*margin, 5*grid+margin+20, margin, 20);
            this.ctx.strokeRect(5*grid-margin+i*margin, 5*grid+margin+40, margin, 20);
            this.ctx.strokeRect(5*grid-margin+i*margin, 5*grid+margin+60, margin, 20);
        } else {
            this.ctx.strokeRect(grid-margin+(i*margin), 5*grid+margin, margin, 5);
            this.ctx.strokeRect(grid-margin+i*margin, 5*grid+margin+5, margin, 20);
            this.ctx.strokeRect(grid-margin+i*margin, 5*grid+margin+25, margin, 20);
            this.ctx.strokeRect(grid-margin+i*margin, 5*grid+margin+45, margin, 20);
            this.ctx.strokeRect(grid-margin+i*margin, 5*grid+margin+65, margin, 15);

            this.ctx.strokeRect(3*grid-margin+(i*margin), margin, margin, 5);
            this.ctx.strokeRect(3*grid-margin+i*margin, margin+5, margin, 20);
            this.ctx.strokeRect(3*grid-margin+i*margin, margin+25, margin, 20);
            this.ctx.strokeRect(3*grid-margin+i*margin, margin+45, margin, 20);
            this.ctx.strokeRect(3*grid-margin+i*margin, margin+65, margin, 15);

            this.ctx.strokeRect(5*grid-margin+(i*margin), 5*grid+margin, margin, 5);
            this.ctx.strokeRect(5*grid-margin+i*margin, 5*grid+margin+5, margin, 20);
            this.ctx.strokeRect(5*grid-margin+i*margin, 5*grid+margin+25, margin, 20);
            this.ctx.strokeRect(5*grid-margin+i*margin, 5*grid+margin+45, margin, 20);
            this.ctx.strokeRect(5*grid-margin+i*margin, 5*grid+margin+65, margin, 15);
        }
    }
}

Game.prototype.clickedOnTower = function(x, y){
    var clickedTower = null;
    this.towerArray.forEach(function(tower){
        if (x > (tower.x - tower.width/2) && x < tower.x + tower.width/2 &&
            y > tower.y - tower.height/2 && y < tower.y + tower.height/2){
            clickedTower = tower;
        }
    });
    return clickedTower;
}

Game.prototype.towerOverlap = function(tower1, tower2) {
    t1left = tower1.x - tower1.width/2;
    t1right = tower1.x + tower1.width/2;
    t1top = tower1.y - tower1.height/2;
    t1bottom = tower1.y + tower1.height/2;

    t2left = tower2.x - tower2.width/2;
    t2right = tower2.x + tower2.width/2;
    t2top = tower2.y - tower2.height/2;
    t2bottom = tower2.y + tower2.height/2;

    // from left
    if (t1left <= t2right && t1right >= t2right) {
        // from top
        if (t1bottom >= t2top && t1top <= t2top) {
            return true;
        } 
        // from bottom
        else if (t1top <= t2bottom && t1bottom >= t2bottom) {
            return true;
        }
    }
    // from right
    else if (t1right >= t2left && t1left <= t2left){
        // from top
        if(t1bottom >= t2top && t1top <= t2top){
            return true;
        } 
        // from bottom
        else if (t1top <= t2bottom && t1bottom >= t2bottom) {
            return true;
        }
    }

    return false;
}

Game.prototype.pathOverlap = function(tower) {
    var grid = 100; 
    var margin = 10;

    t1left = tower.x - tower.width/2;
    t1right = tower.x + tower.width/2;
    t1top = tower.y - tower.height/2;
    t1bottom = tower.y + tower.height/2;

    if (t1left < grid - margin) {
        return true;
    } else if (t1right > 2 * grid + margin && t1left < 3 * grid - margin) {
        return true;
    } else if (t1right > 4 * grid + margin && t1left < 5 * grid - margin) {
        return true;
    }

    if (t1left > grid - margin && t1right < 2 * grid + margin){
        if (t1bottom > 5 * grid + margin){
            return true;
        }
    } else if (t1left > 3 * grid - margin && t1right < 4 * grid + margin) {
        if (t1top < grid - margin) {
            return true;
        }
    } else if (t1left > 5 * grid - margin) {
        if (t1bottom > 5 * grid + margin){
            return true;
        }  
    }

    return false;
}

Game.prototype.createTower = function(x, y, towerType) {
    var overlap = false;

    var basicTower = new towerType();
    basicTower.x = x;
    basicTower.y = y;

    this.towerArray.forEach(function(tower) {
        if (overlap !== true) {
            overlap = game.towerOverlap(basicTower, tower);
        }
    });

    if (overlap !== true) {
        overlap = this.pathOverlap(basicTower);
    }

    if (overlap === false) {
        basicTower.attackIntervalId = setInterval(function() {
            basicTower.shootMonsters();
        }, 1000 * (1000 / basicTower.speed));
        this.intervalIds.push(basicTower.attackIntervalId);
        if (this.money >= basicTower.price) {
            this.towerArray.push(basicTower);
            this.money -= basicTower.price;
        }
    }   
}

Game.prototype.onMouseDown = function(event) {
    var x = event.pageX - this.canvas.offsetLeft;  // do not use event.x, it's not cross-browser!!!
    var y = event.pageY - this.canvas.offsetTop;

    if (this.help === true) {
        if(this.distance(x, y, 800-50-5, 50+5) <= 15) {
            this.help = false;
        }
    } else {
        //on game board?
        if (x < 600 && this.start === false) {
            var tower = this.clickedOnTower(x, y);

            if (tower !== null && tower !== this.towerSelected) {
                this.towerSelected = tower;
            } else if (this.towerSelected !== null) {
                this.towerSelected = null;
            } else if(this.tower === undefined){
                this.createTower(x, y, BasicTower);
            } else {
                this.createTower(x, y, this.tower);
            }
        } else {
            // in sidebar
            if (this.towerSelected !== null) {
                if (y > this.sellButton && y < this.sellButton + 40) {
                    // sell
                    if (this.towerSelected.remove()) {
                        this.money += this.towerSelected.price / 2;
                        this.towerSelected = null;
                    }
                } else if (y > this.upgradeButton && y < this.upgradeButton + 40) {
                    this.towerSelected.upgrade();
                }
            } else {
                var ytop = 320;
                this.towerTypes.forEach(function(towerType) {
                    if(y > ytop && y < ytop+30) {
                        this.tower = towerType;
                    }
                    ytop += 165;
                }.bind(this));
            }

            if (y > this.canvas.height-50 && y < this.canvas.height - 10) {
                if (x > 600 + 10 && x < 700 - 10) {
                    this.towerSelected = null;
                    if (this.lives > 0) {
                        this.start = true;
                    } else {
                        this.reset();
                    }  
                } else if (x > 700 + 10 && x < 800 - 10) {
                    this.help = true;
                }
            } 
        }
    }
}

Game.prototype.redrawAll = function() {
    this.drawBackground();
    this.drawRoad();

    if(this.help === true){
        if (this.start !== true) {
            this.drawBuild();
        } else {
            this.drawStart();
        }
        this.drawHelp();
        return;
    } else {
        if (this.start === false && this.towerSelected !== null){
            this.ctx.globalAlpha = 0.5;
            this.ctx.fillStyle = "red";
            this.ctx.beginPath();
            this.ctx.arc(this.towerSelected.x, this.towerSelected.y, this.towerSelected.range, 0, 2*Math.PI, true);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }

        this.towerArray.forEach(function(tower){
            tower.drawPiece();
        }.bind(this));

        this.monsterArray.forEach(function(monster){
            monster.drawPiece();
        });
    }
        
    this.drawSidebar();

    if (this.start !== true) {
        this.drawBuild();
    } else {
        this.drawStart();
    }
}

Game.prototype.addMonster = function() {
    if (this.start === true && this.monsterArray.length < this.maxMonsters) {
        if (this.monsterCount < this.monstersPerLevel) {
            this.monsterCount++;
            var monster = new Monster(this.monsterLife , this.monsterSpeed);
            this.monsterArray.push(monster);
            monster.moveIntervalId = setInterval(function() {
                monster.move();
            }, monster.speed);
            this.intervalIds.push(monster.moveIntervalId);
        }
    }
}

Game.prototype.checkLevel = function() {
    // If all the monsters for this level have been sent and killed or made it to the finish,
    // increase the level
    if (this.monsterCount === this.monstersPerLevel && this.monsterArray.length === 0) {
        this.increaseLevel();
    }
}

Game.prototype.increaseLevel = function() {
    this.level++;
    this.start = false;
    this.monsterLife += 20;
    this.monsterSpeed = Math.max(4, this.monsterSpeed * 0.85);
    this.monsterCount = 0;
    this.addMonsterRate = Math.max(1500, this.addMonsterRate * 0.9);

    clearInterval(this.addMonsterIntervalId);
    this.addMonsterIntervalId = setInterval(function() {
        this.addMonster();
    }.bind(this), this.addMonsterRate);
}

Game.prototype.run = function() {
    this.canvas.addEventListener('mousedown', function(event) {
        this.onMouseDown(event);
    }.bind(this), false);
    
    setInterval(function() {
        this.redrawAll();
    }.bind(this), 10);
    
    this.addMonsterIntervalId = setInterval(function() {
        this.addMonster();
    }.bind(this), this.addMonsterRate);

    setInterval(function() {
        this.checkLevel();
    }.bind(this), 100);
}

game.run();