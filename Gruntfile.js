/* GruntFile config */
//var util = require('./libs/grunt/utils.js');

module.exports = function(grunt) {
	
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
			    dest: 'assets/css/',
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
	          sourceMapFilename: 'assets/css/bootstrap.css.map'
	        },
	        src: 'libs/bootstrap/less/bootstrap.less',
	        dest: 'assets/css/bootstrap.css'
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
		connect: {
	      devserver: {
	        options: {
	          port: 8000,
	          hostname: '0.0.0.0',
	          base: '.',
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

	// Load the plugins.
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');

	//Grunt Tasks definition
	grunt.registerTask('default', ['dev', 'watch']) 
	grunt.registerTask('dev', ['less:compileAsset', 'less:compileBootstrap', 'connect:devserver']);
	grunt.registerTask('production', ['less:compileAsset', 'less:compileBootstrap'])
}