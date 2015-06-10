module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
	    options:{
		    transform: [
        ["babelify", {stage: 0}],
          // require('grunt-react').browserify
         ]
	    },
		  client: {
			  src: ["public/js/stores/*.js", "public/js/actions/*.js", 'public/js/components/**/*.js', 'public/js/views/*.js', "public/js/core/*.js"],
			  dest: 'public/js/app.built.js'
		  }
    },
    express: {
      dev: {
        options: {
          script: "app.js"
        }
      }
    },
    watch: {
      frontend: {
        files: [ "public/js/views/**/*.js", "public/js/shims/**/*.js", "public/js/components/**/.js", "public/js/core/*.js", "public/js/stores/*.js", "public/js/actions/*.js"],
        tasks: [ 'browserify' ]
      },
      backend: {
        files: [ "middleware/**/*.js", "routes/**/*.js", "models/**/*.js", "controllers/**/*.js", "app.js", "all.routes.js" ],
        tasks: [ "express:dev" ],
        options: {
         spawn: false
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask("dev", [ "express:dev", "browserify", "watch" ]);
}
