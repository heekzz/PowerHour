/**
 * Created by Fredrik on 2017-06-04.
 */
import React from 'react';
import PlaylistPicker from './PlaylistPicker';
import DisplayPlaylist from './DisplayPlaylist';
import SignalPicker from './SignalPicker';
import Play from './Play';
import {Grid, Button} from 'react-bootstrap';
import Player from './Player';
import Game from './Game';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayPlaylist: '',
            playlist: '',
            signal: '',
            game: '',
            player: '',
            fill: false,
            playing: false,
        };
        this.displayPlaylist = this.displayPlaylist.bind(this);
        this.choosePlaylist = this.choosePlaylist.bind(this);
        this.chooseSignal = this.chooseSignal.bind(this);
        this.initSpotifyPlayer = this.initSpotifyPlayer.bind(this);
        this.playGame = this.playGame.bind(this);
        this.startProgressBar = this.startProgressBar.bind(this);
        this.initSpotifyPlayer();
    }

    componentDidMount() {
        let options = {
            sectionClassName:       'section',
            anchors:                ['start', 'choosePlaylist', 'chooseSignal', 'play'],
            scrollBar:              false,
            navigation:             true,
            verticalCentered:       false,
            sectionPaddingTop:      '50px',
            sectionPaddingBottom:   '50px',
            arrowNavigation:        true,
            scrollOverflow:         true,
        };

        // Init fullpage.js
        $('#fullpage').fullpage(options);

        // Disable manual scrolling
        $.fn.fullpage.setMouseWheelScrolling(false);
        $.fn.fullpage.setAllowScrolling(false);
    }

    // Set playlist to display
    displayPlaylist(playlist) {
        this.setState({
            displayPlaylist: playlist
        });
    }


    choosePlaylist(playlist) {
        this.setState({
            playlist: playlist
        });
        window.location = '#chooseSignal';
    }

    chooseSignal(signal) {
        this.setState({
            signal: signal
        });
        window.location = "#play";
    }

    initSpotifyPlayer() {
        let token = localStorage.getItem('spotify_access_token');
        console.debug("Connecting player...");

        if (window.Spotify !== null) {
            this.state.player = new window.Spotify.Player({
                name: "PowerHour Player",
                getOAuthToken: cb => { cb(token); },
            });

            // Error handling
            this.state.player.addListener('initialization_error', ({ message }) => { console.error(message); });
            this.state.player.addListener('authentication_error', ({ message }) => { console.error(message); });
            this.state.player.addListener('account_error', ({ message }) => { console.error(message); });
            this.state.player.addListener('playback_error', ({ message }) => { console.error(message); });

            // Ready
            this.state.player.addListener('ready', ({ device_id }) => {
                console.debug('Ready with Device ID', device_id);
                localStorage.setItem("spotify_device_id", device_id)
            });

            // Not Ready
            this.state.player.addListener('not_ready', ({ device_id }) => {
                console.debug('Device ID has gone offline', device_id);
            });

            this.state.player.addListener('player_state_changed', state => {
                if(state) {
                    this.setState({
                        playing: true
                    })
                }
            });

            // finally, connect!
            this.state.player.connect();

            this.game = new Game(this.state.player, this.startProgressBar);
        }
    }

    playGame() {
        this.game.start(this.state.playlist, this.state.signal);
    }

    startProgressBar() {
        this.setState({
            fill: false
        });
        this.setState({
            fill: true
        });
    }

    render() {
        const footer = () => {
            if(this.state.playing) {
                return (
                    <footer className="sticky-footer fp-auto-height">
                        <Player player={this.state.player} fill={this.state.fill}  />
                    </footer>
                )
            } else {
                return '';
            }
        };

        return (
            <div>
                <div id="fullpage">
                    <div className="section">
                        <Grid>
                            <h1>Welcome to PowerHour!</h1>
                            <p>This is the drinking game called PowerHour (<a href="https://en.wikipedia.org/wiki/Power_hour">Wikipedia</a>).
                                The rules are simple. Drink a shot of beer every minute for 60 minutes (1 hour).
                                Every time the music changes and the choosen signal plays, you take a shot</p>
                            <p>How-to:</p>
                            <ol>
                                <li>Choose a playlist from Spotify</li>
                                <li>Choose signal to play when to drink</li>
                                <li>Start playing!</li>
                            </ol>
                            <Button bsStyle="primary" onClick={() => window.location='#choosePlaylist'}>Start</Button>
                        </Grid>
                    </div>
                    <div className="section">
                        <Grid>
                            <PlaylistPicker displayPlaylist={this.displayPlaylist} />
                            <DisplayPlaylist choosePlaylist={this.choosePlaylist} playlist={this.state.displayPlaylist} />
                        </Grid>
                    </div>
                    <div className="section">
                        <Grid>
                            <SignalPicker chooseSignal={this.chooseSignal} />
                        </Grid>
                    </div>
                    <div className="section">
                        <Grid>
                            <Play playlist={this.state.playlist} signal={this.state.signal} startGame={this.playGame} />
                        </Grid>
                    </div>
                </div>
                {footer()}
            </div>
        )
    }
}