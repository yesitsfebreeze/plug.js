$.plug('play',{
  defaults: {
    option: 'option'
  },
  init: function () {
    logger(this.opts.option);
  }
});

// adding options and callbacks
$('#element').play({
  option: 'new option'
},function(){
  logger('executed callback');
});
