var counter;
var timer;
var watchId;

function init(){
	counter = 0;

	if(!navigator.geolocation){
		alert("this device not supported")
	}
	else{
		navigator.geolocation.getCurrentPosition(fillRow, error);
	}
}

function fillRow(position){
	$("tbody").append('<tr>'
					  +'<td>' + counter + '</td>'
                      +'<td>'+ position.coords.latitude + '</td>'
                      +'<td>'+ position.coords.longitude + '</td>'
                      +'<td>'+ position.coords.accuracy + '</td>'
                      +'<td>'+ position.coords.speed + '</td>'
                      +'<td>'+ position.coords.altitude + '</td>'
                      +'<td>'+ position.coords.altitudeAccuracy + '</td>'
					  +'</tr>');
	counter++;
}

function error(){
	alert("nah");
}

function toggle(button){
	if(button.innerHTML.indexOf("Start") > -1){
		watchId = navigator.geolocation.watchPosition(fillRow, error, {maximumAge: 250, timeout: 10000});
		button.innerHTML = "Stop watching position";
	} else{
		navigator.geolocation.clearWatch(watchId);
		button.innerHTML = "Start watching position";
	}
}

init();