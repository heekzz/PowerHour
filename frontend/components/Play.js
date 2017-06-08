/**
 * Created by Fredrik on 2017-06-08.
 */


import React from 'react';
import {Row, Col, Button} from 'react-bootstrap';


export default class Play extends React.Component {
	constructor(props) {
		super(props);
		this.playGame = this.playGame.bind(this);
		this.play = this.play.bind(this);
	}


	componentDidMount() {

	}

	playGame() {
		if (this.props.playlist === "") {
			alert("You didn't choose a playlist!");
			window.location = "#choosePlaylist";
		} else if (this.props.signal === "") {
			alert("You didn't choose a signal!");
			window.location = "#chooseSignal";
		} else {
			alert("PLAYING GAME!!!");
			this.play()
		}
	}

	play() {

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