/**
 * Created by Fredrik on 2017-06-08.
 */

import React from 'react';
import {Grid, Row, Col, Button, Panel} from 'react-bootstrap';
import sounds from '../data/drinkSounds';

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


	getSounds() {
		return (
			sounds.map((sound, key) => (
					<Col xs={12} sm={6}  md={4} key={sound.id} >
						<Panel>
							<h4>{sound.name}</h4>
							<audio controls>
								<source src={sound.url} type="audio/mp3" />
							</audio>
							<Button bsStyle="primary" onClick={() => this.chooseSignal(sound)} >Choose signal</Button>
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