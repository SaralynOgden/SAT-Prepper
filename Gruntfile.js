module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      js: {
        src: ['public/js/grunt_test/*.js'],
        dest: 'public/js/scripts.js'
      }
    },
    watch: {
      js: {
        files: ['public/js/grunt_test/*.js'],
        tasks: ['concat']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
}
