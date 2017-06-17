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
            <Col  xsHidden xs={12} sm={6} md={3}>
              <Image src={this.props.playlist.images[0].url} thumbnail responsive />
            </Col>
            <Col xs={12} sm={6} md={9}>
              <h3>{this.props.playlist.name}</h3>
              <p>{this.props.playlist.description}</p>
            </Col>
            <Clearfix visibleMdBlock visibleSmBlock  visibleLgBlock />
            <Col mdOffset={5} smOffset={3} xs={12} sm={6} md={2} >
              <Button bsStyle="primary" onClick={() => this.props.choosePlaylist(this.props.playlist)}>
                Choose playlist
              </Button>
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