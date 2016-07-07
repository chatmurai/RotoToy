var Gpio = require('onoff').Gpio;
var events = require('events');
DialController.prototype = new events.EventEmitter;
// #############################################################################
// ################################################################# CONSTRUCTOR
// #############################################################################
function DialController(pDialSwitchGPIO, pPulseSwitchGPIO)
{
  // dial switch
  this.dialSwitchGPIO = pDialSwitchGPIO;
  this.dialSwitch = new Gpio(this.dialSwitchGPIO, 'in', 'both', {debounceTimeout : 0});
  this.dialSwitchState = this.dialSwitch.readSync();

// pulse switch
  this.pulseSwitchGPIO = pPulseSwitchGPIO;
  this.pulseSwitch = new Gpio(this.pulseSwitchGPIO, 'in', 'both', {debounceTimeout : 0});
  this.pulseSwitchState = 0;
  this.pulseCount = 0;
  this.pulseDetected = false;
}

// #############################################################################
// ############################################################ PUBLIC FUNCTIONS
// #############################################################################

// ######################################################## DIAL SWITCH HANDLING
/**
* Start to listen for dial / pulse state change
*/
DialController.prototype.startWatch = function()
{
  var self = this;

// dial switch
  self.dialSwitch.watch(function(err, value)
    {
      if (err) throw err;
      if(value != self.dialSwitchState)
      {
        self.dialSwitchState = value;
        if(value == 1)
        {
          self.emit('onDialing');
        }
        else
        {
           if(self.pulseDetected)
           {
             self.emit('onDialed', self.pulseCount);
             self.pulseDetected = false;
             self.pulseCount = 0;
           }
           else
           {
             self.emit('onBadDial');
           }
        }
      }
  });

  // pulse switch
  self.pulseSwitch.watch(function(err, value)
    {
      if (err) throw err;
      if(value != self.pulseSwitchState)
      {
        self.pulseSwitchState = value;
        self.emit('onPulse', value);
        if(value == 1 && self.dialSwitchState == 1)
        {
          self.pulseDetected = true;
          if(++self.pulseCount == 10) self.pulseCount = 0;
        }
      }
  });
}

/**
* Stop listening for hook state change
*/
DialController.prototype.stoptWatch = function()
{
  var self = this;
  self.dialSwitch.unwatch();
  self.pulseSwitch.unwatch();
}

// #############################################################################
// ############################################################ STATIC FUNCTIONS
// #############################################################################
exports.createInstance = function (pDialSwitchGPIO, pPulseSwitchGPIO)
{
	return new DialController(pDialSwitchGPIO, pPulseSwitchGPIO);
}

// #############################################################################
// ############################################################### EXIT HANDINLG
// #############################################################################
process.on('SIGINT', function () {
  //dialSwitch.unexport();
});
