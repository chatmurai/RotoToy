var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');

fs.createReadStream('sounds/banana.mp3')
  .pipe(new lame.Decoder())
  .on('format', function (format) {
    this.pipe(new Speaker(format));
  });

/*fs.createReadStream(process.argv[2])
  .pipe(new lame.Decoder())
  .on('format', function (format) {
    this.pipe(new Speaker(format));
  });
*/
