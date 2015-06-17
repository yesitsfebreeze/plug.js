$.plug('play',{
  defaults: {
    option: 'original'
  },
  init: function () {
    // do your stuff
  },
  method: function(){
    logger('called "method"');
    logger(this.opts.option);
  }
});

// calling a method
$('#element').play('method',{
  option: 'new option'
},function(){
  logger('executed callback');
});