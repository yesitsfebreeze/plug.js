/*
  plug.js
  Version: 1.0.0 2015-06-06
  http://hvlmnns.github.io/plug.js/
  The MIT License (MIT)
  Copyright (c) 2015 hvlmnns
*/

// dependencies !!

;(function ($) { 'use strict';
  $.pluglib = {}; // register library
  $.plug = function(name,functions) {
    var name,functions;
    // main plug function
    $.plug.js = function() {
      if(name) $.plug.js.proto();
    }
    $.plug.js.noop = function() {};

    // create prototype for the plugin
    $.plug.js.proto = function() {
      $.plug.js.fn(); // make function
      $.plug[name].prototype = {
        constructor: name,
        name: name,
        init: $.plug.js.noop()
      }
      $.extend(true,$.plug[name].prototype,functions)
      $.plug[name].defaults = $.plug[name].prototype.defaults;
      $.plug.js.register();
    }

    // create base function
    $.plug.js.fn = function() {
      $.plug[name] = function(el, opts, callback) {
        this.proto      = $.plug[name].prototype
        this.el        = el;
        this.$el       = $(el);
        var inlinedata = $.plug.js.inlinedata(this.defaults,this.$el);
        this.opts      = $.extend(true,{}, this.defaults, opts, inlinedata);
      };
    }
    
    // register plugin in jquery library
    $.plug.js.register = function () {
      var subs = $.plug.js.getsubs(name);
      $.plug.js.registersubs(subs);
      $.fn[name] = function(opts, callback, fallback) {
        if ('string' == typeof opts) {
          this.each(function() {
            $(this)[name+'__'+opts](this,callback,fallback);
          });
          return this
        } else {
          this.each(function() {
            new $.plug[name](this, opts, callback).init();
            return $.plug.js.callback([opts,callback],this);
          });
          return this
        }
      };
      $.pluglib[name] = $.plug[name].prototype;
    }

    // register plugin methods in jquery library
    $.plug.js.getsubs = function (name,all) {
      var temp = $.plug[name].prototype;
      var subs = {};
      for(var fn in temp){
        if (all) {
          subs[fn] = temp[fn];
        }else {
          if ('function' == typeof temp[fn]) {
            subs[fn] = temp[fn];
          }
        }
      }
      return subs;
    }

    $.plug.js.registersubs = function(subs) {
      for (var fn in subs) {
        $.fn[name+'__'+fn] =  function (el,opts, callback) {
          new $.plug[name](el, opts, callback)[fn]();
          return $.plug.js.callback([opts,callback],el);
        }
      }
    }

    // returning inline data attributs as object
    $.plug.js.inlinedata = function(defaults,obj) {
      var data = {};
      for(var option in defaults){
        data[option] = obj.data(name.toLowerCase()+'-'+option)
      }
      return data;
    }

    $.plug.js.callback = function(callback,el) {
      for(var n in callback) {
        if ('function' == typeof callback[n]) { 
          (function(el) {
            this[name+'__callback'] = callback[n];
            this[name+'__callback']();
            delete this[name+'__callback'];
          }).call(el);
        }
      }
    }
    
    // copy plugin
    $.plug.copy = function (name,copy) {
      var subs = $.plug.js.getsubs(name,true);
      $.plug(copy,subs);
      $.plug[copy].prototype.name        = copy;
      $.plug[copy].prototype.constructor = copy;
    }

    // replace funtion
    $.plug.replace = function (name,method,replace) {
      if ('function' == typeof $.plug[name].prototype[method]) {
        return $.plug[name].prototype[method] = replace;
      }
      throw new Error('\n$.plug.js:  Plugin ('+name+') has no ('+method+') function.')
    }

    $.plug.append = function (name,method,append) {
      $.plug.js.modify('append',name,method,append)
    }

    $.plug.prepend = function (name,method,prepend) {
      $.plug.js.modify('prepend',name,method,prepend)
    }

    $.plug.js.modify = function (type,name,method,fn) {
      if ('function' == typeof $.plug[name].prototype[method]) {
        var original = $.plug[name].prototype[method]
        if (type == 'append') {
          $.plug[name].prototype[method] = function () {
            original.call(this)
            fn.call(this)
          }
        } else if (type == 'prepend') {
          $.plug[name].prototype[method] = function () {
            fn.call(this)
            original.call(this)
          }
        }
        return;
      }
      throw new Error('\n$.plug.js - '+type+':  Plugin ('+name+') has no ('+method+') function.')
    }
    // execute plug
    $.plug.js();

  };

})(jQuery);