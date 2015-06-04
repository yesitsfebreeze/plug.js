function log(msg) {
  $('#logger').append('<p class="log">'+msg+'</p>');
}

// this is how you make a new plugin, simple huh?
$.plug('newPlugin');
log('Plugin <em>newPlugin</em> has been created')
// to access its prototype you can use
$.sockets.creating

// as of now the plugin has no funtionality, lets add a simple log
$.plug('creating','examplelog',{
  init: function () {
    var meth = this.name
    setTimeout(function () {
      log('Plugin method <em>'+meth+'</em> has been executed')  
    },500)
  }
});

$(function () {

  // how you call it
  setTimeout(function () {
    $('body').creating('examplelog');
    log('Plugin <em>creating</em> has been executed')
  },500)

});

