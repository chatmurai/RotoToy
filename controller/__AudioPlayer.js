// The mpg321 wrapper for Node.js https://www.npmjs.com/package/mpg321
// http://www.include.gr/debian/mpg321/

var events = require('events');

// ################################################################# CONSTRUCTOR
function AudioPlayer(pSoundPool)
{
	this.soundPool = pSoundPool;
	this.volume = 50;
}

// ############################################################# PRIVATE MEMBERS
var Mpg321Player = require('mpg321');
var mpg321Player = Mpg321Player().remote();

AudioPlayer.prototype = new events.EventEmitter;

// ############################################################ PUBLIC FUNCTIONS
/*
* Play an online radio stream based on a json list
* @param pJsonListPath String : Path to the JSON station list
* @param pRadioId uint : Id of the statoin to play
* @param pVolume uint : Volume from 1 to 100
**/
AudioPlayer.prototype.play = function(pFileOrPlaylist, pRadioId, pVolume)
{
	/*this.stop();

	// Get the audio file or playlist
	var fs = require('fs');
	var jsonPlayListOrFile = fs.readFileSync(pFileOrPlaylist, 'utf8');

	// if jsonPlayListOrFile is not valid JSON we have a single audio file
	if(!isJSON(jsonPlayListOrFile))
	{
		mpg321Player
		  .loop(1) // infinity loop
		  .file(pFileOrPlaylist)
		  .exec();
	}
	else // else we have a playlist
	{
		var stations = JSON.parse(jsonPlayListOrFile);
		//mpg321Player.play(stations.data[pRadioId - 1].url);
		mpg321Player
		  .loop(1) // infinity loop
		  .file(stations.data[pRadioId - 1].url)
		  .exec();
	}*/


	// stop the running player and kill the instance of mpg321 (if any)
	this.stop();

	// create a new one
	var sound;
	if(pVolume !== undefined) this.volume = pVolume;
	if(mpg321Player === undefined ) mpg321Player = Mpg321Player().remote();
	mpg321Player.gain(this.volume);

	// Get the audio file or playlist
	var fs = require('fs');
	var jsonPlayListOrFile = fs.readFileSync(pFileOrPlaylist, 'utf8');

	// if jsonPlayListOrFile is not valid JSON we have a single audio file
	if(!isJSON(jsonPlayListOrFile))
	{
		mpg321Player.play(pFileOrPlaylist);
		/*mpg321Player.on('end', function () {
			console.log('FILE SOUND END');
		});*/
	}
	else // else we have a playlist
	{
		var stations = JSON.parse(jsonPlayListOrFile);
		mpg321Player.play(stations.data[pRadioId - 1].url);
	}

}

/*
* Stop the current playing sound or stream
**/
AudioPlayer.prototype.stop = function()
{
	if(mpg321Player !== undefined)
	{
		//mpg321Player.restart();
		mpg321Player.stop();
		//mpg321Player.quit();
		//mpg321Player = undefined;
	}
}

/**
* Pick-up a random file from music directory
*/
function getRandomSound()
{
	var files = fs.readdirSync(this.soundPool);
	return this.soundPool + '/' + files[Math.floor(Math.random() * files.length)];
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
exports.createInstance = function (pSoundPool)
{
	return new AudioPlayer(pSoundPool);
}

// #############################################################################
// ############################################################### EXIT HANDINLG
// #############################################################################
process.on('SIGINT', function () {
	console.log("SIGINT");
	process.exit();
});
