$.plug('play',{
  init: function () {
    // do your stuff
  },
  method: function(){
    logger('called "method"');
  }
});

// calling a method
$('#element').play('method');