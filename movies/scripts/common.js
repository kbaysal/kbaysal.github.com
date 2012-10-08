function Entry(title, tdate, ddate, picture){
    this.tdate = tdate;
    this.ddate = ddate;
    this.title = title;
    this.picture = picture;
}

function createEntry(entry, index){
    $("#results").append('<div class=\"result eight columns\"" id=\"'+index+'\">'
                          +'<div class=\"inner eight columns \">'
                          +'<h1>' + entry.title + '</h1>'
                          +'<h3> In theaters:'  + entry.tdate + '</h3>'
                          +'<h3> DVD:'  + entry.ddate + '</h3>'
                          +'<img alt="' + entry.title + ' image" src="' + entry.picture + '" />'
                          +'</div>'
                          +'</div>');
    if(entry.picture !== "" )
        document.getElementById(index).style.backgroundImage = "url("+entry.picture+")";
    
}

function onSubmit() {
    document.getElementById('results').innerHTML = "";
    var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=2n2jcb9yw5a9qat694epm3qf&q=";
    var likesUrl = baseUrl+document.getElementById('likes').value;
    $.ajax({
        url: likesUrl,
        dataType: "jsonp",
        success: searchCallback
    });
    document.getElementById('likes').value = "";
}

function searchCallback(data) {
    var movies = data.movies;
    var title, tdate, ddate, picture, entry;
    var index = 0;
    movies.forEach(function(movie){
        title = movie.title;
        tdate = movie.release_dates.theater;
        ddate = movie.release_dates.dvd;
        picture = movie.posters.original;
        entry = new Entry(title, tdate, ddate, picture);
        createEntry(entry, index);
        index++;
    });
}



//below taken from: http://webcheatsheet.com/javascript/disable_enter_key.php
function stopRKey(evt) { 
    var evt = (evt) ? evt : ((event) ? event : null); 
    var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null); 
    if ((evt.keyCode == 13) && (node.type=="text"))  { onSubmit(); return false;} 
} 

document.onkeypress = stopRKey;