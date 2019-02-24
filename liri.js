require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var command = process.argv[2];
var input = process.argv[3];
var moment = require("moment");

//function chooseCommand() {
  switch (command) {
    case "consert-this":
      bandsInTownArtistEvents();
      break;
    case "spotify-this-song":
      spotifySong();
      break;
    case "movie-this":
      moviesOMDB();
      break;
    case "do-what-it-says":
      fixedSongAndText();
      break;
  }
//}

function bandsInTownArtistEvents() {

  //  // Store all of the arguments in an array
  //  var nodeArgs = process.argv[3];
  //  console.log(nodeArgs);

  //  // Create an empty variable for holding the artist/band name
  //  var artistName = "";

  //  // Loop through all the words in the node argument
  //  // And do a little for-loop magic to handle the inclusion of "+"s
  //  for (var i = 2; i < nodeArgs.length; i++) {

  //    if (i > 2 && i < nodeArgs.length) {
  //      artistName = artistName + "+" + nodeArgs[i];
  //      console.log(artistName);
  //    }
  //    else {
  //      artistName += nodeArgs[i];
  //  console.log(artistName);
  //    }
  //  }

   // Then run a request with axios to the Bands in Town Artist Events API with the movie specified
   var queryUrl = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp"
   // This line is just to help us debug against the actual URL.
   //console.log(queryUrl);
   axios.get(queryUrl).then(
     function(response) {
      console.log("Name of the venue: " + response.data[0].venue.name);
      console.log("Venue location for event: " + response.data[0].venue.city);
      console.log("Date of the event: " + moment(response.data[0].datetime).format("MM/DD/YYYY"));

      //  for(var i = 1; i < response.data.length; i++) {
      //  console.log("Name of the " + i + " venue: " + response.data[i].venue.name);
      //  console.log("Venue location for " + i + " event: " + response.data[i].venue.city);
      //  console.log("Date of the " + i + " event: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
      // }
     }
   );
 };


function moviesOMDB() {

  //If user doesn't specify the movie name it will automatic type info for titanic movie
  if (input === ""){
    input = "Titanic";
  }

  //  // Store all of the arguments in an array
  //  var nodeArgs = process.argv[3];
  //  //console.log(nodeArgs);
  //  // Create an empty variable for holding the movie name
  //  var movieName = "";

  //  // Loop through all the words in the node argument
  //  // And do a little for-loop magic to handle the inclusion of "+"s
  //  for (var i = 2; i < nodeArgs.length; i++) {

  //    if (i > 2 && i < nodeArgs.length) {
  //      movieName = movieName + "+" + nodeArgs[i];
  //      //console.log(movieName);
  //    }
  //    else {
  //      movieName += nodeArgs[i];
  //  //console.log(movieName);
  //    }
  //  }
  //  console.log(movieName);

   // Then run a request with axios to the OMDB API with the movie specified
   var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

   // This line is just to help us debug against the actual URL.
   //console.log(queryUrl);

   axios.get(queryUrl).then(
     function(response) {

       console.log("Title of the movie: " + response.data.Title);
       console.log("Year the movie came out: " + response.data.Released);
       for(var i = 0; i < (response.data.Ratings.length - 2); i++) {
         console.log("IMDB Rating of the movie: " + response.data.Ratings[0].Value);
         console.log("Rotten Tomatoes Rating of the movie: " + response.data.Ratings[1].Value);
       }
       console.log("Country where the movie was produced: " + response.data.Country);
       console.log("Language of the movie: " + response.data.Language);
       console.log("Plot of the movie: " + response.data.Plot);
       console.log("Actors in the movie: " + response.data.Actors);
     }
   );

};

function fixedSongAndText() {
  fs.readFile("random.txt", "utf8", function(error, data) {

    if(error) {
      return console.log(error);
    }
    var dataArr = data.split(",");
    console.log(dataArr[1]);
    spotifySong(dataArr[1]);
  });
};

function spotifySong() {
    ////If user has not specified a song , default to "I will always love you" by Witney Houston
    if (input === ""){
      input = "I will always love you";
    }

  spotify.search({ type: 'track', query: input }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    // //Checking the recieved data
    // for (var i = 0; i < 1; i++) {
    // console.log(data.tracks.items[i]);
    // };
    var songInfo = data.tracks.items;
    console.log("Artist name: " + songInfo[0].artists[0].name); 
    console.log("Song Name: " + songInfo[0].name);
    console.log("Preview Link: " + songInfo[0].preview_url);
    console.log("Album: " + songInfo[0].album.name);
  });
  
};

