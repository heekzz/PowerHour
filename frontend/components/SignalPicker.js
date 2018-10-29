/**
 * Created by Fredrik on 2017-06-08.
 */

import React from 'react';
import {Grid, Row, Col, Button, Panel} from 'react-bootstrap';
import sounds from '../data/drinkSounds';
import { Howl } from 'howler'

export default class SignalPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signal: '',
        };
        this.chooseSignal = this.chooseSignal.bind(this);
    }

    componentDidMount() {
    }

    chooseSignal(sound) {
        this.setState({
            signal: sound.id,
        });
        this.props.chooseSignal(sound);
    }

    playSignal(signal) {
        new Howl({
            src: [signal.url]
        }).play();
    }


    getSounds() {
        let size = 12 / (sounds.length > 3 ? 4 : sounds.length % 4);
        return (
            sounds.map((sound, key) => (
                    <Col xs={12} sm={12}  md={12} key={sound.id} >
                        <Panel>
                            <Row>
                                <Col md={8} xs={12}>
                                    <p><b>Name: </b>{sound.name}</p>
                                    <b>Length: </b>{sound.length/1000} seconds
                                </Col>
                                <Col xs={12} md={2}>
                                    <Button bsClass="button-black signal-button"  onClick={() => this.playSignal(sound)} >Play</Button>
                                </Col>
                                <Col xs={12} md={2}>
                                    <Button bsClass="button-green signal-button" onClick={() => this.chooseSignal(sound)} >Choose signal</Button>
                                </Col>
                            </Row>
                        </Panel>
                    </Col>
                )
            )
        )
    }


    render () {
        return (
            <Row className="show-grid" >
                <Col md={12}>
                    <h1>Choose signal</h1>
                    <p>Choose a signal that will play when it's time to drink!</p>
                </Col>
                {this.getSounds()}
            </Row>
        )
    }
}