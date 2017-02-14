var keys = require('./keys.js');
var spotify = require('spotify');
var inquirer = require('inquirer')
var twitter = require('twitter');
var fs = require('fs');
var request = require('request');

var command = process.argv[2]

var client = new twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});


switch (command) {
	case "twitter":
		myTweets();
		break;

	case "spotify":
		mySpotify();
		break;

	case "movie":
		myMovie();
		break;

	case "whatItSays":
		doWhatItSays();
		break;
}



function myTweets() {

	var params = {screen_name: 'melymelm'};

	client.get('statuses/user_timeline', {count: 20}, function(error, tweets, response) {

		var tweetList = "";

	   if(error) throw error;

	   for(var i = 0; i < 20; i++) {
	   	var time = JSON.stringify(tweets[i].created_at, null, 2);

	   	tweetList += "On " + JSON.stringify(tweets[i].created_at, null, 2) + " Tweets:" + "\n" + JSON.stringify(tweets[i].text, null, 2) + "\n";

	   	console.log("Tweet list: " + tweetList);
	   }
		fs.appendFile("log.txt", tweetList, function(error) {
			if(error) {
				console.log(error);
			}
		});
	});
}

function mySpotify(arg) {

var song = arg;
if(song === "") {
	song = "The Sign Ace of Base";
}

console.log(song)

	spotify.search({ type: 'track', query: song }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
	    var songStuff = "Song Name: " + data.tracks.items[0].name + "\n" + "Artist: " + data.tracks.items[0].artists[0].name + "\n" +
	    	"Album name: " + data.tracks.items[0].album.name + "\n" + "Preview URL: " + data.tracks.items[0].preview_url + "\n" + "";

	    console.log("Song: " + songStuff);

	    fs.appendFile("log.txt", songStuff, function(error) {
	    	if(error) {
	    		console.log(error);
	    	}
	    });

	});
};

// * Title of the movie.
//     * Year the movie came out.
//     * IMDB Rating of the movie.
//     * Country where the movie was produced.
//     * Language of the movie.
//     * Plot of the movie.
//     * Actors in the movie.
//     * Rotten Tomatoes Rating.
//     * Rotten Tomatoes URL.

function myMovie(movieName) {

	var movie = movieName;

	if(movie === "") {
		movie = "Mr. Nobody";
	}

	var queryUrl = 'http://www.omdbapi.com/?t=' + movie +'&tomatoes=true&y=&plot=short&r=json';

	request(queryUrl, function (error, response, body) {
		if (!error && response.statusCode == 200) {

			var movieStuff = "Title: " + JSON.parse(body)["Title"] + "\n" + "Release Year: " + JSON.parse(body)["Year"] + "\n" + 
			"IMDB Rating: " + JSON.parse(body)["imdbRating"] + "\n" + "Country: " + JSON.parse(body)["Country"] + "\n" + 
			"Language: " + JSON.parse(body)["Language"] + "\n" + "Plot: " + JSON.parse(body)["Plot"] + "\n" + 
			"Actors: " + JSON.parse(body)["Actors"] + "\n" + "Rotten Tomatoes Score: " + JSON.parse(body)["tomatoRating"] + "\n" +
			"Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"] + "\n" + "";

			console.log("Movie item: " + movieStuff);

			fs.appendFile("random.txt", movieStuff, function(error) {
				if(error) {
					console.log(error);
				}
			});
		};
	});
};

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if(error) {
			return console.log(error);
		}
		var args = dataArr = data.split(',');

		if(args[0] === "spotify") {
			songLookup(args[1]);
		}
		else if(args[1] === "movie") {
			imdb(args[1]);
		}
		else if(args[1] === "twitter") {
			tweetRead();
		}
	});
};


