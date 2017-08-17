'use strict';

import React from 'react';
import App from './App';


/*
 * Component for the index page that either shows the login dialog or the search field
 */
export default class IndexPage extends React.Component {
    render() {
        let content;
        // Render search field if logged in
        if (this.props.loggedin)
        // Otherwise we show login Modal
            content = <App />;
        else {
            content = <h1>Loading</h1>;
        }
        return (
            <div className="home">
                {console.log("Logged in: " + this.props.loggedin)}
                {/* Display login button if not logged in, otherwise show search field */}
                {content}
            </div>
        );
    }
}
