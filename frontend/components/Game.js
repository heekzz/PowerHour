/**
 * This file contains all the logic for the game from the moment you are pressing "PLAY"
 */

/**
 * Initiates the whole game and starts the selected playlist
 *
 * @param playlist playlist to play
 * @param signal signal to play in between the songs
 */
function start(playlist, signal) {
    startPlaylist(playlist)
}

function start1minCounter() {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve({message: "Waited a while..."});
        }, 5000)
    });
}

function startPlaylist(playlist) {
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
            if (json.status === 'success') {
                start1minCounter().then(blob => console.log(blob.message));
            }
        });
}

export { start };