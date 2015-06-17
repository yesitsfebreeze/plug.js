$.plug('play',{
  defaults: {
    option: 'option'
  },
  init: function () {
    logger(this.opts.option);
  }
});

// The syntax for this is data-pluginname-optionname

// adding data attribute to object
$('#element').attr('data-play-option','data attribute overwrite');

$('#element').play();

// Note:
//   A data attribute will always overwrite passed options
//   So we are removing it again to avoid conflicts
$('#element').removeAttr('data-play-option');

$('#element').play();
