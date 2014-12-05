/* GruntFile config */

module.exports = function(grunt) {

	//Grunt Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less: {
		  development: {
		    options: {
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
			  },

			]
		  },
		  production: {
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
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-less');

	//Grunt Taskes definition
	grunt.registerTask('default', ['less:production', 'less:compileBootstrap']);
}