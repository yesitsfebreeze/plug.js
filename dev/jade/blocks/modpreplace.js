$.plug('play',{
  init: function () {
    logger('old init');
  }
});

// replace takes three arguments: pluginname, method name, new function 
$.plug.replace('play','init',function () {
  logger('new init');
});

$('#element').play();