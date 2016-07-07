var gpio = require('rpi-gpio');
var buttonState;

gpio.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH, readInitInput);

function readInitInput() {
  gpio.read(7, function(err, value) {
    buttonState = Number(value);
    console.log('The initial value of the button is ' + value);
    startDetection();
  });
}

function startDetection() {
  gpio.on('change', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
  });
}
