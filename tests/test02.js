var Gpio = require('onoff').Gpio;
led = new Gpio(14, 'out');
var buttonState;

// ################################################################# SWITCH BUTTON HANDLING
var switchButton = new Gpio(4, 'in', 'both', {debounceTimeout : 0});
buttonState = switchButton.readSync();

switchButton.watch(function(err, value)
  {
      if (err) throw err;
      if(value != buttonState)
      {
        buttonState = value;
        led.writeSync(value);
        console.log('Button state changed to ' + value);
      }

});


process.on('SIGINT', function () {
  console.log("SIGINT");
  led.unexport();
  switchButton.unexport();
});
