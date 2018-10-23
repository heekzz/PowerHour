/**
 * This file contains all the logic for the game from the moment you are pressing "PLAY"
 */
import async from 'async';
import { Howl } from 'howler';
import SpotifyAPI from './SpotifyAPI'
let sig;
/**
 * Initiates the whole game and starts the selected playlist
 *
 * @param playlist playlist to play
 * @param signal signal to play in between the songs
 */

export default class Game {

    constructor(mPlayer, mStartProgressbar) {
        this.player = mPlayer;
        this.startProgressbar = mStartProgressbar;
        this.pauseSong = this.pauseSong.bind(this);
        this.nextSong = this.nextSong.bind(this);
        this.playSignal = this.playSignal.bind(this);
    }

    start(playlist, signal) {
        let startTimer = this.startTimer;
        let pauseSong = this.pauseSong;
        let playSignal = this.playSignal;
        let nextSong = this.nextSong;
        let startGame = () => {
            let count = 0;
            sig = signal;
            async.whilst(
                function () {
                    return count < 60;
                },
                function (callback) {
                    startTimer(signal.length).then((response) => {
                        console.debug(response.message);
                        console.debug('Running pause, play and next');
                        async.waterfall([
                            pauseSong,
                            playSignal,
                            nextSong
                        ], function (err, result) {
                            if (err)
                                console.debug('ERROR: ' + err);
                            else {
                                count++;
                                console.debug('Count: ' + count);
                                callback(null, count);
                            }
                        })
                    });
                }
            )
        };

        this.startPlaylist(playlist, startGame);
    }


    startPlaylist(playlist, callback) {
        this.startProgressbar();
        // Plays first track in playlist
        SpotifyAPI.play(playlist.uri, () => {
            callback();
            console.log('Started playlist: "' + playlist.name + '"')
        });
    }

    nextSong(status, callback) {
        let seek = 45 * 1000;
        this.startProgressbar();
        this.player.nextTrack().then(() => {
            console.log("Next song...");
            this.player.seek(seek).then(() => {
                console.debug("Seeking " + seek/1000 + "s");
                callback(null, 'done');
            })
        });
    }

    pauseSong(callback) {
        this.player.pause().then(() => {
            console.log("Paused music...")
            callback(null, 'done');
        })
    }

    startTimer(signalLength) {
        console.debug("Starting timer");
        return new Promise(function (resolve, reject) {
            setTimeout(() => {
                resolve({message: "Waited 60 seconds..."});
            }, 60000 - (signalLength))
        });
    }

    playSignal(res, callback) {
        let audio = new Howl({
            src: [sig.url]
        });
        audio.play();
        setTimeout(() => {
            callback(null, 'done');
        }, sig.length);
    }

}