// Karma configuration
// Generated on Tue Jan 03 2017 13:40:46 GMT+0800 (CST)
//
var webpackConfig = require('./webpack.config');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      'test/**/reducer_spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/reducer_spec.js': ['webpack','coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress','coverage'],

    coverageReporter:{
        type:'html',
        dir:'test/coverage/'
    },

    // web server port
    port: 9786,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'], //, 'Safari'


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    //webpack: webpackConfig,

    webpackMiddleware:{
      noInfo:false
    },


        // webpack: {
        //   module: {
        //     loaders: [{
        //       test: /\.js$/,
        //       loader: 'babel',
        //       exclude: /node_modules/,
        //       query: {
        //         presets: ['es2015']
        //       }
        //     }]
        //   }
        // }

    webpack: {
        module: {
          loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
              presets: ['es2015']
            }
          }]
        },
        resolve: {
            //import the alias of the project webpack.config.js
            alias: webpackConfig.resolve.alias
        }
    }
  })
}
