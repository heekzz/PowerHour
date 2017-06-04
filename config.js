
let config = {};


config.port = process.env.PORT || 5000;
config.spotify_callback = process.env.NODE_ENV==='production' ? "https://tddd27tagify.herokuapp.com/callback": 'http://localhost:5000/callback';

module.exports = config;