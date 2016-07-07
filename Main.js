(function(){

  var StaticValuesClass = require('./model/StaticValues');
  var mode = StaticValuesClass.HOME;

  // ###########################################################################
  // ##################################################### AUDIO PLAYER HANDINLG
  // ###########################################################################
  var AudioPlayerClass = require('./controller/AudioPlayer');
  var audioPlayer = AudioPlayerClass.createInstance(StaticValuesClass.INITIAL_VOLUME);
  //audioPlayer.on('soundPlayComplete', function(){console.log("Sound play complete");});

  // ###########################################################################
  // ############################################################## LED HANDINLG
  // ###########################################################################
  var LedControllerClass = require('./controller/LedController');
  var ledController = LedControllerClass.createInstance(14);

  // ###########################################################################
  // ######################################################### SWITCHES HANDINLG
  // ###########################################################################

  // ############################################################# HOOK HANDLING
  var HookControllerClass = require('./controller/HookController');
  var hookController = HookControllerClass.createInstance(18);
  hookController.on('onHookStateChange', hookStateChange);

  function hookStateChange (pHookState){
    if(pHookState) // up
    {
      console.log("Hook is up.");
      audioPlayer.play('./media/sounds/ui/home1.mp3', null);
    }
    else // down
    {
      console.log("Hook is down.");
      mode = StaticValuesClass.HOME;
      audioPlayer.stop();
    }
  }

  hookController.startWatch();

  // ###########################################################################
  // ############################################################# DIAL HANDLING
  // ###########################################################################
  var DialControllerClass = require('./controller/DialController');
  var dialController = DialControllerClass.createInstance(15, 4);

  dialController.on('onDialing', numberDialing);
  dialController.on('onDialed', numberDialed);
  dialController.on('onBadDial', badDial);
  dialController.on('onPulse', pulse);

  function numberDialing (){
    var h = hookController.hookIsOff ? 'up' : 'down';
    console.log('Dialing with hook ' + h + '.');
  }

  function numberDialed (pNumberDialed){
    console.log(pNumberDialed + ' Dialed.');
    ledController.off();
    if(hookController.hookIsOff)
    {
      switch (pNumberDialed) {
        // ################################################################ HOME
        case 0:
          console.log("HOME");
          audioPlayer.stop();
          audioPlayer.play("./media/sounds/ui/home2.mp3", pNumberDialed);
          mode = StaticValuesClass.HOME;
        break;

        default:
        // ################################################################ RADIO
        case 1:
          console.log("RADIO");
          if(mode !== StaticValuesClass.RADIO)
          {
            // pick a random radio station from JSON list

            /*var fs = require('fs');
          	var jsonStations = fs.readFileSync("./model/stations.json", 'utf8');
            var rnd = Math.ceil(Math.random() * 9);
            var rndStationURL = JSON.parse(jsonStations).data[rnd].url;*/

            mode = StaticValuesClass.RADIO;
            //audioPlayer.playAfterSpeech("./media/sounds/ui/radio.mp3", rndStationURL, null, 20);
            audioPlayer.playAfterSpeech("./media/sounds/ui/radio.mp3", "./model/stations.json", pNumberDialed);
          }
          else
          {
            audioPlayer.play("./model/stations.json", pNumberDialed);
          }
        break;

        // ################################################################ TALES
        case 2:
          console.log("TALES");
          if(mode !== StaticValuesClass.TALES)
          {
            mode = StaticValuesClass.TALES;
            //audioPlayer.playAfterSpeech("./media/sounds/ui/radio.mp3", rndStationURL, null, 20);
            //audioPlayer.playAfterSpeech("./media/sounds/ui/tales.mp3", "./model/stations.json", pNumberDialed, 20);
            audioPlayer.playRandomSound("./media/sounds/tales");
          }
          else
          {
            audioPlayer.playRandomSound("./media/sounds/tales");
          }
        break;
      }
    }
  }

  function pulse (pPulseValue){
      ledController.changeLedState(pPulseValue);
  }

  function badDial (){
      console.log("Sorry I didn't get it.");
      audioPlayer.play("./media/sounds/ui/prout.mp3", null);
  }

  dialController.startWatch();

  // ###########################################################################
  // ############################################################# EXIT HANDINLG
  // ###########################################################################
  process.on('SIGINT', function () {
    console.log("SIGINT");
    process.exit();
  });

})();
