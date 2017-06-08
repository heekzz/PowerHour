
let config = {};


config.port = process.env.PORT || 5000;
config.spotify_callback = process.env.NODE_ENV==='production' ? "https://powerhourgame.herokuapp.com/auth/callback": 'http://localhost:5000/auth/callback';

module.exports = config;