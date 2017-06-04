# Tagify

[![Build Status](http://jenkins.fredrikhakansson.se/buildStatus/icon?job=Tagify-Deploy)](http://jenkins.fredrikhakansson.se/blue/organizations/jenkins/Tagify-Deploy/activity)

*Authors:* Emil Gustafsson (emigu059@student.liu.se) & Fredrik Håkansson (freha309@student.liu.se)

Screencast: https://www.youtube.com/watch?v=p-UlhdE1Zmc&feature=youtu.be

## Functional specification
Our project idea is to enable tagging of your own Spotify playlists. Through this, 
we enable other users to search and follow your playlists, filtered on tags. The tags can be anything from genres to moods or special occasions. 

## Technological specification
When choosing our frameworks for the project, we wanted modern tools that we haven't played with before. We also wanted to use JavaScript through the whole stack for enabling a uniform project design. 


### Front end
* [React](https://facebook.github.io/react/)
	* Simple and modern, used widely. Powerful and fast
* [Bootstrap](http://getbootstrap.com/)
	* Simplify and adding responsive design

### Back end
* [Node.js](https://nodejs.org/en/)
	* Lightweight, JavaScript through the whole stack
* [Passport](http://passportjs.org/)
	* Middleware for authenticating towards external API's. Lets us ignore handling of password and other credentials
* [Spotify API](https://developer.spotify.com/)
    * The Spotify API is used to get data in the backend.

### Database
* [MongoDB](https://www.mongodb.com/)
	* Scalable, modern and new to us. Also uses JSON which is highly compatible with JavaScript 


### Testing
* [Karma](https://karma-runner.github.io/1.0/index.html)
	* Enables more readable tests using Jasmine and Mocha 


### Deployment and CI
* [Jenkins](https://jenkins.io/)
	* Common used and customizable CI system. Fairly familiar to us
* Project is hosted at https://tddd27tagify.herokuapp.com 


# Usage instructions
Download or clone repo. You need `npm` installed to run
```bash
git clone https://gitlab.ida.liu.se/freha309/TDDD272017_Tagify.git
cd Tagify
npm install
```
Frontend is using React with Babel and Webpack. To compile frontend, run 
````npm
npm run build
````
and then to start server, run
````npm
npm run start
````
Server will be launched at [`localhost:5000`](http://localhost:5000). Changes in frontend can be viewed without restarting server.
 Just run `npm run build` while server is running.