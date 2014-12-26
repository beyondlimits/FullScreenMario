module.exports = function (grunt) {
    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json"),
        "meta": {
            "deployPath": "dist"
        },
        "copy": {
            "default": {
                "files": [{
                    "src": "Sounds/**",
                    "dest": "<%= meta.deployPath %>/"
                }, {
                    "src": "Theme/**",
                    "dest": "<%= meta.deployPath %>/"
                }, {
                    "src": "Fonts/**",
                    "dest": "<%= meta.deployPath %>/"
                }]
            }
        },
        "concat": {
            "dist": {
                "src": [
                    "src/*.js",
                    "src/*/*.js",
                    "FullScreenMario.js",
                    "settings/*.js"
                ],
                "dest": "<%= meta.deployPath %>/FullScreenMario.js"
            }
        },
        "uglify": {
            "options": {
                "compress": true
            },
            "dist": {
                "files": {
                    "<%= meta.deployPath %>/FullScreenMario.min.js": ["<%= meta.deployPath %>/FullScreenMario.js"],
                    "<%= meta.deployPath %>/index.min.js": ["index.js"]
                }
            }
        },
        "cssmin": {
            "target": {
                "files": {
                    "<%= meta.deployPath %>/FullScreenMario.min.css": [
                        "Fonts/stylesheet.css",
                        "src/LevelEditr/LevelEditr.css"
                    ],
                    "<%= meta.deployPath %>/index.min.css": ["index.css"]
                }
            }
        },
        "processhtml": {
            "dist": {
                "files": {
                    "<%= meta.deployPath %>/index.html": ["index.html"]
                }
            }
        }
    });
    
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-processhtml");
    grunt.registerTask("default", [
        "copy", "concat", "uglify", "cssmin", "processhtml"
    ]);
};