require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require('request');
var moment = require('moment');
var fs = require('fs');
var axios = require('axios');

var artistName = function(artist) {
    return artist.name;
};
var getSpotify = function(songName) {
    spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }
        if(songName === undefined) {
            songName = '"The Sign" Ace of Base';
        }

        var songs = data.tracks.items;
        for(var i = 0; i < songs.length; i++) {
            console.log('#' + i);
            console.log('Artist(s): ' + songs[i].artists.map(artistName));
            console.log('Song Name: ' + songs[i].name);
            console.log('Previous Song: ' + songs[i].preview_url);
            console.log('Album: ' + songs[i].album.name);
            console.log('------------------------------------------');
        }

    });
};

var getMovie = function(title) {
    request("https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if(!error && response.statusCode == 200) {
            var jsonData = JSON.parse(body);

            console.log('Title: ' + jsonData.Title);
            console.log('Year: ' + jsonData.Year);
            console.log('Rated: ' + jsonData.Rated);
            console.log('IMDB Rating: ' + jsonData.imdbRating);
            console.log('Country: ' + jsonData.Country);
            console.log('Language: ' + jsonData.Language);
            console.log('Plot: ' + jsonData.Plot);
            console.log('Actors: ' + jsonData.Actors);
            console.log('Rotten Tomatoes Rating: ' + jsonData.tomatoRating);
            console.log('Rotten Tomatoes URL: ' + jsonData.tomatoURL);
        }
    });
};

var locateConcert = function(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function(response) {
            console.log('Name of the venue:' + response.data[0].venue.name);
            console.log('Venue Location: ' + response.data[0].venue.city);
            var eventDate = moment(response.data[0].datetime).format('MM/DD/YYYY');
            console.log("Date of the Event: " + eventDate);
        })
        .catch(function(error) {
            console.log(error);
        });
};
var simonSays = function() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) throw err;

        var dataArr = data.split(',');

        if (dataArr.length == 2) {
            choices(dataArr[0], dataArr[1]);
        } else if (dataArr.length == 1) {
            choices(dataArr[0]);
        }
    });
};

var choices = function (caseData, functionData) {
    switch(caseData) {
        case 'concert-this':
            locateConcert(functionData);
            break;
        case 'spotify-this-song':
            getSpotify(functionData);
            break;
        case 'movie-this':
            getMovie(functionData);
            break;
        case 'do-this':
            simonSays();
            break;
        default:
            console.log('LIRI does not understand what you are saying');
    }

};

var runChoice = function(argOne, argTwo) {
    choices(argOne, argTwo);
};

runChoice(process.argv[2], process.argv[3]);