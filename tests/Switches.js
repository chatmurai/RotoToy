var Gpio = require('onoff').Gpio;
var events = require('events');

// ################################################################# DIAL SWITCH HANDLING
var dialSwitch = new Gpio(15, 'in', 'both', {debounceTimeout : 0});
var dialSwitchState = dialSwitch.readSync();

/**
* Enable dial watch
*/
function watchDial()
{
  dialSwitch.watch(function(err, value)
    {
        if (err) throw err;
        if(value != dialSwitchState)
        {
          dialSwitchState = value;
          if(value == 1)
          {
            pulseCount = 0;
            console.log('Dialing...');
          }
          else
          {
            console.log(pulseCount + ' dialed.');
            pulseLed.writeSync(0);
          }
        }
  });
}

/**
* Disable dial watch
*/
function unwatchDial()
{
  dialSwitch.unwatch();
}

// ################################################################# pulse led HANDLING
var pulseLed = new Gpio(14, 'out');

// ################################################################# PULSE SWITCH HANDLING
var pulseSwitch = new Gpio(4, 'in', 'both', {debounceTimeout : 0});
var pulseCount = 0;
var pulseSwitchState = pulseSwitch.readSync();

/**
* Enable pulse watch
*/
function watchPulse()
{
  pulseSwitch.watch(function(err, value)
    {
        if (err) throw err;
        if(value != pulseSwitchState)
        {
          pulseLed.writeSync(value);
          pulseSwitchState = value;
          if(value == 1 && dialSwitchState == 1)
          {
            if(++pulseCount == 10) pulseCount = 0;
          }
          //console.log('pulseCount : ' + pulseCount);
        }
  });
}

/**
* Disable dial watch
*/
function unwatchPulse()
{
  pulseSwitch.unwatch();
}

// ################################################################# HOOK SWITCH HANDLING
var hookSwitch = new Gpio(18, 'in', 'both', {debounceTimeout : 0});
var hookSwitchState = hookSwitch.readSync();
if(hookSwitchState == 1) // hook is off
{
  watchDial();
  watchPulse();
  console.log('Hook off, waiting for user to dial...');
}

hookSwitch.watch(function(err, value)
  {
      if (err) throw err;
      if(value != hookSwitchState)
      {
        hookSwitchState = value;
        if(value == 1)
        {
          console.log('Hook off, waiting for user to dial...');
          watchDial();
          watchPulse();
        }
        else
        {
          console.log('Hook on.');
          unwatchDial();
          unwatchPulse();
          pulseCount = 0;
        }
      }
});

// ################################################################# EXIT HANDLING
process.on('SIGINT performed', function () {
  console.log("SIGINT");
  dialSwitch.unexport();
  pulseSwitch.unexport();
});
