var Gpio = require('onoff').Gpio;
var events = require('events');
HookController.prototype = new events.EventEmitter;
// #############################################################################
// ################################################################# CONSTRUCTOR
// #############################################################################
function HookController(pGPIO)
{
  this.GPIO = pGPIO;
  this.hookSwitch = new Gpio(this.GPIO, 'in', 'both', {debounceTimeout : 0});
  this.hookSwitchState = this.hookSwitch.readSync();
}

// #############################################################################
// ############################################################ PUBLIC FUNCTIONS
// #############################################################################

// ######################################################## HOOK SWITCH HANDLING
/**
* Start to listen for hook state change
*/
HookController.prototype.startWatch = function()
{
  var self = this;

  self.emit('onHookStateChange', this.hookSwitchState);

  self.hookSwitch.watch(function(err, value){
    if (err) throw err;
    if(value != self.hookSwitchState)
    {
      self.hookSwitchState = value;
      self.emit('onHookStateChange', self.hookSwitchState);
    }
  });
}

/**
* Stop listening for hook state change
*/
HookController.prototype.stoptWatch = function()
{
  var self = this;
  self.hookSwitch.unwatch();
}

/**
* Returns the hook state
*/
HookController.prototype.__defineGetter__('hookIsOff', function()
{
  return this.hookSwitchState;
});

// #############################################################################
// ############################################################ STATIC FUNCTIONS
// #############################################################################
exports.createInstance = function (pGPIO)
{
	return new HookController(pGPIO);
}

// #############################################################################
// ############################################################### EXIT HANDINLG
// #############################################################################
process.on('SIGINT', function () {
  //hookSwitch.unexport();
});
