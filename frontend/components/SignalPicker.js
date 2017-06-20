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
    return (
        sounds.map((sound, key) => (
                <Col xs={12} sm={12}  md={12} key={sound.id} >
                  <Panel header={<h2><b>{sound.name}</b></h2>} >
                    <div className="playlist-button-group">
                      <Button bsClass="button-black"  onClick={() => this.playSignal(sound)} >Play</Button>
                      <Button bsClass="button-green" onClick={() => this.chooseSignal(sound)} >Choose signal</Button>
                    </div>
                  </Panel>
                </Col>
            )
        )
    )
  }


  render () {
    return (
        <Row className="show-grid" >
          <Col>
            <h1>Choose signal</h1>
            <p>Choose a signal that will play when it's time to drink!</p>
          </Col>
          {this.getSounds()}
        </Row>
    )
  }
}