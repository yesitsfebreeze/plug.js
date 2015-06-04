$.plug = function(proto,name,fn) {
   // function to add the prototype as a jquery plugin
  this.play =  function(proto,plugin) {
    var pluginname = (proto)?proto+'__'+plugin.prototype.name:plugin.prototype.name;
    $.fn[pluginname] = function(name,opts) {
      var o = opts;
      return this.each(function() {
          // pass options to element
          if (o && pluginname != plugin.prototype.name) {
            this.opts = this.opts || {};
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
    $.sockets = $.sockets || {} ;

    // check if plugin already exists
    if ('object' == typeof $.sockets[proto]) return false;

    // create init function to call the global plugin
    $.sockets[proto] = $.sockets[proto] || {};
    $.sockets[proto][proto] = function(el,meth,opts) {
        // if method exists; execute it else execute init
        (meth) ? this.__execute(el,meth,opts) : this.__execute(el,false,opts);
    };

    // define the base prototype
    $.extend($.sockets[proto][proto].prototype, {  
      name: proto,
      __execute: function(el,meth,opts) {
        meth = (meth)?proto+'__'+meth:false;
        if (meth) {
          return $(el)[meth](el,opts);
        } else {
          // fire init function if no method is defined
          init = proto+'__init';
          if (!$.fn[init])  return console.info('Please provide a init method for the '+proto+' plugin.');
          return $(el)[init](el,opts);
        }
      }
    })  

    this.play(false,$.sockets[proto][proto]);
  }

  // run plugin function to make sure the plugin exist
  // gets cancled if it already exists
  this.socket(proto);

  // dont continue if only prototype should be created
  if (!name && !fn) return;

  // inform the user if name is not set
  if (!name || 'string' !== typeof name ) return console.info('Please provide a method name for the '+proto+' plugin.');

  // copy init function from the global plugin
  $.sockets[proto][name] = function (e) {
    if (e.opts){
        var opts        = e.opts[proto+'__'+name];
        this.opts       = (opts)?opts:{};
    }
    this.plugName = proto;
    this.el         = $(e);
    this.init()
  };

  // extend the prototype with passed functions
  $.extend($.sockets[proto][name].prototype, {
    name: name,
    init: function() {
      // inform the user that the init function has not changed
      console.info('Init function for the '+proto+' '+name+' method has not been set. Plugin may not behave as desired.')
    }
  },fn) // passed funtions

  this.play(proto,$.sockets[proto][name]);
}