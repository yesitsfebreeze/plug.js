// replace takes three arguments: pluginname, method name, new function 

$.plug.replace('play','init',function () {
  this.method();
});

logger('"init" replaced by "method"');
