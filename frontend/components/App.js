/**
 * Created by Fredrik on 2017-06-04.
 */
import React from 'react';
import PlaylistPicker from './PlaylistPicker';
import DisplayPlaylist from './DisplayPlaylist';
import SignalPicker from './SignalPicker';
import {Col, Row, Image, Grid, Button} from 'react-bootstrap';


export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			displayPlaylist: '',
			playlist: "",
			signal: "",
		};
		this.displayPlaylist = this.displayPlaylist.bind(this);
		this.choosePlaylist = this.choosePlaylist.bind(this);
		this.chooseSignal = this.chooseSignal.bind(this);
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



	render() {
		return (
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
						<p>Play</p>
					</Grid>
				</div>
			</div>

		)
	}

}