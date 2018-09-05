module.exports = function (grunt){
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    browserify : {
      js : {
        files : {
          "./dist/eosjs-cluster.js" : ["./index.js"]
        }
      }
    },
    uglify : {
      my_target : {
        files : {
          "./dist/eosjs-cluster.min.js" : ["./dist/eosjs-cluster.js"]
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // grunt.registerTask('default',['browserify', 'uglify']);
  grunt.registerTask('default',['browserify']);
}