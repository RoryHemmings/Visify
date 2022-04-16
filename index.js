/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const env = require('dotenv').config().parsed

const client_id = env.CLIENT_ID; // Your client id
const client_secret = env.CLIENT_SECRET; // Your secret
const redirect_uri = env.REDIRECT_URI; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
<<<<<<< HEAD
var generateRandomString = (length) => {
=======
var generateRandomString = function (length) {
>>>>>>> 74c77ade8de954ce1e4ffd12551791644b03ca4f
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser());

<<<<<<< HEAD
app.get('/login', (req, res) => {
=======
app.get('/login', function (req, res) {
>>>>>>> 74c77ade8de954ce1e4ffd12551791644b03ca4f

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    URLSearchParams.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

<<<<<<< HEAD
app.get('/callback', (req, res) => {
=======
app.get('/callback', function (req, res) {
>>>>>>> 74c77ade8de954ce1e4ffd12551791644b03ca4f

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      URLSearchParams.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

<<<<<<< HEAD
    request.post(authOptions, (error, response, body) => {
=======
    request.post(authOptions, function (error, response, body) {
>>>>>>> 74c77ade8de954ce1e4ffd12551791644b03ca4f
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
          refresh_token = body.refresh_token;

	console.log(access_token + " " + refresh_token);
        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
<<<<<<< HEAD
        request.get(options, (error, response, body) => {
=======
        request.get(options, function (error, response, body) {
>>>>>>> 74c77ade8de954ce1e4ffd12551791644b03ca4f
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          URLSearchParams.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          URLSearchParams.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

<<<<<<< HEAD
app.get('/refresh_token', (req, res) => {
=======
app.get('/refresh_token', function (req, res) {
>>>>>>> 74c77ade8de954ce1e4ffd12551791644b03ca4f

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

<<<<<<< HEAD
  request.post(authOptions, (error, response, body) => {
=======
  request.post(authOptions, function (error, response, body) {
>>>>>>> 74c77ade8de954ce1e4ffd12551791644b03ca4f
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on ' + env.PORT);
app.listen(env.PORT);
