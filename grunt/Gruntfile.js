module.exports = function(grunt) {

    var src = "../development/plug.js";
    var full = "../production/plug.js";
    var min = "../production/plug.min.js";


    var banner = [];
    banner.push("/**\n");
    banner.push("<%= pkg.name %>.js");
    banner.push("A Javascript plugin manager");
    banner.push("Version: <%= pkg.version %> <%= grunt.template.today('yyyy-mm-dd') %>");
    banner.push("author: <%= pkg.author %>");
    banner.push("<%= pkg.mail %>");
    banner.push("The MIT License (MIT)")
    banner.push("Copyright (c) <%= grunt.template.today('yyyy') %> hvlmnns");
    banner.push("\n");
    banner.push("Todo: <%= pkg.todos %>");
    banner.push("\n**/");
    banner.push("\n");
    banner = banner.join("\n    ");

    var js = {
        full: {},
        min: {}
    };
    js["full"][full] = src;
    js["min"][min] = src;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            full: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true,
                    sourceMap: false,
                    banner: banner
                },
                files: js.full
            },
            min: {
                options: {
                    mangle: true,
                    compress: true,
                    beautify: false,
                    sourceMap: true,
                    banner: banner
                },
                files: js.min
            }
        },
        watch: {
            gruntfile: {
                reload: true,
                files: ["Gruntfile.js"],
                tasks: ['uglify']
            },
            js: {
                files: [
                    "../development/**/*.js"
                ],
                tasks: ['uglify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ["uglify", 'watch']);

}
