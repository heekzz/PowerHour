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
        this.pausePlayback = this.pausePlayback.bind(this);
        this.nextSong = this.nextSong.bind(this);
        this.playSignal = this.playSignal.bind(this);
        this.fadeIn = this.fadeIn.bind(this);
        this.resumePlayback = this.resumePlayback.bind(this);this.sig;
    }

    start(playlist, signal, gameDuration, trackTime, playNextSong) {
        let startTimer = this.startTimer;
        let pauseSong = this.pausePlayback;
        let playSignal = this.playSignal;
        let nextSong = this.nextSong;
        let resumePlayback = this.resumePlayback;
        let startGame = () => {
            let count = 0;
            sig = signal;
            async.whilst(
                function () {
                    return count < (gameDuration)/trackTime;
                },
                function (callback) {
                    startTimer(trackTime, signal.length).then((response) => {
                        console.debug(response.message);
                        console.debug('Running pause, play and next');
                        async.waterfall([
                            pauseSong,
                            playSignal,
                            playNextSong ? nextSong : resumePlayback
                        ], function (err, result) {
                            if (err)
                                console.error(err);
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
                this.fadeIn().then(() => {
                    callback(null, 'done');
                })
            })
        });
    }

    resumePlayback(status, callback) {
        this.player.resume().then(() => {
            console.log("Resuming playback...");
            this.fadeIn().then(() => {
                callback(null, 'done');
            })
        })
    }

    pausePlayback(callback) {
        this.player.pause().then(() => {
            console.log("Paused music...")
            callback(null, 'done');
        })
    }

    startTimer(trackTime, signalLength) {
        console.debug("Starting timer");
        return new Promise(function (resolve, reject) {
            setTimeout(() => {
                resolve({message: `Waited ${trackTime} seconds...`});
            }, (trackTime))
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

    fadeIn() {
        let player = this.player;
        return new Promise(function (resolve, reject) {
                let volume = 0;
                async.whilst(
                    function () {
                        return volume < 1;
                    },
                    function (callback) {
                        console.debug("Volume: " + volume);
                        player.setVolume(volume).then(() => {
                            volume += 0.1;
                            setTimeout(() => callback(null, volume), 500);
                        });
                    },
                    function (err, n) {
                        console.error(err);
                        resolve();
                    });
            },
        );
    }
}