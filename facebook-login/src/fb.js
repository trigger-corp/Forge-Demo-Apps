// For overall Forge documentation, see [http://docs.trigger.io/](http://docs.trigger.io/)
var go = function () {
  // We assume you already have a Facebook app with ID "319333711443283"
  $('#results').html('Loading...');

  // This URL is where Facebook will redirect us back to once authentication is complete.
  // Using `fb319333711443283` as a scheme is a Facebook feature, where a successful
  // OAuth handshake is allowed to redirect to a `fb+APP_ID` scheme URL
  var redirectURI = "fb319333711443283://authorize";

  // See the [Facebook documentation](http://developers.facebook.com/docs/authentication/) for how to
  // construct this URL.
  var authURL = 'https://www.facebook.com/dialog/oauth?' +
    'client_id=319333711443283&' +
    'redirect_uri=' + redirectURI + '&' +
    'display=touch&response_type=token';

  // `pattern` is a [Match Pattern](http://code.google.com/chrome/extensions/match_patterns.html)
  // for the URL we're waiting for which signals the completion of OAuth handshake.
  // When the opened modal view's URL matches pattern, the view is closed and the callback is invoked.
  var pattern = 'fb319333711443283://authorize/*';

  // This callback will be invoked when the handshake is complete.
  // The window's URL will now match `pattern`, defined above, i.e. `fb319333711443283://authorize/...`
  var authenticationComplete = function(data) {
    var params = {},
        queryString = data.url.substring(data.url.indexOf('#')+1),
        regex = /([^&=]+)=([^&]*)/g,
        m;

    // We can pull out the Facebook authentication data from the URL query string
    while (m = regex.exec(queryString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return getCurrentUserDetails(params);
  }

  var getCurrentUserDetails = function(params) {
  // forge.request.ajax lets us break cross-domain restrictions
    forge.request.ajax({
      url: 'https://graph.facebook.com/me?access_token='+params['access_token'],
      dataType: 'json',
      success: showUserDetails
    });
  }

  // Display some of the authenticated user's Facebook details
  var showUserDetails = function(data) {
    $('#results').html(
        '<div>Name: ' + data.name +
        '<br>Email: ' + data.email +
        '<br>Gender: ' + data.gender +
        '<br>Link: <a href="#" onclick="forge.tabs.open(\'' + data.link + '\')">' + data.link + '</a>' +
        '</div>'
    );
  }

  // Open the Facebook authentication dialog
  forge.tabs.openWithOptions({
    url: authURL,
    pattern: pattern
  }, authenticationComplete);
};
