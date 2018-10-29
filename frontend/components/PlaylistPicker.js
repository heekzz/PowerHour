/**
 * Created by Fredrik on 2017-06-04.
 */

import React from 'react';
import {Row, Col, FormControl, FormGroup} from 'react-bootstrap';
import SpotifyAPI from './SpotifyAPI'
import Select from 'react-select';

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
        SpotifyAPI.getUserPlaylists(json => {
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
     * Set chosen playlist or album from the paste link
     */
    getPlaylistFromLink(e) {
        // Get value from input
        let input = e.target.value;
        let context = '';

        // Check if input is valid Spotify link for retrieving a playlist
        if (PlaylistPicker.isUrl(input)) {
            // Get user id and playlist id from link
            context = PlaylistPicker.isUrl(input);
        } else if(PlaylistPicker.isUri(input)) {
            context = PlaylistPicker.isUri(input);
        } else if(input.length < 1){
            this.props.displayPlaylist('');
            return;
        } else {
            this.props.displayPlaylist('');
            return;
        }

        let playlist_id = context.playlist;
        let album = context.album;

        // Get playlist data from backend
        if(album) {
            this.fetchAlbum(album);
        } else {
            this.fetchPlaylist(playlist_id);
        }
    }

    /**
     * Fetch a playlist from the backend.
     * @param playlist_id Spotify ID for a playlist.
     */
    fetchPlaylist(playlist_id) {
        SpotifyAPI.getPlaylist(playlist_id, json => {
            if (json) {
                this.props.displayPlaylist(json);
            } else {
                this.choosePlaylist('');
            }
        })
    }

    /**
     * Fetches an album from backend
     * @param album_id album id from Spotify
     */
    fetchAlbum(album_id) {
        SpotifyAPI.getAlbum(album_id, json => {
            if (json) {
                this.props.displayPlaylist(json);
            } else {
                this.choosePlaylist('');
            }
        })
    }

    /**
     * Checks if the input is a valid Spotify URL for a playlist or album.
     */
    static isUrl(url) {
        let regexp = /https:\/\/open.spotify.com\/user\/\w+\/playlist\/(\w+)/g;
        let match = regexp.exec(url);
        if (match === null) {
            return false;
        }
        return {playlist: match[1]}
    }

    /**
     * Checks if the input is a valid Spotify URI for a playlist or album.
     */
    static isUri(uri) {
        let maybePlaylist = /spotify:user:\w*:playlist:(\w+)/g.exec(uri);
        let maybeAlbum = /spotify:album:(\w*)/g.exec(uri);
        if (maybeAlbum !== null) {
            return {album: maybeAlbum[1]}
        }
        if (maybePlaylist !== null) {
            return {playlist: maybePlaylist[1]}
        }
        return false;
    }



    render () {
        return (
            <Row className="show-grid" >
                <Col xs={12} sm={12}  md={12} >
                    <h1>Choose a playlist</h1>
                </Col>
                <Col xs={12} sm={6} md={6} >
                    <h2>Your playlists</h2>
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
                                placeholder="Paste URL or URI from Spotify"
                            />
                        </FormGroup>
                    </form>
                </Col>
            </Row>
        )
    }
}
