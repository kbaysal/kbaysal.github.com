var accelerometer;
var ignore;
var score;

function init(){
	accelerometer = new Accelerometer();
    accelerometer.startListening();  

    newGame();

    setInterval(function() {
    	$("#score").text("Score: "+score);
    	score--;
		score = Math.max(0, score);
    }.bind(this), 1000);

    setInterval(function() {
        updateTable();
    }.bind(this), 100);
}

function round(x){
	return parseInt(x*100)/100;
}

function newGame(){  
	score = 100;
	randomize();
}

function randomize(key){
	if(key === "button"){
		score -= 20;
		score = Math.max(0, score);
	}

	ignore= Math.floor(Math.random()*3);

	$(".difference").css("background-color", $("body").css("background-color"));
	if(ignore == 0){
		$("#x .difference").css("background-color", "gray");
	} else if(ignore == 1){
		$("#y .difference").css("background-color", "gray");
	} else if(ignore == 2){
		$("#z .difference").css("background-color", "gray");
	}

	$("#x .target").text(round((Math.random()*20)-10));
	$("#y .target").text(round((Math.random()*20)-10));
	$("#z .target").text(round((Math.random()*20)-10));
}

function won(){
	var color = $("body").css("background-color");
	$("body").css("background-color", "green");
	setTimeout(function(){
		$("body").css("background-color", color)
	}.bind(this), 1000);
	score+=100;
	randomize();
}

function updateTable(){
	var successCount = 0;

	$("#x .observed").text(round(accelerometer.getLast().x));
	$("#y .observed").text(round(accelerometer.getLast().y));
	$("#z .observed").text(round(accelerometer.getLast().z));

	var xdiff = round($("#x .target").html() - $("#x .observed").html());
	var ydiff = round($("#y .target").html() - $("#y .observed").html())
	var zdiff = round($("#z .target").html() - $("#z .observed").html())

	$("#x .difference").text(xdiff);
	$("#y .difference").text(ydiff);
	$("#z .difference").text(zdiff);

	xdiff = Math.abs(xdiff);
	ydiff = Math.abs(ydiff);
	zdiff = Math.abs(zdiff);

	if(ignore!=0)
	{
		if(xdiff < 0.5){
			successCount++;
			$("#x .difference").css("background-color", "green");
		} else if(xdiff < 1){
			$("#x .difference").css("background-color", "yellow");
		} else if(xdiff < 3){
			$("#x .difference").css("background-color", "orange");
		} else {
			$("#x .difference").css("background-color", "red");
		}
	}

	if(ignore != 1)
	{
		if(ydiff < 0.5){
			successCount++;
			$("#y .difference").css("background-color", "green");
		} else if(ydiff < 1){
			$("#y .difference").css("background-color", "yellow");
		} else if(ydiff < 3){
			$("#y .difference").css("background-color", "orange");
		} else {
			$("#y .difference").css("background-color", "red");
		}
	}

	if(ignore != 2)
	{
		if(zdiff < 0.5){
			successCount++;
			$("#z .difference").css("background-color", "green");
		} else if(zdiff < 1){
			$("#z .difference").css("background-color", "yellow");
		} else if(zdiff < 3){
			$("#z .difference").css("background-color", "orange");
		} else {
			$("#z .difference").css("background-color", "red");
		}
	}

	if(successCount == 2){
		won();
	}
}

init();