'use strict';

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // folder paths
    var config = {
        app: 'src',
        dist: 'ext'
    };

    var dependencies = {
        background: {
            js: [
                '../node_modules/raven-js/dist/raven.min.js',
                '../node_modules/jquery/dist/jquery.min.js',
                '../node_modules/bootstrap/dist/js/bootstrap.min.js',
                '../node_modules/underscore/underscore-min.js',
                '../node_modules/underscore.string/dist/underscore.string.min.js',
                '../node_modules/js-md5/build/md5.min.js',
                '../node_modules/handlebars/dist/handlebars.js',
                '../node_modules/moment/min/moment.min.js',
                '../node_modules/mousetrap/mousetrap.min.js',
                '../node_modules/mousetrap/plugins/record/mousetrap-record.min.js',

                '../node_modules/angular/angular.min.js',
                '../node_modules/angular-route/angular-route.min.js',
                '../node_modules/angular-resource/angular-resource.min.js',
                '../node_modules/angular-moment/angular-moment.min.js',

                '../node_modules/checklist-model/checklist-model.js',
                '../node_modules/ng-file-upload/ng-file-upload-all.min.js',

                '../node_modules/microplugin/src/microplugin.js',
                '../node_modules/sifter/sifter.min.js',
                '../node_modules/selectize/dist/js/selectize.min.js',

                '../node_modules/tinymce/tinymce.min.js',
                '../node_modules/tinymce/themes/modern/theme.min.js',
                '../node_modules/angular-ui-tinymce/src/tinymce.js',
                '../node_modules/tinymce/plugins/autoresize/plugin.js',
                '../node_modules/tinymce/plugins/autolink/plugin.js',
                '../node_modules/tinymce/plugins/image/plugin.js',
                '../node_modules/tinymce/plugins/link/plugin.js',
                '../node_modules/tinymce/plugins/media/plugin.js',
                '../node_modules/tinymce/plugins/table/plugin.js',
                '../node_modules/tinymce/plugins/advlist/plugin.js',
                '../node_modules/tinymce/plugins/lists/plugin.js',
                '../node_modules/tinymce/plugins/textcolor/plugin.js',
                '../node_modules/tinymce/plugins/imagetools/plugin.js',
                '../node_modules/tinymce/plugins/code/plugin.js',

                '../node_modules/fuse.js/src/fuse.min.js',

                // Should be first
                'background/js/environment.js',
                'background/js/utils/amplitude.js',
                'common/*.js',
                'background/js/**/*.js'
            ],
            css: [
                '../node_modules/tinymce/skins/lightgray/skin.min.css',
                '../node_modules/tinymce/skins/lightgray/content.min.css'
            ]
        },
        content: {
            js: [
                '../node_modules/raven-js/dist/raven.min.js',
                '../node_modules/jquery/dist/jquery.min.js',
                '../node_modules/underscore/underscore-min.js',
                '../node_modules/handlebars/dist/handlebars.min.js',
                '../node_modules/moment/min/moment.min.js',
                '../node_modules/mousetrap/mousetrap.js',
                '../node_modules/mousetrap/plugins/global-bind/mousetrap-global-bind.js',
                '../node_modules/fuse.js/src/fuse.min.js',

                'common/*.js',

                // order is important here
                'content/js/patterns.js',
                'content/js/index.js',
                'content/js/utils.js',
                'content/js/autocomplete.js',
                'content/js/keyboard.js',
                'content/js/dialog.js',
                'content/js/sidebar.js',
                'content/js/events.js',

                'content/js/plugins/*.js'
            ]
        }
    };

    // Project configuration
    grunt.initConfig({
        config: config,
        pkg: grunt.file.readJSON('package.json'),
        manifestContents: grunt.file.readJSON(config.app + '/manifest.json'),
        // TODO ad watching all files and reloading extension in browser
        watch: {
            stylus: {
                files: [
                    '**/*.styl'
                ],
                tasks: ['stylus:development'],
                options: {
                    cwd: config.app,
                    spawn: false
                }
            },
            js: {
                files: [
                    dependencies.background.js.concat(dependencies.content.js)
                ],
                tasks: ['concat'],
                options: {
                    cwd: config.app,
                    spawn: false
                }
            },
            copy: {
                files: [
                    '**/*.html',
                    '**/*.png',
                    'pages/*/*.js'
                ],
                tasks: ['copy:development'],
                options: {
                    cwd: config.app,
                    spawn: false
                }
            },
            extensionReload: {
                files: [
                    '**/*.css',
                    '**/*.js'
                ],
                tasks: [],
                options: {
                    cwd: config.dist,
                    spawn: false,
                    livereload: 1338
                }
            }
        },
        stylus: {
            development: {
                options: {
                    'include css': true,
                    compress: false,
                    linenos: true
                },
                files: {
                    '<%= config.dist %>/background/css/installed.css': '<%= config.app %>/background/css/installed.styl',
                    '<%= config.dist %>/background/css/background.css': '<%= config.app %>/background/css/background.styl',

                    '<%= config.dist %>/content/css/content.css': '<%= config.app %>/content/css/content.styl'
                }
            },
            production: {
                options: {
                    'include css': true
                },
                files: {
                    '<%= config.dist %>/background/css/installed.css': '<%= config.app %>/background/css/installed.styl',
                    '<%= config.dist %>/background/css/background.css': '<%= config.app %>/background/css/background.styl',
                    '<%= config.dist %>/content/css/content.css': '<%= config.app %>/content/css/content.styl'
                }
            }
        },
        jshint: {
            development: [
                '<%= config.app %>/content/js/*.js',
                '<%= config.app %>/background/js/*.js'
            ],
            options: {
                multistr: true,
                sub: true
                //ignores: "src/content/js/gmailr.js"
            }
        },
        concat: {
            background: {
                expand: true,
                cwd: config.app,
                src: dependencies.background.js,
                dest: '<%= config.dist %>/background/js/background.js',
                // treat dest as a file, not as a folder
                rename: function (dest) {
                    return dest
                }
            },
            content: {
                expand: true,
                cwd: config.app,
                src: dependencies.content.js,
                dest: '<%= config.dist %>/content/js/content.js',
                rename: function (dest) {
                    return dest
                }
            }
        },
        compress: {
            all: {
                options: {
                    archive: 'build/<%= pkg.name %>-<%= manifestContents.version %>.zip'
                },
                files: [
                    {src: ['<%= config.dist %>/**']}
                ]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            development: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        dot: true,
                        cwd: '<%= config.app %>/../node_modules/font-awesome/fonts/',
                        dest: '<%= config.dist %>/background/fonts',
                        src: [
                            '*'
                        ]
                    },
                    {
                        expand: true,
                        flatten: true,
                        dot: true,
                        cwd: '<%= config.app %>/../node_modules/tinymce/skins/lightgray/fonts/',
                        dest: '<%= config.dist %>/background/css/fonts',
                        src: [
                            '*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %>/../node_modules/tinymce/skins/lightgray/',
                        dest: '<%= config.dist %>/pages/tinymce/skins/lightgray',
                        src: [
                            '**'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: config.app,
                        dest: '<%= config.dist %>',
                        src: [
                            'icons/**',
                            '_locales/**',
                            'pages/**',
                            'LICENSE'
                        ]
                    }
                ]
            }
        },
        clean: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.dist %>',
                    src: [
                        '*'
                    ]
                }]
            }
        },
        crx: {
            extension: {
                src: '<%= config.dist %>/**',
                dest: '<%= config.dist %>/gorgias-chrome.crx',
                options: {
                    privateKey: 'ext.pem'
                }
            }
        },
        protractor: {
            options: {
                keepAlive: false
            },
            background: {
                options: {
                    configFile: 'tests/protractor.background.conf.js',
                    args: {
                        seleniumAddress: 'http://localhost:4444/wd/hub'
                    }
                }
            },
            backgroundRemote: {
                options: {
                    configFile: 'tests/protractor.background.conf.js',
                    args: {
                        sauceUser: process.env.SAUCE_USERNAME,
                        sauceKey: process.env.SAUCE_ACCESS_KEY
                    }
                }
            },
            content: {
                options: {
                    configFile: 'tests/protractor.content.conf.js',
                    args: {
                        seleniumAddress: 'http://localhost:4444/wd/hub'
                    }
                }
            },
            contentRemote: {
                options: {
                    configFile: 'tests/protractor.content.conf.js',
                    args: {
                        sauceUser: process.env.SAUCE_USERNAME,
                        sauceKey: process.env.SAUCE_ACCESS_KEY
                    }
                }
            }
        }
    });

    grunt.registerTask('manifest:development', 'Build chrome manifest life.', function () {
        var manifest = grunt.file.readJSON(config.app + '/manifest.json')
        manifest.key = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4fz+r4Bt92pF09QQkdrVrJRt/OYUWTg6mBHGyp0u6suCPaPFJ1mysOAphZIAhCPw4O/lsQ8AlLkHgFzpb5z7IjmrU3FB1dJXGifXDY6ybZi/CcZUY0g30Do+bowHKNHRnkYIl625jaQwvrKm9ZYseIPIbCOtDHSBoD579tbP+aYLxZV+aVBmvD7O2HayVzMgL8xc+imk2gRzmu0zVjgQ+WqlGApTsEtucsVUVrNTf6Txl9nDCN9ztRJwLH7VASKctHeHMwmK1uDZgkokdO5FjHYEp6VB7c4Pe/Af1l0/Dct9HgK8aFXtsmIZa7zWPrgAihBqKVaWMk4iJTmmXfNZxQIDAQAB'

        // Load content script on localhost
        manifest.content_scripts[0].matches.push('http://localhost/gmail/*')
        manifest.content_scripts[0].matches.push('https://localhost/gmail/*')

        grunt.file.write(config.dist + '/manifest.json', JSON.stringify(manifest))

        grunt.file.write(config.app + '/background/js/environment.js', 'var ENV = "development";')
    })

    grunt.registerTask('manifest:production', 'Build chrome manifest life.', function () {
        var manifest = grunt.file.readJSON(config.app + '/manifest.json')
        delete manifest.key;
        grunt.file.write(config.dist + '/manifest.json', JSON.stringify(manifest))

        grunt.file.write(config.app + '/background/js/environment.js', 'var ENV = "production";')
    })


    // Development mode
    grunt.registerTask('development', [
        'clean',
        'copy:development',
        'manifest:development',
        'stylus:development',
        'jshint',
        'concat',
        'watch'
    ]);
    // alias
    grunt.registerTask('d', ['development'])


    // Testing
    // TODO add unit tests
    grunt.registerTask('test', function (target) {

        grunt.task.run([
            'jshint',
            'production',
            'crx'
        ]);

        if (target === 'content') {
            return grunt.task.run([
                'protractor:contentRemote'
            ]);
        }

        if (target === 'background') {
            return grunt.task.run([
                'protractor:backgroundRemote'
            ]);
        }

        grunt.task.run([
            'protractor:contentRemote',
            'protractor:backgroundRemote'
        ]);

    });
    // alias
    grunt.registerTask('t', ['test'])


    // Optimize and compress
    grunt.registerTask('production', [
        'clean',
        'copy:development',
        'manifest:production',
        'stylus:production',
        'concat'
    ]);
    // alias
    grunt.registerTask('p', ['production'])


    // Creates extension zip archive
    grunt.registerTask('build', [
        'production',
        'compress'
    ]);
    // alias
    grunt.registerTask('b', ['build']);

    grunt.registerTask('default', ['development']);

};
