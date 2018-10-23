'use strict';

import React from 'react';
import cookie from 'react-cookie';
import fetch from 'isomorphic-fetch';

/*
 * Layout component holding the menu and the main content wrapper
 */
export default class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state =  {
            username: undefined,
            loggedin: false,
            spotify_access_token: undefined
        }
    }

    componentWillMount() {
        this.checkSpotifyToken(this);
    }

    redirect() {
    	window.location = '/auth/login';
    }

    // Check with backend if token is valid
    checkSpotifyToken(component) {
        fetch('/auth/loggedin', {credentials: 'include'})
            .then(response => response.json())
            .then(json => {
                localStorage.setItem("loggedin", json.loggedin);
                if (json.loggedin) {
                    localStorage.setItem("user_id", json.user.id);
                    localStorage.setItem("username", json.user.name);
                    localStorage.setItem("spotify_access_token", cookie.load("spotify_access_token"));
                    component.setState({
                        loggedin: json.loggedin,
                        username: typeof json.user.name !== 'undefined' ? json.user.name : json.user.id,
                        spotify_access_token: cookie.load("spotify_access_token"),
                    });
                }
                else {
                    component.setState({
                        loggedin: json.loggedin
                    });
	                this.redirect();
                }
            })
    }





    render() {
        // Setting props of children.
        // Children are all routes in the "routes.js" file
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                loggedin: this.state.loggedin,
                username: this.state.username,
                spotify_access_token: this.state.spotify_access_token
            }));

        return (
            <div className="app-container">
                {childrenWithProps}
            </div>
        );
    }
}
