/**
 * Created by Fredrik on 2017-06-04.
 */

import React from 'react';
import {Grid, Row, Col, Button, Clearfix, Image, FormControl, FormGroup, ControlLabel} from 'react-bootstrap';
import Select from 'react-select';
import fetch from 'isomorphic-fetch';

/**
 * TODO: Check if playlist consists of < 60 songs and warn then
 */
export default class PlaylistPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      value: null
    };
    this.choosePlaylist = this.choosePlaylist.bind(this);
    this.getUserPlaylists = this.getUserPlaylists.bind(this);
    this.getPlaylistFromLink = this.getPlaylistFromLink.bind(this);
  }

  componentDidMount() {
    this.getUserPlaylists();
  }

  /**
   * Get playlists of a user
   */
  getUserPlaylists() {
    let user = localStorage.getItem('user_id');
    fetch(`/api/user/me/playlist`, {credentials: 'include'})
    .then(response => response.json())
    .then(json => {
      this.setState({
        playlists: json.items,
      })
    })

  }

  /**
   * Set chosen playlist from the search field
   */
  choosePlaylist(playlist) {
    this.setState({
      value: playlist
    });
    this.props.displayPlaylist(playlist);
  }

  /**
   * Set chosen playlist from the paste link
   *
   * TODO: Add possibility to detect URI as well
   */
  getPlaylistFromLink(e) {
    // Get value from input
    let url = e.target.value;

    // Check if input is valid Spotify link for retrieving a playlist
    if (this.validUrl(url) === 'success') {
      // Get user id and playlist id from link
      let urlArray = url.split('/');
      let user_id = urlArray[4];
      let playlist_id = urlArray[6];

      // Get playlist data from backend
      fetch(`/api/user/${user_id}/playlist/${playlist_id}`, {credentials: 'include'})
      .then(response => {
        // Check if playlist exists
        if(response.ok)
          return response.json();
      })
      .then(json => {
        this.props.displayPlaylist(json);
      })
      .catch(() => {
        // Set empty result if no playlist was found
        this.choosePlaylist('');
      })
    } else if(url.length < 1){
      this.props.displayPlaylist('');
    } else {
      this.props.displayPlaylist('');
    }

  }

  /**
   * Checks if the url holds the correct format for fetching a Spotify playlist
   */
  static validUrl(url) {
    let regexp = /https:\/\/open.spotify.com\/user\/\w+\/playlist\/\w+/g;
    let match = regexp.exec(url);
    return match === null ? 'error': 'success';
  }



  render () {
    return (
        <Row className="show-grid" >
          <Col xs={12} sm={12}  md={12} >
            <h1>Choose a playlist</h1>
          </Col>
          <Col xs={12} sm={6} md={6} >
            <h2>Own playlist</h2>
            <p>Choose from the playlist you created or which you follow</p>
            <Select
                id="selectPlaylist"
                options={this.state.playlists}
                value={this.state.value}
                onChange={this.choosePlaylist}
                valueKey="id"
                labelKey="name"
            />
          </Col>
          <Col xs={12} sm={6} md={6} >
            <h2>Paste link</h2>
            <p>Paste url to any public playlist</p>
            <form>
              <FormGroup controlId="formBasicText" >
                <FormControl
                    type="text"
                    onChange={this.getPlaylistFromLink}
                    placeholder="Paste URL from Spotify"
                />
              </FormGroup>
            </form>
          </Col>
        </Row>
    )
  }
}