const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const async = require('async');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const favicon = require('serve-favicon');
const path = require('path');
const config = require('./config');

const redirect_uri = config.spotify_callback; // Your redirect uri

passport.use(new SpotifyStrategy({
  clientID: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  callbackURL: redirect_uri
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    return done(null, accessToken);
  })
}));

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send(req.body);
  // res.redirect('/');
}

let app = express();

app.use(express.static(path.join(__dirname, 'frontend', 'public')))
.use(cookieParser());

app.use(bodyParser.urlencoded({extended: false}));

app.use(
    favicon(path.join(__dirname, 'frontend', 'public', 'img', 'favicon.ico')));

app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './frontend/views');

// Initiate passport
app.use(passport.initialize());
// .. also support for Passport persistent login sessions
app.use(passport.session());

app.get('/', function (req, res) {
  res.render('index')
});

/**
 * Checks if a user is logged in by sending a request with the access token to Spotify.
 * If valid, a user is considered authenticated to Spotify and PowerHourGame
 */
app.get('/auth/loggedin', function (req, res) {
  let spotify_access_token = req.cookies.spotify_access_token || null;
  let data = {};

  // Return 403 of no access token provided
  if (spotify_access_token === null) {
    data.loggedin = false;
    res.send(data);
  } else {
    // Set options for request to Spotify API
    let options = {
      url: 'https://api.spotify.com/v1/me',
      headers: {'Authorization': 'Bearer ' + spotify_access_token},
      json: true
    };

    // Try access
    request.get(options, function (error, response, body) {
      let status_code = response.statusCode;
      if (status_code === 200) {
        data.user = {id: body.id, name: body.display_name};
        data.loggedin = true;
        res.cookie("username", body.display_name ? body.display_name : body.id);
        res.cookie("spotify_id", body.id);
        res.status(200);
        res.send(data);
      } else {
        data = {};
        data.loggedin = false;
        res.status(403);
        res.send(data);
      }
    });
  }
});

/**
 * Login using Spotify. Will redirect to Spotify authentication page
 */
app.get('/auth/login',
    passport.authenticate('spotify',
        {
          scope: ['user-read-private', 'user-read-email',
            'playlist-modify-private', 'playlist-modify-public',
            'user-modify-playback-state', 'user-read-playback-state',
            'user-read-currently-playing'],
          showDialog: true
        }),
    function (req, res) {
      // Will not be called...
    }
);

/**
 * Callback endpoint for the Spotify Authentication using passport
 */
app.get('/auth/callback',
    passport.authenticate('spotify', {failureRedirect: '/'}),
    function (req, res) {
      let spotify_access_token = req.user || null;
      res.cookie("spotify_access_token", spotify_access_token);
      res.redirect('/');
    }
);

/**
 * Fetches playlists of logged in from Spotify
 */
app.get('/api/user/me/playlist', function (req, res) {
  let spotify_access_token = req.cookies.spotify_access_token || null;
  if (spotify_access_token === null) {
    res.status(403);
    res.send("No access token provided");
  } else {
    // Set options for request to Spotify API
    let options = {
      url: `https://api.spotify.com/v1/me/playlists`,
      headers: {'Authorization': 'Bearer ' + spotify_access_token},
      json: true
    };
    request.get(options, function (error, response, body) {
      if (error) {
        res.send(body);
      } else {
        res.send(body);
      }
    })
  }
});

/**
 * Fetches playlist for a user with matching user_id and playlist_id from Spotify
 */
app.get('/api/user/:user_id/playlist/:playlist_id', function (req, res) {
  let spotify_access_token = req.cookies.spotify_access_token || null;
  if (spotify_access_token === null) {
    res.status(403);
    res.send("No access token provided");
  } else {
    // Set options for request to Spotify API
    let options = {
      url: `https://api.spotify.com/v1/users/${req.params.user_id}/playlists/${req.params.playlist_id}`,
      headers: {'Authorization': 'Bearer ' + spotify_access_token},
      json: true
    };
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        res.send(body);
      } else {
        res.send(body);
      }
    })
  }
});

/**
 * Starts playing a provided playlist
 */
app.post('/api/player/start', function (req, res) {
  let spotify_access_token = req.cookies.spotify_access_token || null;
  if (spotify_access_token === null) {
    res.status(403);
    res.send("No access token provided");
  } else {
    let body = {};
    body.context_uri = req.body.uri;
    body.offset = {position: 0};
    let options = {
      url: `https://api.spotify.com/v1/me/player/play`,
      headers: {'Authorization': 'Bearer ' + spotify_access_token,},
      json: true,
      body: body
    };
    request.put(options, function (error, response, body) {
      if (!error && response.statusCode === 204) {
        res.send({status: 'success'});
      } else {
        res.send(body);
      }
    })

  }
});

/**
 * Pauses the playback
 */
app.put('/api/player/pause', function (req, res) {
  let spotify_access_token = req.cookies.spotify_access_token || null;
  if (spotify_access_token === null) {
    req.status(403);
    req.send("No access token provided");
  } else {
    let options = {
      url: `https://api.spotify.com/v1/me/player/pause`,
      headers: {'Authorization': 'Bearer ' + spotify_access_token,},
      json: true,
    };
    request.put(options, function (error, response, body) {
      console.log(JSON.stringify(response));
      if (!error && response.statusCode === 204) {
        res.send({status: 'success'});
      } else {
        res.send(body);
      }
    })
  }
});

/**
 * Skips to next song
 */
app.put('/api/player/next', function (req, res) {
  let spotify_access_token = req.cookies.spotify_access_token || null;
  if (spotify_access_token === null) {
    res.status(403);
    res.send("No access token provided");
  } else {
    let options = {
      url: `https://api.spotify.com/v1/me/player/next`,
      headers: {'Authorization': 'Bearer ' + spotify_access_token,},
      json: true
    };
    request.post(options, function (error, response, body) {
      if (!error && response.statusCode === 204) {
        options.url = `https://api.spotify.com/v1/me/player/seek?position_ms=60000`;
        request.put(options, function (err_seek, res_seek, body_seek) {
          if (!err_seek && res_seek.statusCode === 204) {
            res.send({status: 'success'});
          } else {
            res.send(body_seek);
          }
        })
      } else {
        res.send(body);
      }
    })
  }
});

let port = config.port;
console.log('Listening on ' + port);
app.listen(port);