/**
 * Created by Fredrik on 2018-10-22
 */
import React from 'react';
import {Row, Col, Grid} from 'react-bootstrap'

export default class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            player: undefined,
            playerState: undefined,
            currentTrack: undefined,
            nextTracks: undefined,
        };
        this.getPlayerState = this.getPlayerState.bind(this);
    }

    getPlayerState(){
        this.props.player.getCurrentState().then(state => {
            if (!state) {
                console.info(("Not playing through Web SDK"));
                return;
            }
            this.setState({
                playerState: state,
                currentTrack: state.track_window.current_track,
                nextTracks: state.track_window.next_tracks
            })
        })
    }
    componentDidMount() {
        // Playback status updates
        this.props.player.addListener('player_state_changed', state => {
            this.getPlayerState();
            console.debug(state);
        });
    }


    render() {
        let currentTrack = '';
        let currentArtist = '';
        let nextTrack = '';
        let nextArtist = '';

        if (this.state.currentTrack) {
            currentTrack = this.state.currentTrack.name;
            currentArtist = this.state.currentTrack.artists.map(artist => artist.name).join(', ');
        }
        if (this.state.nextTracks) {
            nextTrack = this.state.nextTracks[0].name;
            nextArtist = this.state.nextTracks[0].artists.map(artist => artist.name).join(', ');
        }

        return (
            <div>
                <Grid>
                    <Row>
                        <Col md={6} sm={12}>
                            <b>Now playing:</b> {currentTrack} - {currentArtist} &nbsp;&nbsp;
                        </Col>
                        <Col md={6} sm={12}>
                            <b>Next track:</b> {nextTrack} - {nextArtist}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} sm={12}>
                            <div className="progress">
                                <div className={"progress-bar "} style={this.props.fill ? {animation: 'fill' +
                                        ' 60s linear 1'}: {}}></div>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}