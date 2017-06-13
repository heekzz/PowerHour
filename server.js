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
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});


function isAuthenticated(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.send(req.body);
	// res.redirect('/');
}

let app = express();

app.use(express.static(path.join(__dirname ,'frontend', 'public')))
	.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(favicon(path.join(__dirname, 'frontend', 'public', 'img', 'favicon.ico')));

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
			headers: { 'Authorization': 'Bearer ' + spotify_access_token },
			json: true
		};



		// Try access
		request.get(options, function(error, response, body) {
			let status_code  = response.statusCode;
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
	passport.authenticate('spotify', {scope: ['user-read-private', 'user-read-email', 'playlist-modify-private', 'playlist-modify-public'], showDialog: true}),
	function(req, res) {
		// Will not be called...
	}
);

/**
 * Callback endpoint for the Spotify Authentication using passport
 */
app.get('/auth/callback', passport.authenticate('spotify', {failureRedirect: '/'}), function(req, res) {
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
			headers: { 'Authorization': 'Bearer ' + spotify_access_token},
			json: true
		};
		request.get(options, function (error, response, body) {
			if (error)
				res.send(error);
			else
				res.send(body);
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
			headers: { 'Authorization': 'Bearer ' + spotify_access_token},
			json: true
		};
		request.get(options, function (error, response, body) {
			if (!error && response.statusCode === 200)
				res.send(body);
			else
				res.send(error);
		})
	}
});

let port = config.port;
console.log('Listening on ' + port);
app.listen(port);