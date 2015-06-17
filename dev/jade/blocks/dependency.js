logger('take a look in the console');

$.plug('dependency example',{
  dependency: 'anotherplugin',
  init: function () {
    // do your stuff
  }
});