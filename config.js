
let config = {};


config.port = process.env.PORT || 5000;
config.spotifyCallback = process.env.NODE_ENV==='production' ? "https://powerhourgame.herokuapp.com/auth/callback": 'http://localhost:5000/auth/callback';
config.clientId = process.env.SPOTIFY_CLIENT_ID  || '';
config.clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';

module.exports = config;