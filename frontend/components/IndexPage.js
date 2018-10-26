'use strict';

import React from 'react';
import App from './App';
import {
    Grid,
} from 'react-bootstrap'


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
            content = (
                <Grid>
                    <div className='loading-text' >
                        <h1>Loading</h1>
                    </div>
                    <div className='spinner'>
                        <div className='bounce1'></div>
                        <div className='bounce2'></div>
                        <div className='bounce3'></div>
                    </div>
                </Grid>);
        }
        return (
            <div className="home">
                {/* Display login button if not logged in, otherwise show search field */}
                {content}
            </div>
        );
    }
}

