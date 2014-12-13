/* GruntFile config */
//var util = require('./libs/grunt/utils.js');

module.exports = function(grunt) {
	// Load the plugins.
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	//variables
	var jsDist = 'dist/application.js';
	var jsSource = ['libs/**/*.js', 'app/**/*.js', 'app/app.js']

	//global beforeEach
	//util.init();

	//Grunt Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
    		all: ['Gruntfile.js', 'libs/**/*.js', 'app/**/*.js','test/**/*.js']
  		},
		less: {
		  compileAsset: {
		    options: {
		      paths: ["assets/css"],
		      cleancss: true,
		      imports: {
		          // Use the new "reference" directive, e.g.
		          // @import (reference) "variables.less";
		          reference: [
		            "less/mixins.less", 
		            "less/variables.less" 
		          ]
		        }
		    },
		    files: [
		      {
			    expand: true,
			    cwd: 'less',
			    src: ['*.less', '!{var,mix}*.less'],
			    dest: 'dist/css/',
			    ext: '.css'
			  }
		    ]
		  },
		  compileBootstrap: {
	        options: {
	          strictMath: true,
	          sourceMap: true,
	          outputSourceFiles: true,
	          sourceMapURL: 'bootstrap.css.map',
	          sourceMapFilename: 'dist/css/bootstrap.css.map'
	        },
	        src: 'libs/bootstrap/less/bootstrap.less',
	        dest: 'dist/css/bootstrap.css'
	      }
		},
		watch: {
		  scripts: {
		    files: ['**/*.js'],
		    tasks: ['jshint'],
		    options: {
		      spawn: false,
		    },
		  },
		  styles: {
		  	files: ['**/*.less'],
		  	tasks: ['less:compileAsset']
		  }
		},
		concat: {
	      options: {
	        separator: ';',
	      },
	      libs: {
	        src: ['libs/jquery/dist/jquery.js', 'libs/angular/angular.js', 'libs/bootstrap/js/*.js', 'libs/lodash/dist/lodash.js', 'libs/lodash/dist/lodash.underscore.js'],
	        dest: 'dist/js/libraries.js'
	      },
	      app: {
	      	src: ['app/*.js', 'app/controllers/*.js', 'app/directives/*.js', 'app/filters/*.js'],
	      	dest: 'dist/js/application.js'
	      }
	    },
	    uglify: {
	      options: {
	        separator: ';'
	      },
	      dist: {
	        src: ['libs/jquery/dist/jquery.js', 'libs/angular/angular.js', 'libs/bootstrap/js/*.js', 'libs/lodash/dist/lodash.js', 'libs/lodash/dist/lodash.underscore.js'],
	        dest: 'dist/js/libraries.js'
	      },
	      app: {
	      	src: ['app/controllers/*.js', 'app/directives/*.js', 'app/filters/*.js', 'app/app.js'],
	      	dest: 'dist/js/application.js'
	      }
	    },
	    copy: {
	        moveHtmlToDist: {
	        	files: [
	        		{src: 'app/index.html', dest: 'dist/index.html'},
	        		{
	        			expand: true, 
	        			flatten: true, 
	        			src: ['app/templates/**/*.html'], 
	        			dest: 'dist/html/'
	        		}
        		]
	        },
	        angular: {
	        	files: [
	        		{
	        			expand: true, 
	        			flatten: true, 
	        			src: ['libs/angular-*/angular-*.min.js', 'libs/angular-*/angular-*.js', 'libs/angular-*/angular-*.min.js.map'], 
	        			dest: 'dist/js', 
	        			filter: 'isFile'
	        		}
	        	]
	        }
	    },
		connect: {
	      devserver: {
	        options: {
	          port: 8000,
	          hostname: '0.0.0.0',
	          base: 'dist/',
	          keepalive: true,
	          middleware: function(connect, options){
	            var base = Array.isArray(options.base) ? options.base[options.base.length - 1] : options.base;
	            return [
	              //util.conditionalCsp(),
	              //util.rewrite(),
	              //e2e.middleware(),
	              //connect.favicon('images/favicon.ico'),
	              connect.static(base),
	              connect.directory(base)
	            ];
	          }
	        }
	      },
	      testserver: {
	        options: {
	          // We use end2end task (which does not start the webserver)
	          // and start the webserver as a separate process (in travis_build.sh)
	          // to avoid https://github.com/joyent/libuv/issues/826
	          port: 8000,
	          hostname: '0.0.0.0',
	          middleware: function(connect, options){
	            var base = Array.isArray(options.base) ? options.base[options.base.length - 1] : options.base;
	            return [
	              function(req, resp, next) {
	                // cache get requests to speed up tests on travis
	                if (req.method === 'GET') {
	                  resp.setHeader('Cache-control', 'public, max-age=3600');
	                }

	                next();
	              },
	              //util.conditionalCsp(),
	              //e2e.middleware(),
	              //connect.favicon('images/favicon.ico'),
	              connect.static(base)
	            ];
	          }
	        }
	      }
	    }
	});

	
	//Grunt Tasks definition
	grunt.registerTask('default', ['dev', 'watch']) 
	grunt.registerTask('init-js-libs', ['concat:libs', 'copy:angular'])
	grunt.registerTask('dev', ['less:compileAsset', 'less:compileBootstrap', 'init-js-libs', 'concat:app', 'copy:moveHtmlToDist', 'connect:devserver']);
	grunt.registerTask('production', ['less:compileAsset', 'less:compileBootstrap', 'uglify:libs', 'uglify:app', 'copy:moveHtmlToDist'])
}