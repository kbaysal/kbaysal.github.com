window.fbAsyncInit = function() {
  FB.init({
    appId      : '167851516708118', // App ID
    channelUrl : 'channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true // parse XFBML
  });

  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
        // connected
    } else if (response.status === 'not_authorized') {
        // not_authorized
        login();
    } else {
        // not_logged_in
        login();
    }
  }
  );
  
  function login() {
    FB.login(function(response) {
        if (response.authResponse) {
            window.location = "home.html"
        } else {
            // cancelled
        }
    },{scope: 'user_photos'});
  }
};

// Load the SDK Asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
