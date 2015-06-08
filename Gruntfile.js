module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
	    options:{
		    transform: [
          require('grunt-react').browserify,
          ["babelify", { "stage": 0 }]
         ]
	    },
		  client: {
			  src: ['public/js/components/**/*.js', 'public/js/views/*.js', "public/js/core/*.js"],
			  dest: 'public/js/app.built.js'
		  }
    },
    watch: {
      files: [ "public/js/views/**/*.js", "public/js/shims/**/*.js", "public/js/components/**/.js", "public/js/core/*.js"],
      tasks: [ 'browserify' ]
    }
  })
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-watch')
}
