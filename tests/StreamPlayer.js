var player = new StreamPlayer();
var mp3_stream = yourFunc();

player.on('end', () => {
  console.log('Finished!');
});

player.on('progress', info => {
  console.log(`Played ${info.progress}%`);
});

player.play(mp3_stream);
