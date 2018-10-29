import React from 'react';
import {Button, Grid} from "react-bootstrap";
import {isMobile} from "react-device-detect";

export default class StartPage extends React.Component {
    render() {
        let alertStyle = '';
        if(isMobile) {
            alertStyle = 'alert alert-danger'
        }

        const webSdkLink = 'https://developer.spotify.com/documentation/web-playback-sdk/';
        const emeLink = 'https://developers.google.com/web/fundamentals/media/eme';
        return (
            <Grid>
                <h1>Welcome to PowerHour!</h1>
                <p>This is the drinking game called PowerHour (<a href="https://en.wikipedia.org/wiki/Power_hour">Wikipedia</a>).
                    The rules are simple. Drink a shot of beer every minute for 60 minutes (1 hour).
                    Every time the music changes and the choosen signal plays, you take a shot!</p>
                <p><b>How-to:</b></p>
                <ol>
                    <li>Choose a playlist from Spotify</li>
                    <li>Choose signal to play when to drink</li>
                    <li>Start playing!</li>
                </ol>
                <p>This game currently only works on browsers supporting <a href={emeLink}>Encrypted Media Extensions</a>, since it is using the <a href={webSdkLink}>Spotify Web Playback SDK</a>.
                    <br/>
                    This means the following browsers are supported:
                </p>
                <ul>
                    <li>Google Chrome</li>
                    <li>Firefox</li>
                    <li>Internet Explorer (version > 11)</li>
                    <li>Microsoft Edge</li>
                </ul>
                <div className={alertStyle}>
                    <p>Currently no mobile browsers are supported! :( </p>
                </div>
                <Button bsStyle="primary" onClick={() => window.location='#choosePlaylist'}>Start</Button>
                <div className='drink-responsible'>
                    <p><i>Drink responsible!</i></p>
                </div>
            </Grid>
        )
    }
}