$.plug('play',{
  init: function () {
    logger('first');
  }
});

// append takes three arguments: pluginname, method name, new function 
$.plug.append('play','init',function () {
  logger('second');
});

// calling play
$('#element').play();