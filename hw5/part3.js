$(document).ready(function() {
	if(!window.localStorage["hw5taskCount"]){
		window.localStorage["hw5taskCount"] = 0;
	}
	for(var i = 0; i<window.localStorage["hw5taskCount"]; i++){
		if(window.localStorage["hw5task"+i] !== ""){
			$("#tasks").append('<div class="task" id="'+i+'">'
						  	  +'<h3>'+window.localStorage["hw5task"+i]+'</h3>'
						      +'<h4 class="delete" id="h4'+i+'">X</h4>'
						      +'</div>');
			addListener(i);
		}
	}
	document.onkeypress = stopRKey;
});

function addListener(id){
	$("#h4"+id).click(function() {
		var id = $(this).parent().attr("id");
	  	window.localStorage["hw5task" + id] = "";
	  	$(this).parent().attr("class", $(this).parent().attr("class") + " hidden");
	  	setTimeout(function(){
	  		console.log($("#"+id));
	  		console.log($("#"+id).attr("class"));
	  		$("#"+id).attr("class", $("#"+id).attr("class") + " deleted");
	  		
	  		console.log($("#"+id).attr("class"));
	  	}, 1000);
	});
}

function onSubmit(){
	var id = window.localStorage["hw5taskCount"];
	console.log(document.getElementById('taskInput').value);
	$("#tasks").append('<div class="task" id="'+id+'">'
					  +'<h3>'+document.getElementById('taskInput').value+'</h3>'
					  +'<h4 class="delete" id="h4'+id+'">X</h4>'
					  +'</div>');
	if (typeof(localStorage)!=="undefined") {
		window.localStorage["hw5task" + id] = document.getElementById('taskInput').value;
    	addListener(id);
		window.localStorage["hw5taskCount"]++;
    }
    document.getElementById('taskInput').value = "";

}

//below taken from: http://webcheatsheet.com/javascript/disable_enter_key.php
function stopRKey(evt) { 
    var evt = (evt) ? evt : ((event) ? event : null); 
    var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null); 
    if ((evt.keyCode == 13) 
    	&& (node.type=="text"))  { 
    	onSubmit(); 
    return false;
	} 
} 