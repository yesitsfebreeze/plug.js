/**

    Plug.js
    A Javascript plugin manager
    Version: 1.0.0 2016-01-28
    author: Stefan Hövelmanns
    sayhello@hvlmnns.de
    The MIT License (MIT)
    Copyright (c) 2016 hvlmnns
    

    Todo: none
    
**/
    
(function(module, global, jquery, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var plugWrapper = function() {};
        if (global.document) {
            plugWrapper = factory(global, jquery);
        } else {
            plugWrapper = function(window) {
                if (!window.document) throw new Error("plug.js -> plug requires a window with a document!");
                return factory(window, jquery);
            };
        }
        module.exports = plugWrapper;
    } else {
        factory(global, jquery);
    }
})(typeof module !== "undefined" ? module : this, typeof window !== "undefined" ? window : this, typeof jQuery !== "undefined" ? jQuery : false, function(root, $) {
    root.plug = function(definition) {
        if (typeof definition == "undefined") throw new Error("plug.js -> you need to pass a definition!");
        var name = definition.name;
        var plugin = root.plug.private.register(definition);
        root[name] = plugin;
        Node.prototype[name] = plugin;
        if ($) $.fn[name] = plugin;
    };
    plug.configs = {};
    plug.list = {};
    plug.private = {};
    plug.me = false;
    plug.private.register = function(definition) {
        var socket = new plug.private.socket(definition);
        return new plug.private.instance(socket);
    };
    plug.private.socket = function(definition, socket) {
        if (!socket) socket = {};
        socket = plug.private.socket.private(socket);
        socket = plug.private.socket.extend(socket, definition);
        socket = plug.private.socket.require(socket, definition);
        socket = plug.private.helpers.transfer(socket, definition);
        socket = plug.private.socket.definition(socket, definition);
        socket = plug.private.socket.wrapMethods(socket);
        plug.list[socket.name] = socket;
        return socket;
    };
    plug.private.socket.private = function(socket) {
        socket.private = {};
        return socket;
    };
    plug.private.socket.extend = function(socket, definition) {
        if (typeof definition.extends != "undefined") {
            var target = plug.list[definition.extends];
            if (typeof target != "undefined") {
                plug.private.required = target.name;
                return target;
            } else {
                throw new TypeError("plug.js -> " + definition.name + ": cannot extend from " + definition.extend + ", because it's not defined!");
            }
        }
        return socket;
    };
    plug.private.socket.require = function(socket, definition) {
        definition.required = [];
        if (typeof definition.require != "undefined") {
            var plugins = definition.require;
            definition.required = typeof plugins == "object" ? plugins : "__string__";
            if (definition.required == "__string__") {
                var spaces = /\s/.test(plugins);
                var commas = /,/.test(plugins);
                if (spaces) {
                    definition.required = plugins.split(" ");
                } else if (commas) {
                    definition.required = plugins.split(",");
                } else {
                    definition.required = [ plugins ];
                }
            }
        }
        if (plug.private.required) {
            definition.required.push(plug.private.required);
            delete plug.private.required;
        }
        for (var name in definition.required) {
            if (definition.required.hasOwnProperty(name)) {
                name = definition.required[name];
                var plugin = plug.list[name];
                if (typeof plugin == "undefined") throw new TypeError("plug.js -> " + definition.name + ": requires " + name + "!");
            }
        }
        return socket;
    };
    plug.private.socket.definition = function(socket, definition) {
        socket.private.definition = definition;
        return socket;
    };
    plug.private.socket.wrapMethods = function(socket) {
        for (var val in socket) {
            if (socket.hasOwnProperty(val)) {
                socket = plug.private.socket.updateMethod(socket, val);
            }
        }
        return socket;
    };
    plug.private.socket.updateMethod = function(socket, method) {
        if (typeof socket[method] == "function") {
            socket[method] = function() {
                var cache = socket[method].plugFunctionCache || socket[method];
                var fn = function() {
                    plug.me = this;
                    plug.event.add(socket.name + "/" + method + "/before", plug.me);
                    var result = cache.apply(plug.me, arguments);
                    plug.event.add(socket.name + "/" + method + "/after", plug.me);
                    return result;
                };
                fn.plugFunctionCache = cache;
                return fn;
            }();
        }
        return socket;
    };
    plug.private.socket.register = function(socket) {
        plug.list[socket.name] = socket;
        return socket;
    };
    plug.private.instance = function(socket) {
        return function() {
            var instance = plug.private.instance.create(socket);
            instance = plug.private.instance.getFunctions(instance, socket);
            instance = plug.private.instance.getElements(instance, this, arguments);
            instance = plug.private.instance.guid(instance);
            return plug.private.instance.function.apply(instance, arguments);
        };
    };
    plug.private.instance.function = function() {
        var instance = this;
        plug.private.instance.applyArguments(instance, arguments);
        instance.__private.return = false;
        if (instance.__private.elements) {
            for (var el in instance.__private.elements) {
                if (instance.__private.elements.hasOwnProperty(el)) {
                    instance.el = instance.__private.elements[el];
                    if ($) {
                        instance.$el = $(instance.__private.elements[el]);
                        instance.$el.context = document;
                    }
                    plug.private.instance.dataAttributes(instance, "config");
                    plug.private.instance.applyConfig(instance);
                    plug.private.instance.dataAttributes(instance);
                    plug.private.instance.applyOpts(instance);
                    instance = plug.private.instance.guid(instance);
                    instance.__private.return = plug.private.instance.execute(instance);
                }
            }
        } else {
            instance.__private.return = plug.private.instance.execute(instance);
        }
        return instance.__private.return;
    };
    plug.private.instance.execute = function(instance) {
        if (typeof instance[instance.__private.callee] == "function") {
            instance.__private.return = instance[instance.__private.callee].apply(instance, arguments);
            if (typeof instance.__private.return != "undefined") {
                return instance.__private.return;
            } else if (instance.__private.originalElements) {
                return instance.__private.originalElements;
            } else {
                return instance;
            }
        } else {
            throw new TypeError("plug.js -> " + instance.name + " has no " + instance.__private.callee + " method!");
        }
        return instance;
    };
    plug.private.instance.create = function(socket) {
        var instance = JSON.parse(JSON.stringify(socket));
        instance.__private = {};
        return instance;
    };
    plug.private.instance.getFunctions = function(instance, socket) {
        for (var i in socket) {
            if (socket.hasOwnProperty(i)) {
                var fn = socket[i];
                if (typeof fn == "function") {
                    instance[i] = socket[i];
                }
            }
        }
        return instance;
    };
    plug.private.instance.getElements = function(instance, context, arguments) {
        var elements = false;
        var els = [];
        for (var arg in arguments) {
            if (arguments.hasOwnProperty(arg)) {
                arg = arguments[arg];
                if (arg instanceof Node) {
                    elements = [ arg ];
                    instance.__private.originalElements = arg;
                } else if (typeof arg.context != "undefined") {
                    if ($) {
                        $.each(context, function(k, v) {
                            els.push(v);
                        });
                        elements = els;
                    }
                    instance.__private.originalElements = arg;
                }
            }
        }
        if (!elements) {
            if (context instanceof Window || context instanceof Node) {
                elements = [ context ];
                instance.__private.originalElements = context;
            } else if (typeof context.context != "undefined") {
                if ($) {
                    $.each(context, function(k, v) {
                        els.push(v);
                    });
                    elements = els;
                }
                instance.__private.originalElements = context;
            }
        }
        instance.__private.elements = elements;
        return instance;
    };
    plug.private.instance.guid = function(instance) {
        function guid(amount, guidString) {
            guidString = guidString || "";
            guidString += Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
            if (amount != 0) {
                amount--;
                return guid(amount, guidString);
            } else {
                return guidString;
            }
        }
        instance.guid = guid(5);
        return instance;
    };
    plug.private.instance.applyArguments = function(instance, args) {
        instance.__private.callee = "init";
        for (var arg in args) {
            if (args.hasOwnProperty(arg)) {
                var arg = args[arg];
                if (typeof arg == "object") {
                    instance.opts = plug.private.helpers.transfer(instance.opts, arg);
                }
                if (typeof arg == "string") {
                    instance.__private.callee = arg;
                }
            }
        }
    };
    plug.private.instance.dataAttributes = function(instance, selector) {
        var instanceName = instance.name.toLowerCase().replace(/-/gi, "");
        var data = instance.el.dataset;
        if (data) {
            var settings = {};
            for (var name in data) {
                if (data.hasOwnProperty(name)) {
                    var value = data[name];
                    var related = name.toLowerCase().substr(0, instanceName.length) == instanceName;
                    if (related) {
                        var path = name.substr(instanceName.length).replace(/([A-Z])/g, ".$1").toLowerCase().slice(1).split(".");
                        if (path[0] != "") {
                            if (selector && path[0] == selector) {
                                plug.private.instance.deepCreateFromArray(settings, path, value);
                            } else {
                                plug.private.instance.deepCreateFromArray(settings, path, value);
                            }
                        }
                    }
                }
            }
            instance.opts = plug.private.helpers.transfer(instance.opts, settings);
        }
        return instance;
    };
    plug.private.instance.deepCreateFromArray = function(obj, path, val, index) {
        if (typeof index == "undefined") index = 0;
        if (typeof obj == "undefined") obj = {};
        if (typeof obj[path[index]] != "object") obj[path[index]] = {};
        if (typeof path[index + 1] != "undefined") {
            obj = plug.private.instance.deepCreateFromArray(obj[path[index]], path, val, index + 1);
            return obj;
        } else {
            obj[path[index]] = val;
            return obj;
        }
    };
    plug.private.instance.applyConfig = function(instance) {
        if (typeof instance.opts != "undefined") {
            if (typeof instance.opts.config == "string") {
                if (typeof plug.configs == "undefined") plug.configs = {};
                var config = plug.configs[instance.name][instance.opts.config];
                if (typeof config != "undefined") {
                    instance.opts = plug.private.helpers.transfer(instance.opts, config);
                } else {
                    console.warn("plug.js -> can't find the config '" + instance.opts.config + "' for the plugin '" + instance.name + "'");
                }
            }
        }
        return instance;
    };
    plug.private.instance.applyOpts = function(instance) {
        if (typeof instance.opts != "undefined") {
            if (typeof instance.opts.opts != "undefined") {
                instance.opts = plug.private.helpers.transfer(instance.opts, instance.opts.opts);
                delete instance.opts.opts;
            }
        }
        return instance;
    };
    plug.event = {};
    plug.event.list = {};
    plug.private.event = {};
    plug.event.add = function(name, context) {
        var path = plug.private.event.getPath(name);
        plug.private.event.assign(plug.event.list, path, {}, 0);
        var listeners = plug.private.event.getListeners(path, plug.event.list);
        var list = plug.private.event.flatten(listeners);
        for (var instance in list) {
            if (list.hasOwnProperty(instance)) {
                list[instance].apply(context);
            }
        }
        return context;
    };
    plug.event.listen = function(name, fn) {
        var path = plug.private.event.getPath(name);
        plug.private.event.assign(plug.event.list, path, fn, 0);
    };
    plug.event.remove = function(name) {
        var path = plug.private.event.getPath(name);
        plug.private.event.assign(plug.event.list, path, false, 0, true);
        plug.private.event.assign(plug.event.list, path, {}, 0);
    };
    plug.private.event.getPath = function(name) {
        var namespaces = name.split(".");
        return namespaces;
    };
    plug.private.event.assign = function(events, path, instance, count, remove) {
        if (typeof events[path[count]] != "object") {
            events[path[count]] = [];
        }
        if (path[count + 1] != undefined) {
            plug.private.event.assign(events[path[count]], path, instance, count + 1, remove);
        } else {
            if (remove) {
                delete events[path[count]];
            } else {
                if (typeof instance == "function") {
                    events[path[count]].push(instance);
                }
            }
        }
    };
    plug.private.event.flatten = function(listeners, list) {
        if (typeof list == "undefined") list = [];
        for (var instance in listeners) {
            if (listeners.hasOwnProperty(instance)) {
                if (typeof listeners[instance] == "function") {
                    list.push(listeners[instance]);
                }
                if (typeof listeners[instance] == "object") {
                    plug.private.event.flatten(listeners[instance], list);
                }
            }
        }
        return list;
    };
    plug.private.event.getListeners = function(path, listeners) {
        var namespace = path[0];
        if (path.length > 0) {
            path.shift();
            listeners = plug.private.event.getListeners(path, listeners[namespace]);
        }
        return listeners;
    };
    plug.private.modify = {};
    plug.delete = function(name) {
        delete window[name];
        delete Node.prototype[name];
        if ($) delete $.fn[name];
        delete plug[name];
    };
    plug.copy = function(from, to) {
        var source = plug.list[from];
        if (typeof source != "undefined") {
            source.name = to;
            plug(source);
        } else {
            throw new TypeError("plug.js -> can't copy " + from + " because it doesn't exist!");
        }
    };
    plug.config = function(plugin, name, opts) {
        plug.configs[plugin] = plug.configs[plugin] || {};
        if (typeof opts != "object") throw new TypeError("plug.js -> config must be type of object!");
        plug.configs[plugin][name] = opts;
    };
    plug.before = function(name, method, fn) {
        plug.private.modify("before", name, method, fn);
    };
    plug.replace = function(name, method, fn) {
        plug.private.modify("replace", name, method, fn);
    };
    plug.after = function(name, method, fn) {
        plug.private.modify("after", name, method, fn);
    };
    plug.private.modify = function(type, name, methodname, fn) {
        var plugin = plug.list[name];
        if (typeof plugin != "undefined") {
            var method = plugin[methodname];
            if (typeof method != "undefined") {
                if (type == "before") {
                    plug.list[name][methodname].plugFunctionCache = function() {
                        fn.apply(this, arguments);
                        return method.apply(this, arguments);
                    };
                }
                if (type == "replace") {
                    plug.list[name][methodname].plugFunctionCache = function() {
                        return fn.apply(this, arguments);
                    };
                }
                if (type == "after") {
                    plug.list[name][methodname].plugFunctionCache = function() {
                        method.apply(this, arguments);
                        return fn.apply(this, arguments);
                    };
                }
                plug.list[name] = plug.private.socket.updateMethod(plug.list[name], methodname);
            } else {
                throw new TypeError("plug.js -> " + name + ": cannot " + type + " the method " + methodname + " because it doesn't exist!");
            }
        } else {
            throw new TypeError("plug.js -> cannot modify the plugin " + name + " because it doesn't exist!");
        }
    };
    plug.private.helpers = {};
    plug.private.helpers.transfer = function(target, src) {
        var copy = plug.private.helpers.copy(target);
        for (var val in src) {
            if (src.hasOwnProperty(val)) {
                var value = plug.private.helpers.parseToVal(src[val]);
                var uppercase = plug.private.helpers.keys(target);
                key = val;
                for (var i in uppercase) {
                    var name = uppercase[i];
                    if (name.toLowerCase() == val) {
                        var key = name;
                    }
                }
                if (typeof copy[key] == "undefined") {
                    copy[key] = value;
                } else {
                    if (!!copy[key] && typeof copy[key] === "object") {
                        if (copy[key] instanceof Node) {
                            copy[key] = value;
                        } else {
                            copy[key] = plug.private.helpers.transfer(copy[key], value);
                        }
                    } else {
                        copy[key] = value;
                    }
                }
            }
        }
        return copy;
    };
    plug.private.helpers.parseToVal = function(value) {
        if (typeof value == "string") {
            if (value !== "") {
                if (value === "true") {
                    value = true;
                } else if (value === "false") {
                    value = false;
                } else if (/\,/.test(value)) {
                    value = value.split(",");
                } else if (!/\[|\]/.test(value) && !/[a-zA-Z]/.test(value) && /[0-9]/.test(value)) {
                    if (/\./.test(value)) {
                        value = parseFloat(value);
                    } else {
                        value = parseInt(value);
                    }
                } else if (value[0] === "{" && value[value.length - 1] === "}") {
                    value = plug.private.helpers.parseJson(value);
                }
            }
        }
        return value;
    };
    plug.private.helpers.keys = function(array) {
        var keys = [];
        for (var key in array) {
            if (array.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return keys;
    };
    plug.private.helpers.copy = function(obj) {
        var object = {};
        for (var o in obj) {
            if (obj.hasOwnProperty(o)) {
                object[o] = obj[o];
            }
        }
        return object;
    };
    plug.private.helpers.parseJson = function(data) {
        if ($) {
            return $.parseJSON(data);
        } else {
            if (window.JSON && window.JSON.parse) {
                return window.JSON.parse(data + "");
            } else {
                return "this device cannot parse json";
            }
        }
    };
});