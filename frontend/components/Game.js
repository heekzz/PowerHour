/**
 * This file contains all the logic for the game from the moment you are pressing "PLAY"
 */
import async from 'async';
let sig;
/**
 * Initiates the whole game and starts the selected playlist
 *
 * @param playlist playlist to play
 * @param signal signal to play in between the songs
 */
function start(playlist, signal) {
  let startGame = () => {
    let count = 0;
    sig = signal;
    async.whilst(
        function() { return count < 60;},
        function(callback) {
          startTimer(signal.length).then((response) => {
            console.log(response.message);
            console.log('Running pause, play and next');
            async.waterfall([
              pauseSong,
              playSignal,
              nextSong
            ], function(err, result) {
              if (err)
                console.log('ERROR: ' + err);
              else {
                count++;
                console.log('Count: ' + count);
                callback(null, count);
              }
            })
          });
        }
    )
  };

  startPlaylist(playlist, startGame);
}


function startPlaylist(playlist, callback) {
  let data = {};
  data.uri = playlist.uri;
  // Plays first track in playlist
  fetch('/api/player/start',
      {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      })
  .then(response => response.json())
  .then((json) => {
    console.log(json);
    if (json.status === 'success')
      callback();
  });
}

function startTimer(signalLength) {
  console.log("Starting timer");
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve({message: "Waited 60 seconds..."});
    }, 60000 - (signalLength))
  });
}

function pauseSong(callback) {
  console.log('Pausing song');
  fetch('/api/player/pause',
      {
        credentials: 'include',
        method: 'PUT',
      })
  .then(response => response.json())
  .then(json => {
    console.log('--- Pause song ---');
    console.log(json);
    callback(null, json);
  });
}

function playSignal(res, callback) {
  let audio = new Audio(sig.url);
  audio.play();
  setTimeout(() => {
    callback(null, 'done');
  }, sig.length);
}

function nextSong(status, callback) {
  console.log(status);
  console.log('Next song');
  fetch('/api/player/next',
      {
        credentials: 'include',
        method: 'PUT'
      })
  .then(response => {
    return response.json()
  })
  .then(json => {
    console.log('--- Next song ---');
    console.log(json);
    callback(null, json);
  });
}
export { start };