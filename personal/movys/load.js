function loadXMLDoc(id)
{
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    	document.getElementById("page").innerHTML=xmlhttp.responseText;
    }
  }
xmlhttp.open("GET",id+".html",true);
xmlhttp.send();
}

 var movieList = new Array();
  var movieListSorted = new Array();
  var friendCount = 0;
  function showMovies() {
    alert(movieList.length);
  }
  function compareMovies(movieA, movieB) {
    if (movieA.name === movieB.name) return 0;
    if (movieA.name > movieB.name) return 1;
    return -1;
  }
  function popularMovies(movieA, movieB) {
    return movieB.mCount - movieA.mCount;
  }
  function data_fetch_postproc() {
    document.getElementById('test').innerHTML  = "Generating recommendations ... ";
    movieList.sort(compareMovies);
    // Now we have sorted list, dedupe and count
    mCtr = 0;
    for (i = 0; i < movieList.length; i++)
    {
      var count = 0;
      movieListSorted[mCtr] = movieList[i];
      for ( j = i; j < movieList.length; j++)
      {
        if ( movieList[i].name === movieList[j].name ) {
          count++;
        } else {
          break;
        }
      }
      i = i+count-1;
      movieListSorted[mCtr++].mCount = count;
    }
    var maxResults = 100;
    if( movieListSorted.length < 100) {
      maxResults = movieListSorted.length;
    } 
    movieListSorted.sort(popularMovies);
    document.getElementById('test').innerHTML = "";
    for( i=0; i<maxResults; i++) {
      var newDiv = document.createElement("DIV");
      newDiv.id = movieListSorted[i].id;
      newDiv.innerHTML = movieListSorted[i].name  + ' <br/>-<br/> ' 
        + movieListSorted[i].mCount + ' of your friends liked this movie.<br/>';
      document.getElementById("results").appendChild(newDiv);
      FB.api('/'+movieListSorted[i].id, function(response) {
        var newDiv = document.createElement("DIV");
        newDiv.innerHTML = "<span><img src='"+response.picture+"?type=square' id='movieposter'>"
          + "</img><br/>";
		newDiv.innerHTML+="</span>";
        document.getElementById(response.id).appendChild(newDiv);
      });
    }
  }
  function get_friend_likes() {
	  document.getElementById("results").innerHTML = "";
    document.getElementById('test').innerHTML = "Requesting "
      + "data from Facebook ... ";
    FB.api('/me/friends', function(response) {
        friendCount = response.data.length;
        for( i=0; i<response.data.length; i++) {
          friendId = response.data[i].id;
          FB.api('/'+friendId+'/movies', function(response) {
            movieList = movieList.concat(response.data);
            friendCount--;
            document.getElementById('test').innerHTML = friendCount 
              + " friends to go ... ";
            if(friendCount <= 0) { data_fetch_postproc(); };
          });
        } 
      });
  }
	  
var myMovies = new Array();  

function get_my_movies(){
	  FB.api('/me/movies', function(response){
		myMovies = response.data;
	  });
  }
  
  
  function find_mutual_likes(id) {
	  FB.api('/'+id+'/movies', function(response){
		  movieList = response.data;
		  movieList.sort(compareMovies);
		  var mcount = 0;
		  for (i = 0; i < movieList.length; i++)
		  {
			  for(j = 0; j< myMovies.length; j++){
				if(movieList[i].name === myMovies[j].name){
					mcount++;
				}
			  }
		  }
		  document.getElementById(id).innerHTML += " - You have " + mcount + " mutual likes";
	  });
  }
	  
function get_friends() {
	get_my_movies();
	document.getElementById("results").innerHTML = "";
		  var app_acess_token = "128570973933462|rl_4yFhGSH4QcJPfGPqYGOB2LBQ";
	 document.getElementById('test').innerHTML = "Requesting "
      + "data from Facebook ... ";
    FB.api('/me/friends', function(response) {
		friendCount = response.data.length;
        for( i=0; i<response.data.length; i++) {
			if(!document.getElementById("page")){document.getElementById('test').innerHTML = ""; return;}
          friendId = response.data[i].id;
		  count = 0;
          FB.api('/'+friendId+'?fields=installed&acess_token='+app_acess_token, function(response) {
			friendId = response.id;	  
            if(response.installed){
            	FB.api('/'+friendId, function(response) {
					count++;
					var newDiv = document.createElement("DIV");
					friendId = response.id;	 
					 newDiv.id = friendId;
					 newDiv.innerHTML = response.name;
					 document.getElementById("results").appendChild(newDiv);
					 find_mutual_likes(friendId);
				});
			}
			friendCount--;
			document.getElementById('test').innerHTML = friendCount 
              + " friends to go ...";
			   if(friendCount <= 0) { document.getElementById('test').innerHTML = ""; return; };
          });
        } 
      });
  }

var apikey = "2n2jcb9yw5a9qat694epm3qf";
var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";

function search() {
	
	var moviesSearchUrl = baseUrl + '/movies.json?apikey=' + apikey;
	var query = $("#search").val();
  // send off the query
  $.ajax({
    url: moviesSearchUrl + '&q=' + encodeURI(query),
    dataType: "jsonp",
    success: searchCallback
  });
}
 
// callback for when we get back the results
function searchCallback(data) {
	var query = $("#search").val(); 
	document.getElementById('results').innerHTML = "";
	document.getElementById('results').innerHTML += 'Found ' + data.total + ' results for ' + query + '<br/><br/>';
	var movies = data.movies;
	$.each(movies, function(index, movie) {
		var newDiv = document.createElement("DIV");
		newDiv.id = movie.id;
		newDiv.className = "movie"
	 	newDiv.innerHTML = movie.title + '<br/>';
	 	newDiv.innerHTML+='<img src="' + movie.posters.profile + '" id="movieposter"/>';
		document.getElementById("results").appendChild(newDiv);
 });
}

function future_dvd(){
	var browseUrl = baseUrl + '/lists/dvds/upcoming.json?apikey=' + apikey;
  // send off the query
  $.ajax({
    url: browseUrl,
    dataType: "jsonp",
    success: browseCallback
});
}

function future_t(){
	var browseUrl = baseUrl + '/lists/movies/upcoming.json?apikey=' + apikey;
  // send off the query
  $.ajax({
    url: browseUrl,
    dataType: "jsonp",
    success: browseCallback
});
}

function browseCallback(data) {
	document.getElementById('results').innerHTML = "";
	var movies = data.movies;
	$.each(movies, function(index, movie) {
		var newDiv = document.createElement("DIV");
		newDiv.id = movie.id;
		newDiv.className = "movie"
	 	newDiv.innerHTML = movie.title + '<br/>';
	 	newDiv.innerHTML+='<img src="' + movie.posters.profile + '" id="movieposter"/>';
		document.getElementById("results").appendChild(newDiv);
 });
}
  
  