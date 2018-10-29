import fetch from "isomorphic-fetch";

function play(context, callback) {
    fetch('/api/player/start',
        {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({uri: context, device_id: localStorage.getItem('spotify_device_id')}),
        })
        .then(response => response.json())
        .then((json) => {
            console.debug(json);
            if (json.status === 'success')
                callback(null, json);
        });
}

function getPlaylist(playlist_id, callback) {
    fetch(`/api/playlist/${playlist_id}`, {credentials: 'include'})
        .then(response => {
            // Check if playlist exists
            if(response.ok)
                return response.json();
        })
        .then(json => {
            callback(json);
        })
        .catch((err) => {
            console.error(err);
        })

}


function getAlbum(album_id, callback) {
    fetch(`/api/album/${album_id}`, {credentials: 'include'})
        .then(response => {
            // Check if playlist exists
            if(response.ok)
                return response.json();
        })
        .then(json => {
            callback(json);
        })
        .catch((err) => {
            console.error(err);
            // Set empty result if no playlist was found
            this.choosePlaylist('');
        })
}

function getUserPlaylists(callback) {
    fetch(`/api/user/me/playlist`, {credentials: 'include'})
        .then(response => response.json())
        .then(json => {
            callback(json);
        })
}


module.exports = {
    play: play,
    getPlaylist: getPlaylist,
    getAlbum: getAlbum,
    getUserPlaylists: getUserPlaylists,
};