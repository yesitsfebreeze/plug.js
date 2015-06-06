$.plug('loosing',{
  init: function () {
    // this is a new plugin for sake of demonstration
    // the next plug command will replace it
  }
});

// replacing a plugin with copy
$.plug.copy('play','loosing');

logger('replaced "loosing" with "play"');

// check the console for information
console.log($.pluglib.loosing)