$.plug('play',{
  init: function () {
    logger('called "play"');
  }
})

// adding a callback
$('#element').play(function(){
  logger('executed callback')
});