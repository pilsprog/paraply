/*global module:false*/
module.exports = function (grunt) {
	"use strict";
	grunt.loadNpmTasks('grunt-jslint');
	grunt.loadNpmTasks('grunt-contrib-sass');

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		jslint: {
			files: [
				'grunt.js',
				'test/**/*.js',
				'app/*.js',
				'app/**/*.js',
				'app.js',
				'routes/**.js'
			],
			watch: {
				files: [
					'grunt.js',
					'app/*.js',
					'app/**/*.js',
					'app.js',
					'routes/**.js'
				],
				tasks: ['default']
			},
			directives: {
				node: true,
				todo: true
			},
			options: {
				errorsOnly: true // only display errors
			}
		},
		uglify: {},
		sass: {                              // Task
		    dist: {                            // Target
		      files: {                         // Dictionary of files
		        'public/css/main.css': 'css/main.scss',       // 'destination': 'source'
		      }
		    },
		    dev: {                             // Another target
		      options: {                       // Target options
		        style: 'expanded'
		      },
		      files: {
		        'public/css/main.css': 'css/main.scss'
		      }
		    }
		},
		watch: {
				files: [
					'css/*.scss',
				],
				tasks: ['default']
			},
	});

	// Default task.
	grunt.registerTask('default', ['sass']);

};
