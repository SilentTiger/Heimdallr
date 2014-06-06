module.exports = function(grunt){

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %> */\n'
            },
            build: {
                src: './WebServer/public/release/concat.js',
                dest: './WebServer/public/release/all.js'
            }
        },
        concat: {
            js: {
                src: ['./WebServer/public/js/jquery-2.1.0.min.js',
                        './WebServer/public/js/jquery.gridster.js',
                        './WebServer/public/js/common.js'],
                dest: './WebServer/public/release/concat.js'
            },
            css: {
                src: ['./WebServer/public/css/cssreset-min.css',
                        './WebServer/public/css/normalize.css',
                        './WebServer/public/css/jquery.gridster.css'],
                dest: './WebServer/public/release/concat.css'
            },
            options: {
                separator: ';',
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %> */\n'
            }
        },
        jshint: {
            all: ['./WebServer/public/js/common.js']
        },
        cssmin: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %> */\n',
                keepSpecialComments: 0
            },
            compress: {
                files: {
                    './WebServer/public/release/all.css': [
                        "./WebServer/public/release/concat.css"
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin']);
}