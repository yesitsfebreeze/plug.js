$.plug = function(proto,name,fn) {

  // function to add the prototype as a jquery plugin
  this.play =  function(proto,plugin) {
    var pluginname = (proto)?proto+'__'+plugin.prototype.name:plugin.prototype.name;
    $.fn[pluginname] = function(name,opts) {
      var o = opts;
      return this.each(function() {
          // pass options to element
          if (o && pluginname != plugin.prototype.name) {
            this.opts = ('object' == typeof this.opts) ? this.opts : {};
            this.opts[pluginname] = o;
          }
          // create plugin
          new plugin(this, name , (o)?o:false);
      })
    };
  };

  // function to create the first global prototype
  this.socket = function(proto) {
    // create plugin container if not already existing
    $.plug.sockets = ('object' !== $.plug.sockets) ? {} : $.plug.sockets;

    // check if plugin already exists
    if ('object' == $.plug.sockets[proto]) return;

    // create init function to call the global plugin
    $.plug.sockets[proto] = {}
    $.plug.sockets[proto]['_plug'] = function(el,meth,opts) {
        // if method exists; execute it else execute init
        (meth) ? this.__execute(el,meth,opts) : this.__execute(el,false,opts);
    };

    // define the base prototype
    $.extend($.plug.sockets[proto]['_plug'].prototype, {  
      name: proto,
      __execute: function(el,meth,opts) {
        meth = (meth)?proto+'__'+meth:false;
        if (meth) return $(el)[meth](el,opts);
      }
    })  

    this.play(false,$.plug.sockets[proto]['_plug']);

  }

  // run plugin function to make sure the plugin exist
  // gets cancled if it already exists
  this.socket(proto);

  // dont continue if only prototype should be created
  if (!name && !fn) return;

  // inform the user if name is not set
  if (!name || 'string' !== typeof name ) return console.info('Please provide a method name for the '+proto+' plugin.');

  // copy init function from the global plugin
    $.plug.sockets[proto][name] = function(e) {
      this.opts = e.opts[proto+'__'+name];
      this.el   = $(e);
      this.init()
    };

  // extend the prototype with passed functions
  $.extend($.plug.sockets[proto][name].prototype, {
    name: name,
    init: function() {
      // inform the user that the init function has not changed
      console.info('Init function for the '+proto+' '+name+' method has not been set. Plugin may not behave as desired.')
    }
  },fn) // passed funtions
  this.play(proto,$.plug.sockets[proto][name]);
}