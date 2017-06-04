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
const spotify = require('./spotifyCredentials');
const config = require('./config');

const client_id = spotify.client_id;
const client_secret = spotify.client_secret;

const redirect_uri = config.spotify_callback; // Your redirect uri

passport.use(new SpotifyStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: redirect_uri
}, function (accessToken, refreshToken, profile, done) {
    return done(null, accessToken);
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

app.get('/', function (req, res) {;
    res.render('index')
});

app.get('/loggedin', function (req, res) {
    let spotify_access_token = req.cookies.spotify_access_token;
    let options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + spotify_access_token },
        json: true
    };

    let status_code = null;

    let data = {};

    // Try access
    request.get(options, function(error, response, body) {
        status_code = response.statusCode;
        if (status_code === 200) {
        	data.user = {id: body.id, name: body.display_name};
        	data.loggedin = true;
	        res.cookie("username", body.display_name ? body.display_name : body.id);
	        res.cookie("spotify_id", body.id);
            res.send(data);
        } else {
        	data = {};
            data.loggedin = false;
            res.send(response);
        }
    });


});


app.get('/login',
    passport.authenticate('spotify', {scope: ['user-read-private', 'user-read-email', 'playlist-modify-private', 'playlist-modify-public'], showDialog: true}),
    function(req, res) {
        // Will not be called...
    }
);


app.get('/callback', passport.authenticate('spotify', {failureRedirect: '/'}),
    function(req, res) {
        let spotify_access_token = req.user || null;
        res.cookie("spotify_access_token", spotify_access_token);
        res.redirect('/');
    });


// Not used anymore
app.get('/refresh_token', function(req, res) {

    // requesting access token from refresh token
    let refresh_token = req.query.refresh_token;
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            let access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});

let port = config.port;
console.log('Listening on ' + port);
app.listen(port);