/**
 * Created by Fredrik on 2017-06-07.
 */

import React from 'react';
import {Row, Col, Image, Clearfix, Button, Media} from 'react-bootstrap';

export default class DisplayPlaylist extends React.Component {

	render () {
		let  content = "";

		// Only display if a result is available
		if (this.props.playlist !== null && typeof this.props.playlist !== 'undefined' && this.props.playlist !== '') {
			content = (
				<Row>
					<Col xs={12} sm={12} md={12}>
						<Media>
							<Media.Left>
								<img src={this.props.playlist.images[0].url}  />
							</Media.Left>
							<Media.Body>
								<Media.Heading>
									{this.props.playlist.name}
								</Media.Heading>
								<p>{this.props.playlist.description}</p>
							</Media.Body>
						</Media>
					</Col>
					<Clearfix visibleMdBlock visibleSmBlock  visibleLgBlock />
					<Col mdOffset={5} smOffset={3} xs={12} sm={6} md={2} >
						<Button bsStyle="primary" onClick={() => this.props.choosePlaylist(this.props.playlist)}>Choose playlist </Button>
					</Col>
				</Row>
			)

		}
		return (
			<div>
				{content}
			</div>
		)
	}
}