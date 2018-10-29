/**
 * Created by Fredrik on 2017-06-08.
 */


import React from 'react';
import {Row, Col, Button} from 'react-bootstrap';
import Slider from 'react-rangeslider';
import ToggleButton from './ToggleButton'

export default class Play extends React.Component {

    constructor(props) {
        super(props);

        this.playGame = this.playGame.bind(this);
        this.trackTimeSliderChanged = this.trackTimeSliderChanged.bind(this);
        this.gameDurationSliderChanged = this.gameDurationSliderChanged.bind(this);
        this.toggleNextSong = this.toggleNextSong.bind(this);

        this.defaultNextSong = true;

        this.state = {
            gameDuration: 60, // Default game duration in seconds
            trackTime: 60, // Default track time in seconds
            nextSong: this.defaultNextSong
        }
    }

    /**
     * Check if we filled in everything and then plays the game
     */
    playGame() {
        if (this.props.playlist === "") {
            window.location = "#choosePlaylist";
        } else if (this.props.signal === "") {
            window.location = "#chooseSignal";
        } else {
            this.props.startGame(this.state.gameDuration * 60 * 1000, this.state.trackTime * 1000, this.state.nextSong);
        }
    }

    trackTimeSliderChanged(value) {
        this.setState({trackTime: value});
    }

    gameDurationSliderChanged(value) {
        this.setState({gameDuration: value});
    }

    toggleNextSong(toggle) {
        this.setState({ nextSong: toggle });
    }

    showActions(props) {
        if (props.playlist !== '' && props.signal !== '') {
            return (
                <Col xs={12} >
                    <h1>Let's play!</h1>
                    <p><b>Playlist:</b> {props.playlist.name}</p>
                    <p><b>Signal:</b> {props.signal.name}</p>
                    <p><b>I want to play for: </b> {this.state.gameDuration} minutes</p>
                    <Slider
                        min={30}
                        max={180}
                        step={5}
                        value={this.state.gameDuration}
                        onChange={this.gameDurationSliderChanged}
                    />
                    <p><b>I want to take a drink every: </b> <u>{this.state.trackTime}</u> seconds</p>
                    <Slider
                        min={20}
                        max={180}
                        step={5}
                        value={this.state.trackTime}
                        onChange={this.trackTimeSliderChanged}
                    />
                    <p><b>Skip song:</b></p>
                    <ToggleButton defaultChecked={this.defaultNextSong} onToggle={this.toggleNextSong} />
                    <p>(If active, a new song will be switched to after the drinking signal. Otherwise the complete song will be played)</p>
                    <Button bsStyle="primary" onClick={this.playGame} >Play</Button>
                </Col>
            )
        } else {
            let selections = [];
            if(props.playlist === '')
                selections.push('playlist');
            if (props.signal === '')
                selections.push('signal');

            return (
                <Col xs={12} >
                    <h1>Let's play!</h1>
                    <h3>You are not ready yet!</h3>
                    <p>You have to choose both a playlist and a signal to start playing.</p>
                    <Button bsStyle="primary" onClick={this.playGame} >Select {selections.length > 1 ? selections.join(' & '): selections[0]}</Button>
                </Col>
            )
        }
    }

    render() {
        return (
            <Row>
                {this.showActions(this.props)}
            </Row>
        )
    }
}