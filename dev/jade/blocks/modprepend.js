// prepend takes three arguments: pluginname, method name, new function 

$.plug.prepend('play','init',function () {
  logger('prepended function');
})


