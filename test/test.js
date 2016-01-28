var elm = document.getElementById("blank");
var jq = typeof $ != "undefined";
/**
 * Basic Definition
 */
plug({
    name: "basicDefinition",
    opts: {
        option: "value"
    },
    init: function() {
        return "success"
    }
});


unittest("Basic Definition", typeof basicDefinition, "function");

/**
 * Function Call
 */
plug({
    name: "functionCall",
    opts: {
        option: "value"
    },
    init: function() {
        return "success"
    }
});

unittest("Function Call", functionCall(), "success");

/**
 * Node call
 */
plug({
    name: "nodeCall",
    opts: {
        option: "value"
    },
    init: function() {
        return "success"
    }
});
unittest("Node call", elm.nodeCall(), "success");

/**
 * jQuery call
 */
if(jq) {
    plug({
        name: "jqueryCall",
        opts: {
            option: "value"
        },
        init: function() {
            return "success"
        }
    });
    unittest("jQuery call", $(".testlist li").jqueryCall(), "success");
}

/**
 * instance testing
 */
plug({
    name: "instancetesting",
    init: function() {
        return plug.me;
    }
});
unittest("instance testing", instancetesting().name, "instancetesting");

/**
 * instance testing in a method
 */
plug({
    name: "instancetestinginamethod",
    init: function() {
        return plug.me.method();
    },
    method: function() {
        return plug.me;
    }
});
unittest("instance testing in a method", instancetestinginamethod().name, "instancetestinginamethod");

/**
 * jQuery element chaining
 */
if(jq) {
    plug({
        name: "jqueryelementchaining",
        opts: {
            option: "value"
        },
        init: function() {
        }
    });
    var el = $(".testlist li");
    unittest("jQuery element chaining", el.jqueryelementchaining(), el);
}

/**
 * Node Element Chaining
 */
plug({
    name: "nodeelementchaining",
    opts: {
        option: "value"
    },
    init: function() {
    }
});

unittest("Node Element Chaining", elm.nodeelementchaining(), elm);


/**
 * Plugin Delete
 */
plug({
    name: "plugindelete",
    opts: {
        option: "value"
    },
    init: function() {}
});

plug.delete("plugindelete");
unittest("plugin delete", typeof plugindelete, "undefined");

/**
 * Copy Plugin
 */
plug({
    name: "copyplugin",
    init: function() {
        return true;
    }
});

plug.copy("copyplugin", "copycopyocpy");
unittest("Copy Plugin", typeof copycopyocpy, "function");


/**
 * Extend Plugin
 */
plug({
    name: "extendsource",
    opts: {
        object: false
    },
    method: function() {
        this.test();
    }
});

plug({
    name: "extendtestplugin",
    extends: "extendsource",
    opts: {
        object: false
    },
    init: function() {
        return "extended";
    }
});

unittest("Extend Plugin", extendtestplugin(), "extended");


/**
 * Function Return
 */
plug({
    name: "functionreturn",
    init: function() {
        return "return value";
    }
});
unittest("Function Return", functionreturn(), "return value");

/**
 * Node Return
 */
plug({
    name: "plugtest",
    init: function() {
        // we cant return here
    }
});
unittest("Node Return", plugtest(elm) instanceof Node, true);

/**
 * Method Usage
 */
plug({
    name: "methodusage",
    init: function() {
        return "hello";
    },
    method: function() {
        return "world";
    }
});
unittest("method usage", methodusage("method"), "world");

/**
 * Insert Function Before Method
 */
plug({
    name: "insertfunctionbeforemethod",
    init: function() {
        return this.method();
    },
    method: function() {
        return this.returnval;

    }
});
plug.before("insertfunctionbeforemethod", "method", function() {
    this.returnval = "test";
})
unittest("Insert Function Before Method", insertfunctionbeforemethod(), "test");

/**
 * Replace Method
 */
plug({
    name: "replacemethod",
    init: function() {
        return this.method();
    },
    method: function() {
        return "hallo";
    }
});
plug.replace("replacemethod", "method", function() {
    return "test";
})

unittest("Replace Method", replacemethod(), "test");


/**
 * Insert Function After Method
 */
plug({
    name: "insertfunctionaftermethod",
    init: function() {
        return this.method();
    },
    method: function() {
        this.returnval = "test";
    }
});
plug.after("insertfunctionaftermethod", "method", function() {
    return this.returnval;
})
unittest("Insert Function After Method", insertfunctionaftermethod(), "test");


/**
 * passing settings between methods
 */
plug({
    name: "passingsettings",
    opts: {
        option: "value"
    },
    init: function() {
        var me = this;
        me.method();
        return me.setting;
    },
    method: function() {
        var me = this;
        me.setting = true;
    }
});
unittest("passing settings between methods", passingsettings(), true);

/**
 * With and without config
 */
plug({
    name: "configplugin",
    opts: {
        option: false
    },
    init: function() {
        return this.opts.option
    }
});
plug.config("configplugin", "testconfig", {
    option: true
})
unittest("With Config", configplugin({config: "testconfig"}), true);
unittest("Without Config ", configplugin(), false);

/**
 * config data attribute
 */
plug({
    name: "configplugin",
    opts: {
        option: "value"
    },
    init: function() {
        return this.opts.option;
    }
});
unittest("config data attribute", $(".configtester").configplugin(), true);


/**
 * config data attribute
 */
plug({
    name: "optstester",
    opts: {
        option: "value"
    },
    init: function() {
        return this.opts.option;
    }
});
unittest("opts data attribute", $(".optstester").optstester(), true);

/**
 * config data attribute
 */
plug({
    name: "configplugin",
    opts: {
        option: "value"
    },
    init: function() {
        return this.opts.option;
    }
});
unittest("config not found", configplugin({config: "remove"}), "value");

/**
 * event testing
 */
plug({
    name: "eventtester",
    init: function() {}
});
var temp = false;
plug.event.listen("eventtester/init/before.namepsace", function() {
    temp = true;
});

/**
 * event list assignment
 */
unittest("event list assignment", (plug.private.event.flatten(plug.event.list["eventtester/init/before"]).length > 0), true);

/**
 * init event before
 */
eventtester();
unittest("init event before", temp, true);


/**
 * event list remove
 */
plug.event.remove("eventtester/init/before.namepsace");
unittest("event list remove", plug.private.event.flatten(plug.event.list["eventtester/init/before"]).length, 0);


/**
 * init event after - namespaced
 */
plug({
    name: "eventtester",
    init: function() {}
});
var temp = false;
plug.event.listen("eventtester/init/after.namepsace", function() {
    temp = true;
});
eventtester();
unittest("init event after - namespaced", temp, true);
plug.event.remove("eventtester/init/after.namepsace");


/**
 * method event before
 */
plug({
    name: "eventtester",
    init: function() {
        this.method();
    },
    method: function() {}
});
var temp = false;
plug.event.listen("eventtester/method/before", function() {
    temp = true;
});
eventtester();
unittest("method event before", temp, true);

/**
 * method event after
 */
plug({
    name: "eventtester",
    init: function() {
        this.method();
    },
    method: function() {}
});
var temp = false;
plug.event.listen("eventtester/method/after", function() {
    temp = true;
});
eventtester();
unittest("method event after", temp, true);


/**
 * overriding config settings
 */
plug({
    name: "configplugin",
    opts: {
        option: "value"
    },
    init: function() {
        var me = this;
        me.method();
        return me.opts.option;
    },
    method: function() {
        var me = this;
        me.opts.option = false;
    }
});

unittest("overriding config settings", configplugin({config: "testconfig"}), false);


/**
 * special plugin names deep assign
 */
plug({
    name: "this-is-my-plugin",
    opts: {
        this: {
            is: {
                myUppercaseOption: true
            }
        }
    },
    init: function() {
        var me = this;
        me.method();
        return me.opts.option;
    },
    method: function() {
        var me = this;
        me.opts.option = false;
    }
});

unittest("Uppercase data attribute deep assignment", $(".specialname")["this-is-my-plugin"](), false);


/**
 * data attribute deep assignment
 */
plug({
    name: "configplugin",
    opts: {
        this: {
            is: {
                my: {
                    option: false
                }
            }
        }
    },
    init: function() {
        return this.opts.this.is.my.option;
    }
});
unittest("data attribute deep assignment", $(".deepdata").configplugin(), true);


/**
 * uppercase option data attribute assignment
 */
plug({
    name: "configplugin",
    opts: {
        myUppercaseOption: false
    },
    init: function() {
        return this.opts.myUppercaseOption;
    }
});
unittest("uppercase option data attribute assignment", $(".uppercasedata").configplugin(), true);


/**
 * number option data attribute assignment
 */
plug({
    name: "configplugin",
    opts: {
        number: false
    },
    init: function() {
        return this.opts.number;
    }
});
unittest("number option data attribute assignment", $(".numberdata").configplugin(), 123);


/**
 * float option data attribute assignment
 */
plug({
    name: "configplugin",
    opts: {
        float: false
    },
    init: function() {
        return this.opts.float;
    }
});
unittest("float option data attribute assignment", $(".floatdata").configplugin(), 08.15);


/**
 * float comma option data attribute assignment
 */
plug({
    name: "configplugin",
    opts: {
        float: false
    },
    init: function() {
        return this.opts.float;
    }
});
unittest("float option data attribute assignment", $(".floatcommadata").configplugin()[0], [8,15][0]);


/**
 * object option data attribute assignment
 */
plug({
    name: "configplugin",
    opts: {
        object: false
    },
    init: function() {
        return this.opts.object;
    }
});
unittest("object option data attribute assignment", $(".objectdata").configplugin().data, true);


/**
 * array option data attribute assignment
 */
plug({
    name: "configplugin",
    opts: {
        array: false
    },
    init: function() {
        return this.opts.array;
    }
});
var testarray = [1, 2, 3, 4];
unittest("array option data attribute assignment", $(".arraydata").configplugin()[0], testarray[0]);


var hasError = false;
plug({
    name: "require1",
    opts: {
        object: false
    },
    init: function() {
        return this.opts.object;
    }
});

plug({
    name: "require2",
    opts: {
        object: false
    },
    init: function() {
        return this.opts.object;
    }
});

/**
 * require plugin - fail
 */
try {
    plug({
        name: "requirepluginfail",
        require: "notfound",
        opts: {
            object: false
        },
        init: function() {
            return this.opts.object;
        }
    });
} catch(error) {
    hasError = true;
}
unittest("require plugin - fail", hasError, true);


/**
 * require plugin - string single
 */
hasError = false;
try {
    plug({
        name: "requirepluginstringsingle",
        require: "require1",
        opts: {
            object: false
        },
        init: function() {
            return this.opts.object;
        }
    });
} catch(error) {
    hasError = true;
}
unittest("require plugin - string single", hasError, false);

/**
 * require plugin - string space seperated
 */
hasError = false;
try {
    plug({
        name: "requirepluginstringspaceseperated",
        require: "require1 require2",
        opts: {
            object: false
        },
        init: function() {
            return this.opts.object;
        }
    });
} catch(error) {
    hasError = true;
}
unittest("require plugin - string space seperated", hasError, false);

/**
 * require plugin - string comma seperated
 */
hasError = false;
try {
    plug({
        name: "requirepluginstringcommaseperated",
        require: "require1,require2",
        opts: {
            object: false
        },
        init: function() {
            return this.opts.object;
        }
    });
} catch(error) {
    hasError = true;
}
unittest("require plugin - string comma seperated", hasError, false);

/**
 * require plugin - array
 */
hasError = false;
try {
    plug({
        name: "requirepluginarray",
        require: ["require1", "require2"],
        opts: {
            object: false
        },
        init: function() {
            return this.opts.object;
        }
    });
} catch(error) {
    hasError = true;
}
unittest("require plugin - array", hasError, false);


/**
 * require plugin - object
 */
hasError = false;


try {
    plug({
        name: "requirepluginobject",
        require: {
            1: "require1",
            2: "require2"
        },
        opts: {
            object: false
        },
        init: function() {
            return this.opts.object;
        }
    });
} catch(error) {
    hasError = true;
}
unittest("require plugin - object", hasError, false);


/**
 * Timeout Execution
 */
plug({
    name: "timeoutexecution",
    opts: {
        object: false
    },
    init: function() {
        window.timeout = false;
        var me = this;
        setTimeout(function() {
            me.setTime();
        }, 500);
    },
    setTime: function() {
        window.timeout = true;
    }
});
timeoutexecution();
setTimeout(function() {
    unittest("Timeout Execution", window.timeout, true);
    window.timeout = false;
}, 500);


/**
 * multiple plugins
 */
plug({
    name: "plugtestone",
    init: function() {
        return "one";
    }
});
plug({
    name: "plugtesttwo",
    init: function() {
        return "two";
    }
});
plug({
    name: "plugtestthree",
    init: function() {
        return "three";
    }
});

unittest("multiple plugins execution", plugtestthree() + plugtesttwo() + plugtestone(), "threetwoone");