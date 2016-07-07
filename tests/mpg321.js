var mpg321 = require('mpg321');

var file = './1.mp3';
var player = mpg321().remote();

// infinity loop
player.play(file);
player.on('end', function () {
  console.log('end');
  player.play(file);
});

// SIGINT hack
process.on('SIGINT', function () {
  process.exit();
});
