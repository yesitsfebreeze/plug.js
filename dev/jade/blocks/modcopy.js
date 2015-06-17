$.plug('play',{
  init: function () {
    logger('you loose');
  }
});

// copy play into newplugin loosing
$.plug.copy('play','loosing')


$('#element').loosing();


$.plug('winning',{
  init: function () {
    this.price()
  },
  price: function(){
    logger('you win');
  }

});

// this can also be used to replace existing plugins
$.plug.copy('winning','play')


$('#element').play();