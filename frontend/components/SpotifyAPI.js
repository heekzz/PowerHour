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


module.exports = {
    play: play,
};