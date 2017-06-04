'use strict';

import React from 'react';
import App from './App';
import Loading from 'halogen/PulseLoader';


/*
 * Component for the index page that either shows the login dialog or the search field
 */
export default class IndexPage extends React.Component {


    render() {
        let content;
        // Render search field if logged in
        if(this.props.loggedin)
            // Otherwise we show login Modal
        	content = <App />;
        else {
            content = (
            	<div className="container">
                    <Loading color='#000000' margin="4px" size='40px' />
	            </div>
            )
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
