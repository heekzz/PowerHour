/**
 * Created by Fredrik on 2017-06-08.
 */


import React from 'react';
import {Row, Col, Button} from 'react-bootstrap';


export default class Play extends React.Component {
    constructor(props) {
        super(props);
        this.playGame = this.playGame.bind(this);
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
            this.props.startGame();
        }
    }

    render() {
        return (
            <Row>
                <Col xs={12} >
                    <h1>Let's play!</h1>
                    <p><b>Playlist:</b> {this.props.playlist.name}</p>
                    <p><b>Signal:</b> {this.props.signal.name}</p>
                    <Button bsStyle="primary" onClick={this.playGame} >Play</Button>
                </Col>
            </Row>
        )
    }
}