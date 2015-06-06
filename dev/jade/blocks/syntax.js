$.plug('play',{ // plugin name
  defaults: {
    option: 'defaults',
    methodoption: 'this is a method'
  },
  init: function () { // default function
    this.proto // prototype of your plugin
    this.el,   // javascript object of selected element
    this.$el,  // jQuery object of selected element
    this.opts  // options merged from defaults, passed options and data attributes

    logger('executed "init" of "'+this.proto.name+'"')
    logger(this.opts.option)

    // this.method(); // calling a method
  },
  method: function () { // custom method
    logger(this.opts.methodoption)
    logger('executed "method" of play')
  }
});

logger('created plugin "play"');