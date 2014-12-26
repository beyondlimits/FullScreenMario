module.exports = function (grunt) {
    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json"),
        "meta": {
            "deployPath": "dist/"
        },
        "concat": {
            "options": {
                "banner": "/**\r\n * " + [
                        "<%= pkg.name %> - v<%= pkg.version %> ",
                        "Generated on <%= grunt.template.today('yyyy-mm-dd') %>",
                    ].join("\r\n * ") + "\r\n */\r\n"
            },
            "dist": {
                "src": [
                    "src/*.js",
                    "src/*/*.js",
                    "FullScreenMario.js",
                    "settings/*.js"
                ],
                "dest": "<%= meta.deployPath %>FullScreenMario.js"
            }
        },
        "uglify": {
            "options": {
                "compress": true,
                "banner": "/**\r\n * " + [
                        "<%= pkg.name %> - v<%= pkg.version %> ",
                        "Generated on <%= grunt.template.today('yyyy-mm-dd') %>",
                    ].join("\r\n * ") + "\r\n */\r\n"
            },
            "dist": {
                "src": "<%= meta.deployPath %>FullScreenMario.js",
                "dest": "<%= meta.deployPath %>FullScreenMario.min.js"
            }
        },
    });
    
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.registerTask("default", ["concat", "uglify"]);
};