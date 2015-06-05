// callback !!
;(function ($) { 'use strict';

  $.plug = function(name,functions) {
    var name,functions;

    // main plug function
    var plug = function() {
      if(name) plug.proto();
    }

    // create protoype for the plugin
    plug.proto = function() {
      plug.fn(); // make function
      $.plug[name].prototype = {
        name: name,
        init: function() {
          console.error('Missing Init:','Plugin ('+name+') has no (init) function.')
          return false;
        }
      }
      $.extend($.plug[name].prototype,functions)
      $.plug[name].defaults = $.plug[name].prototype.defaults;
      plug.register();
    }

    // create base function
    plug.fn = function() {
      $.plug[name] = function(el, opts, callback) {
        this.el = el;
        this.$el = $(el);
        var inlinedata = plug.inlinedata(this.defaults,this.$el);
        this.opts = $.extend({}, this.defaults, opts, inlinedata);
      };
    }
    
    // register plugin in jquery library
    plug.register = function () {

      plug.registersubs();

      $.fn[name] = function(opts, callback, fallback) {
        if ('string' == typeof opts) {
          this.each(function() {
            $(this)[name+'_____'+opts](this,callback,fallback);
          });
          return this
        } else {
          this.each(function() {
            new $.plug[name](this, opts, callback).init();
            return plug.callback([opts,callback],this);
          });
          return this
        }
      };
    }

    // register plugin methods in jquery library
    plug.registersubs = function () {
      var temp = $.plug[name].prototype;
      for(var fn in temp){
        if ('function' == typeof temp[fn]) {
          $.fn[name+'_____'+fn] =  function (el,opts, callback) {
            new $.plug[name](el, opts, callback)[fn]();
            return plug.callback([opts,callback],el);
          }
        }
      }
      temp = void 0;
    }

    // returning inline data attributs as object
    plug.inlinedata = function(defaults,obj) {
      var data = {};
      for(var option in defaults){
        data[option] = obj.data(name.toLowerCase()+'-'+option)
      }
      return data;
    }

    plug.callback = function(callback,el) {
      for(var n in callback) {
        if ('function' == typeof callback[n]) { 
          (function(el) {
            this[name+'___callback'] = callback[n];
            this[name+'___callback']();
            delete this[name+'___callback'];
          }).call(el);
        }
      }
    }
    // override funtion
    $.plug.override = function (name,method,override) {
      if('undefined' == typeof $.plug[name].prototype[method]){
        console.error('Override Error:','Plugin ('+name+') has no ('+method+') function.');
        return false;
      }
      if (!$.plug[name].prototype[method].call()) return false;
      return $.plug[name].prototype[method] = override;
    }

    // execute plug
    plug();

  };

})(jQuery);