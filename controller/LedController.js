var Gpio = require('onoff').Gpio;
var events = require('events');
LedController.prototype = new events.EventEmitter;
// #############################################################################
// ################################################################# CONSTRUCTOR
// #############################################################################
function LedController(pGPIO)
{
  this.GPIO = pGPIO;
  this.led = new Gpio(this.GPIO, 'out');
}

// #############################################################################
// ############################################################ PUBLIC FUNCTIONS
// #############################################################################

// ######################################################## HOOK SWITCH HANDLING
/**
* Turn the LED on
*/
LedController.prototype.on = function()
{
  this.led.writeSync(1);
}

/**
* Turn the LED off
*/
LedController.prototype.off = function()
{
  this.led.writeSync(0);
}

/**
* Change the LED state according to pState
*/
LedController.prototype.changeLedState = function(pState)
{
  this.led.writeSync(pState);
}

/**
* Returns the LED state
*/
LedController.prototype.__defineGetter__('ledState', function()
{
  return this.led.readSync();
});


// #############################################################################
// ############################################################ STATIC FUNCTIONS
// #############################################################################
exports.createInstance = function (pGPIO)
{
	return new LedController(pGPIO);
}

// #############################################################################
// ############################################################### EXIT HANDINLG
// #############################################################################
process.on('SIGINT', function () {
  //led.unexport();
});
