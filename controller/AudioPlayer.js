// The mpg321 wrapper for Node.js https://www.npmjs.com/package/mpg321
// http://www.include.gr/debian/mpg321/

const events = require('events');
const fs = require('fs');
var self;
// ################################################################# CONSTRUCTOR
function AudioPlayer(pVolume)
{
  this.volume = pVolume || 20;
  self = this;
}

// ############################################################# PRIVATE MEMBERS
var mode = "FILE";
var nextFile = {};
var Mpg123Player = require('mpg123');
var mpg123Player = new Mpg123Player();

mpg123Player.on('end', function(data){
  if (mode == "SPEECH") {
    console.log("SPEECH ENDED");
    self.play(nextFile.file, nextFile.id, nextFile.volume);
  }
  else if (mode == "FILE") {
    console.log("SOUND FILE ENDED");
  }
  else if (mode == "STREAM") {
    console.log("ERROR READING STREAM");
  }
});

AudioPlayer.prototype = new events.EventEmitter;

// ############################################################ PUBLIC FUNCTIONS
/*
* Play a file or a stream
* @param pFileOrPlaylist String : Path to the audio file or the JSON playlist
* @param pFileId uint : Id of the file to play (if JSON playlist is used )
* @param pVolume uint : Volume from 1 to 100
**/
AudioPlayer.prototype.play = function(pFileOrPlaylist, pFileId)
{
  mpg123Player.volume(self.volume);

	// Get the audio file or playlist
	var fs = require('fs');
	var jsonPlayListOrFile = fs.readFileSync(pFileOrPlaylist, 'utf8');

	// if jsonPlayListOrFile is not valid JSON we have a single audio file
	if(!isJSON(jsonPlayListOrFile))
	{
    mode = "FILE";
    mpg123Player.play(pFileOrPlaylist);
	}
	else // else we have a playlist
	{
    mode = "STREAM";
		var stations = JSON.parse(jsonPlayListOrFile);
		mpg123Player.play(stations.data[pFileId - 1].url);
	}
}

/*
* Play a file or a stream
* @param pFileOrPlaylist String : Path to the audio file or the JSON playlist
* @param pFileId uint : Id of the file to play (if JSON playlist is used )
* @param pVolume uint : Volume from 1 to 100
**/
AudioPlayer.prototype.playAfterSpeech = function(pSpeech, pFileOrPlaylist, pFileId)
{
  mode = "SPEECH";
  nextFile.file = pFileOrPlaylist;
  nextFile.id = pFileId;
  nextFile.volume = self.volume;

  mpg123Player.volume(self.volume);
  mpg123Player.play(pSpeech);
}

/*
* Play a random file or stream
* @param folderToPickUpFrom String : Path to the folder to pick up from
* @param pVolume uint : Volume from 1 to 100
**/
AudioPlayer.prototype.playRandomSound = function (folderToPickUpFrom)
{
	var files = fs.readdirSync(folderToPickUpFrom);
	var file = folderToPickUpFrom + '/' + files[Math.floor(Math.random() * files.length)];
  this.play(file, null, self.volume);
}

/*
* Stop the current playing sound or stream
**/
AudioPlayer.prototype.stop = function()
{
	if(mpg123Player !== undefined)
	{
		mpg123Player.stop();
	}
}

/**
* Ttest if a string is a valid JSON
*/
function isJSON(pString){
    try{
        JSON.parse(pString);
        return true;
    }
    catch (error){
        return false;
    }
}

// ############################################################ STATIC FUNCTIONS
exports.createInstance = function (pVolume)
{
	return new AudioPlayer(pVolume);
}

// #############################################################################
// ############################################################### EXIT HANDINLG
// #############################################################################
process.on('SIGINT', function () {
	console.log("SIGINT");
	process.exit();
});
