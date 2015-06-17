Hyphenator.config({
minwordlength : 4
});
Hyphenator.run();

$(function () {
  
  var loggerrun = false;
  logger = function(msg){
    var speed = 2345;
    var el = $('#logger');
    msg = $('<p class="log in"><span class="text">'+msg+'</span></p>');
    el.append(msg);
    if(loggerrun) return; 
    (function looper(){
      window.setTimeout(function () {
        if (el.children().length > 0) {
          loggerrun = true;
          el.children().removeClass('in').addClass('out');
          setTimeout(function () {
            el.children().remove();
          },speed/2);
          setTimeout(looper,speed)
        } else {
          loggerrun = false;
        }
      },speed*2)
      loggerrun = true;
    })()

  }
  $(document).on('click','.run',function () {
    $.pluglib = {};
    fn = $(this).attr('data-run').split(' ');
    for (var run in fn) {
        coderunner[fn[run]]();  
    }
  })
});