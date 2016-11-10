(function (module, global, jquery, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var plugWrapper = function () {
        };
        if (global.document) {
            plugWrapper = factory(global, jquery);
        } else {
            plugWrapper = function (window) {
                if (!window.document) console.warn("plug.js -> plug requires a window with a document!");
                return factory(window, jquery);
            };
        }

        module.exports = plugWrapper;
    } else {
        factory(global, jquery);
    }

}("undefined" !== typeof module ? module : this, "undefined" !== typeof window ? window : this, "undefined" !== typeof jQuery ? jQuery : false, function (root, $) {


    /**
     * definition section
     *
     * here we define all properties which plug js needs to work
     */

    root.plug = function (definition) {
        if ("undefined" === typeof definition) console.warn("plug.js -> you need to pass a definition!");
        var name = definition.name;
        var plugin = root.plug.private.register(definition);
        root[name] = plugin;
        Node.prototype[name] = plugin;
        if ($) $.fn[name] = plugin;
    };

    plug.configs = {};
    plug.list = {};
    plug.private = {};
    plug.me = false; // the current instance within a method

    plug.private.register = function (definition) {
        var socket = new plug.private.socket(definition);
        return new plug.private.instance(socket);
    };


    /**
     * socket sections
     *
     * all functions that the socket needs
     */

    /**
     * the main prototype for a plugin
     * all necessary info to create a plugin is located here
     *
     * @param definition
     * @param socket
     * @returns {*}
     */
    plug.private.socket = function (definition, socket) {
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

    /**
     * just assigns the private object
     *
     * @param socket
     * @returns {*}
     */
    plug.private.socket.private = function (socket) {
        socket.private = {};
        return socket;
    };

    /**
     * checks if we extend another plugin
     * and if so it predefined the socket with the chosen plugin
     * also adds the extend plugin to the required plugins
     *
     * @param socket
     * @param definition
     * @returns {*}
     */
    plug.private.socket.extend = function (socket, definition) {
        if ("undefined" !== typeof definition) {
            if ("undefined" !== typeof definition.extends) {
                var target = plug.list[definition.extends];
                if ("undefined" !== typeof target) {
                    plug.private.required = target.name;
                    return target;
                } else {
                    console.warn("plug.js -> " + definition.name + ": cannot extend from " + definition.extend + ", because it's not defined!");
                }
            }
        }
        return socket;
    };

    /**
     * checks if we have any required plugins defined
     * or passed from the extend function
     *
     * @param socket
     * @param definition
     * @returns {*}
     */
    plug.private.socket.require = function (socket, definition) {

        definition.required = [];
        if ("undefined" !== typeof definition.require) {
            var plugins = definition.require;
            definition.required = ("object" === typeof plugins) ? plugins : "__string__";
            if ("__string__" === definition.required) {
                var spaces = /\s/.test(plugins);
                var commas = /,/.test(plugins);
                if (spaces) {
                    definition.required = plugins.split(" ");
                } else if (commas) {
                    definition.required = plugins.split(",");
                } else {
                    definition.required = [plugins];
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
                if ("undefined" === typeof plugin) console.warn("plug.js -> " + definition.name + ": requires " + name + "!");
            }
        }

        return socket;
    };

    /**
     * adds the current definition to our socket
     * mostly for convenience
     *
     * @param socket
     * @param definition
     * @returns {*}
     */
    plug.private.socket.definition = function (socket, definition) {
        socket.private.definition = definition;
        return socket;
    };

    /**
     * wraps all methods with events
     * before and after
     *
     * @param socket
     * @returns {*}
     */
    plug.private.socket.wrapMethods = function (socket) {
        for (var val in socket) {
            if (socket.hasOwnProperty(val)) {
                socket = plug.private.socket.updateMethod(socket, val);
            }
        }
        return socket;
    };

    /**
     * wraps a single method with events
     * also used in the modify module
     *
     * @param socket
     * @param method
     * @returns {*}
     */
    plug.private.socket.updateMethod = function (socket, method) {
        if ("function" === typeof socket[method]) {

            socket[method] = (function () {
                var cache = socket[method].plugFunctionCache || socket[method];
                var fn = function () {
                    plug.me = this;
                    plug.event.add(socket.name + "/" + method + "/before", plug.me);
                    var result = cache.apply(plug.me, arguments); // use .apply() to call it
                    plug.event.add(socket.name + "/" + method + "/after", plug.me);
                    return result;
                };
                fn.plugFunctionCache = cache;
                return fn;
            })();


        }
        return socket;
    };

    /**
     * registers the plugin in the global library
     *
     * @param socket
     * @returns {*}
     */
    plug.private.socket.register = function (socket) {
        plug.list[socket.name] = socket;
        return socket;
    };


    /**
     * instance sections
     *
     * all functions that the instance needs
     */

    /**
     * the instance is the function which
     * gets executed if we call the plugin
     * all options in it are unique expcept the methods
     * hence then name
     *
     * @param socket
     * @returns {Function}
     */
    plug.private.instance = function (socket) {
        return function () {
            var instance = plug.private.instance.create(socket);
            instance = plug.private.instance.getFunctions(instance, socket);
            instance = plug.private.instance.getElements(instance, this, arguments);
            instance = plug.private.instance.guid(instance);
            return plug.private.instance.function.apply(instance, arguments);
        };
    };

    /**
     * creates the actual function
     * it will be executed for each elements we find
     * we also gather all data attributes and configs per element
     *
     * @returns {boolean|*}
     */
    plug.private.instance.function = function () {
        var instance = this;
        plug.private.instance.applyArguments(instance, arguments);
        instance.__private.return = false;
        if (instance.__private.elements) {
            for (var el in instance.__private.elements) {
                if (instance.__private.elements.hasOwnProperty(el)) {
                    var elInstance = plug.private.helpers.copy(instance);
                    elInstance.el = elInstance.__private.elements[el];
                    if ($) {
                        elInstance.$el = $(elInstance.__private.elements[el]);
                        elInstance.$el.context = document;
                    }
                    plug.private.instance.dataAttributes(elInstance, "config");
                    plug.private.instance.applyConfig(elInstance);
                    plug.private.instance.dataAttributes(elInstance);
                    plug.private.instance.applyOpts(elInstance);
                    plug.private.instance.applyGuid(elInstance);
                    elInstance.__private.return = plug.private.instance.execute(elInstance);
                }
            }
        } else {
            instance.__private.return = plug.private.instance.execute(instance);
        }

        // execute all functions we pass via attributes
        for (var arg in arguments) {
            if (arguments.hasOwnProperty(arg)) {
                arg = arguments[arg];
                if ("function" === typeof arg) {
                    arg();
                }
            }
        }

        return instance.__private.return;
    };

    /**
     * the actual function execute
     * it will first return the method return if one is defined
     * than the elements
     * otherwise it will just return our instance
     *
     * @param instance
     * @returns {*}
     */
    plug.private.instance.execute = function (instance) {
        if ("function" === typeof instance[instance.__private.callee]) {
            instance.__private.return = instance[instance.__private.callee].apply(instance, arguments);
            if ("undefined" !== typeof instance.__private.return) {
                return instance.__private.return;
            } else if (instance.__private.originalElements) {
                return instance.__private.originalElements;
            } else {
                return instance;
            }
        } else {
            console.warn("plug.js -> " + instance.name + " has no " + instance.__private.callee + " method!");
        }
        return instance;
    };

    /**
     * this is a little magic trick to copy the socket
     * into our function
     * convert to array and then revert it back to json
     * since all methods will be lost in this process we add them back later
     *
     * @param socket
     */
    plug.private.instance.create = function (socket) {
        var instance = JSON.parse(JSON.stringify(socket));
        instance.__private = {};
        return instance;
    };

    /**
     * adds the methods which will be lost on the instance create
     *
     * @param instance
     * @param socket
     * @returns {*}
     */
    plug.private.instance.getFunctions = function (instance, socket) {
        for (var i in socket) {
            if (socket.hasOwnProperty(i)) {
                var fn = socket[i];
                if ("function" === typeof fn) {
                    instance[i] = socket[i];
                }
            }
        }
        return instance;
    };

    /**
     * adds all possible elements to the instance
     * from the arguments, jquery call or normal node calls
     *
     * @param instance
     * @param context
     * @param arguments
     * @returns {*}
     */
    plug.private.instance.getElements = function (instance, context, arguments) {
        var elements = false;
        var els = [];
        for (var arg in arguments) {
            if (arguments.hasOwnProperty(arg)) {
                arg = arguments[arg];
                if (arg instanceof Node) {
                    elements = [arg];
                    instance.__private.originalElements = arg;
                } else if ("undefined" !== typeof arg.context) {
                    if ($) {
                        $.each(context, function (k, v) {
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
                elements = [context];
                instance.__private.originalElements = context;
            } else if ("undefined" !== typeof context.context) {
                if ($) {
                    $.each(context, function (k, v) {
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

    /**
     * this creates a global unique identifier for our instance
     *
     * @param instance
     */
    plug.private.instance.guid = function (instance) {
        function guid(amount, guidString) {
            guidString = guidString || "";
            guidString += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            if (amount != 0) {
                amount--;
                return guid(amount, guidString)
            } else {
                return guidString;
            }
        }

        instance.guid = guid(5);
        return instance
    };

    /**
     * this is adding the function call arguments to our instance options
     * if one argument is a plain string it will be used as the method callee
     *
     * @param instance
     * @param args
     */
    plug.private.instance.applyArguments = function (instance, args) {
        instance.__private.callee = "init";
        for (var arg in args) {
            if (args.hasOwnProperty(arg)) {
                arg = args[arg];
                if ("object" === typeof arg) {
                    instance.opts = plug.private.helpers.transfer(instance.opts, arg);
                }
                if ("string" === typeof arg) {
                    instance.__private.callee = arg;
                }
            }
        }
    };

    /**
     * merges all data attributes into our instance opts object
     *
     * @param instance
     * @param selector
     * @returns {*}
     */
    plug.private.instance.dataAttributes = function (instance, selector) {
        var instanceName = instance.name.toLowerCase().replace(/-/ig, "");

        if ("undefined" === typeof instance.el.dataset) {
            instance.el.dataset = {};
            var attributes = instance.el.attributes;
            if ("undefined" !== typeof attributes) {
                var i = attributes.length;
                for (; i--;) {
                    if (/^data-.*/.test(attributes[i].name)) {
                        var dataAttribute = attributes[i];
                        var attrName = dataAttribute.name.replace("data-", "");

                        function toUpper(match) {
                            return match.toUpperCase().substring(1);
                        }

                        attrName = attrName.replace(/-(.)/, toUpper);
                        instance.el.dataset[attrName] = dataAttribute.value;
                    }
                }
            }
        }
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

    /**
     * creates an multidimensional object from an array
     *
     * @param obj
     * @param path
     * @param val
     * @param index
     * @returns {*}
     */
    plug.private.instance.deepCreateFromArray = function (obj, path, val, index) {
        if ("undefined" === typeof index) index = 0;
        if ("undefined" === typeof obj) obj = {};
        if ("object" !== typeof obj[path[index]]) obj[path[index]] = {};

        if ("undefined" !== typeof path[index + 1]) {
            obj = plug.private.instance.deepCreateFromArray(obj[path[index]], path, val, index + 1);
            return obj;
        } else {
            obj[path[index]] = val;
            return obj;
        }
    };

    /**
     * if we have an config option
     * we look for the matching config and overwrite the
     * options in our plugin with it
     *
     * @param instance
     * @returns {*}
     */
    plug.private.instance.applyConfig = function (instance) {
        if ("undefined" !== typeof instance.opts) {
            if ("string" === typeof instance.opts.config) {
                if ("undefined" === typeof plug.configs) plug.configs = {};
                var config = plug.configs[instance.name][instance.opts.config];
                if ("undefined" !== typeof config) {
                    instance.opts = plug.private.helpers.transfer(instance.opts, config);
                } else {
                    console.warn("plug.js -> can't find the config '" + instance.opts.config + "' for the plugin '" + instance.name + "'");
                }
            }
        }
        return instance;
    };

    /**
     * if we have an config option
     * we look for the matching config and overwrite the
     * options in our plugin with it
     *
     * @param instance
     * @returns {*}
     */
    plug.private.instance.applyOpts = function (instance) {
        if ("undefined" !== typeof instance.opts) {
            if ("undefined" !== typeof instance.opts.opts) {
                instance.opts = plug.private.helpers.transfer(instance.opts, instance.opts.opts);
                delete instance.opts.opts;
            }
        }
        return instance;
    };

    /**
     * adds a new guid if the selected element doesn't already have one
     *
     * @param instance
     * @returns {*}
     */
    plug.private.instance.applyGuid = function (instance) {
        instance.el.plug = instance.el.plug || {};
        instance.el.plug[instance.name] = instance.el.plug[instance.name] || {};
        instance.el.plug[instance.name].guid = instance.el.plug[instance.name].guid || plug.private.instance.guid(instance).guid;
        instance.guid = instance.el.plug[instance.name].guid;
        return instance;
    };


    /**
     * event section
     *
     * internal event handling functions of plug
     */

    /**
     * events storage objects
     * you can access all events ever fired in
     * plug.event.list
     *
     * @type {{}}
     */
    plug.event = {};
    plug.event.list = {};
    plug.private.event = {};

    /**
     * add/fire a new event
     *
     * @param name
     * @param context
     * @returns {*}
     */
    plug.event.add = function (name, context) {
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

    /**
     * subscribe to an event
     * this means the function oyu pass
     * will be executed when the event is fired
     *
     * i highly recommend to use namespaces to
     * freely delete events
     *
     * eg. myPlugin/init/before.myListener
     *
     * @param name
     * @param fn
     */
    plug.event.listen = function (name, fn) {
        var path = plug.private.event.getPath(name);
        plug.private.event.assign(plug.event.list, path, fn, 0);
    };

    /**
     * remove the event subscriber
     *
     * @param name
     */
    plug.event.remove = function (name) {
        var path = plug.private.event.getPath(name);
        plug.private.event.assign(plug.event.list, path, false, 0, true);
        plug.private.event.assign(plug.event.list, path, {}, 0);
    };

    /**
     * returns the path and namespace strings
     *
     * @param name
     * @returns {Array}
     */
    plug.private.event.getPath = function (name) {
        return name.split('.');
    };

    /**
     * adds the passed functions to the event list
     * key will be the event name with namespaces as sub object
     *
     * @param events
     * @param path
     * @param instance
     * @param count
     * @param remove
     */
    plug.private.event.assign = function (events, path, instance, count, remove) {
        if ("object" !== typeof events[path[count]]) {
            events[path[count]] = [];
        }
        if ("undefined" !== typeof path[count + 1]) {
            plug.private.event.assign(events[path[count]], path, instance, count + 1, remove);
        } else {
            if (remove) {
                delete events[path[count]];
            } else {
                if ("function" === typeof instance) {
                    events[path[count]].push(instance);
                }
            }

        }
    };

    /**
     * returns all functions in an event object as a flat array
     * regardless how deep the list is
     *
     * @param listeners
     * @param list
     * @returns {*}
     */
    plug.private.event.flatten = function (listeners, list) {
        if ("undefined" === typeof list) list = [];
        for (var instance in listeners) {
            if (listeners.hasOwnProperty(instance)) {
                if ("function" === typeof listeners[instance]) {
                    list.push(listeners[instance]);
                }
                if ("object" === typeof listeners[instance]) {
                    plug.private.event.flatten(listeners[instance], list);
                }
            }
        }
        return list;
    };

    /**
     * returns the current event list for the selected namespace
     *
     * @param path
     * @param listeners
     * @returns {*}
     */
    plug.private.event.getListeners = function (path, listeners) {
        var namespace = path[0];
        if (path.length > 0) {
            path.shift();
            listeners = plug.private.event.getListeners(path, listeners[namespace]);
        }
        return listeners;
    };


    /**
     * the modify section implements useful
     * tools to adjust the behavior afterwards
     */

    /**
     * the modify object to store fucntions
     *
     * @type {{}}
     */
    plug.private.modify = {};


    /**
     * delete all plugin trances
     *
     * @param name
     */
    plug.delete = function (name) {
        delete window[name];
        delete Node.prototype[name];
        if ($) delete $.fn[name];
        delete plug[name];
    };

    /**
     * copys a plugin with the given name
     *
     * @param from
     * @param to
     */
    plug.copy = function (from, to) {
        var source = plug.list[from];
        if (typeof source != "undefined") {
            source.name = to;
            plug(source);
        } else {
            console.warn("plug.js -> can't copy " + from + " because it doesn't exist!");
        }
    };

    /**
     * adds a new config to the defined plugin
     *
     * @param plugin
     * @param name
     * @param opts
     */
    plug.config = function (plugin, name, opts) {
        plug.configs[plugin] = plug.configs[plugin] || {};
        if (typeof opts != "object") console.warn("plug.js -> config must be type of object!");
        plug.configs[plugin][name] = opts;
    };

    /**
     * prepends a function to a method
     *
     * @param name
     * @param method
     * @param fn
     */
    plug.before = function (name, method, fn) {
        plug.private.modify("before", name, method, fn);
    };

    /**
     *  completely replaces a method
     *
     * @param name
     * @param method
     * @param fn
     */
    plug.replace = function (name, method, fn) {
        plug.private.modify("replace", name, method, fn);
    };

    /**
     * appends a function to a method
     * @param name
     * @param method
     * @param fn
     */
    plug.after = function (name, method, fn) {
        plug.private.modify("after", name, method, fn);
    };

    /**
     * this handles the before|replace|after functions
     * it simply reassigns the socket function with an extend one
     * all instances make use of those functions so we don't create
     * unnecessary garbage
     *
     * implements plug.private.socket.updateMethod
     *
     * @param type
     * @param name
     * @param methodname
     * @param fn
     */
    plug.private.modify = function (type, name, methodname, fn) {
        var plugin = plug.list[name];
        if (typeof plugin != "undefined") {
            var method = plugin[methodname];
            if (typeof method != "undefined") {

                if (type == "before") {
                    plug.list[name][methodname].plugFunctionCache = function () {
                        fn.apply(this, arguments);
                        return method.apply(this, arguments);
                    };
                }

                if (type == "replace") {
                    plug.list[name][methodname].plugFunctionCache = function () {
                        return fn.apply(this, arguments);
                    };
                }

                if (type == "after") {
                    plug.list[name][methodname].plugFunctionCache = function () {
                        method.apply(this, arguments);
                        return fn.apply(this, arguments);
                    };
                }

                plug.list[name] = plug.private.socket.updateMethod(plug.list[name], methodname);

                //plug(plugin);
            } else {
                console.warn("plug.js -> " + name + ": cannot " + type + " the method " + methodname + " because it doesn't exist!");
            }
        } else {
            console.warn("plug.js -> cannot modify the plugin " + name + " because it doesn't exist!");
        }

    };


    /**
     * some internals helpers
     */

    /**
     * helpers object to store functions
     *
     * @type {{}}
     */
    plug.private.helpers = {};


    /**
     * transfers one object into another
     * the original target will be lost
     * handle with care
     *
     * @param target
     * @param src
     * @return object
     */
    plug.private.helpers.transfer = function (target, src) {

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


    /**
     * converts a string value to
     * the representative type
     *
     * @param value
     * @returns {*}
     */
    plug.private.helpers.parseToVal = function (value) {
        if (typeof value == "string") {
            if (value !== "") {
                if (value === "true") {
                    value = true;
                } else if (value === "false") {
                    value = false;
                } else if ((value[0] === "{" && value[value.length - 1] === "}") || value[0] === "[" && value[1] === "{" && value[value.length - 2] === "}" && value[value.length - 1] === "]") {
                    value = plug.private.helpers.parseJson(value);
                } else if (/,/.test(value)) {
                    if (value[0] == "[") {
                        value = value.replace(/^\[/g, "");
                        value = value.replace(/\]$/g, "");
                        value = value.split(",");
                    }
                } else if (!/\[|\]/.test(value) && !/[a-zA-Z]/.test(value) && /[0-9]/.test(value)) {
                    if (/\./.test(value)) {
                        value = parseFloat(value);
                    } else {
                        value = parseInt(value);
                    }
                }
            }
        }
        return value;
    };

    /**
     * returns all object keys as an array
     *
     * @param array
     * @returns {Array}
     */
    plug.private.helpers.keys = function (array) {
        var keys = [];
        for (var key in array) {
            if (array.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return keys;
    };

    /**
     * copy a object
     *
     * @param obj
     * @returns {{}}
     */
    plug.private.helpers.copy = function (obj) {
        var object = {};
        for (var o in obj) {
            if (obj.hasOwnProperty(o)) {
                object[o] = obj[o];
            }
        }
        return object;
    };

    /**
     * converts a string to an object
     * @param data
     * @returns {string}
     */
    plug.private.helpers.parseJson = function (data) {
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
}));
