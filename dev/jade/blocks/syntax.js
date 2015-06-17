$.plug('play',{ // plugin name
  dependency: '', // on what plugins this one depends
  defaults: {
    option: 'defaults' // setting default options
  },
  init: function () { // default function
    this.proto     // prototype of your plugin
    this.el,       // javascript object of selected element
    this.$el,      // jQuery object of selected element
    this.opts      // options merged from defaults, passed options and data attributes
    this.method(); // calling a method
  },
  method: function () { // custom method
    // do your stuff
  }
});

logger('created plugin "play"');