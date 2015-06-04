$.plug('newPlugin');

console.log('Plug Prototype Library:',$.sockets)

console.log('plugin got executed')

$.plug('newPlugin','init',{
    init: function(){
      console.log('init run')
    }
});

$(function () {
    $('#element').newPlugin.init();
});