/*global module:false*/
module.exports = function (grunt) {
	"use strict";
	grunt.loadNpmTasks('grunt-jslint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

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
		watch: {
			files: [
				'css/*.scss',
				'grunt.js',
				'app/*.js',
				'app/**/*.js',
				'app.js',
				'routes/**.js'
			],
			tasks: 'default'

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
			directives: {
				node: true,
				todo: true
			},
			options: {
				errorsOnly: true // only display errors
			}
		},
		uglify: {},
		sass: {
			dev: {
				options: {
					style: 'expanded'
				},
				files: {
					'public/css/main.css': 'css/main.scss'
				}
			}
		}
	});

	// Default task.
	grunt.registerTask('default', ['sass', 'jslint']);

};
