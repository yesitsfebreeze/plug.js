$.plug('play',{
  defaults: {
    option: 'option'
  },
  init: function () {
    logger(this.opts.option);
  }
})

// passing options argument
$('#element').play({
  option: 'new option'
});
