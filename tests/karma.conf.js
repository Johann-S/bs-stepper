const path = require('path')
const coveragePath = path.resolve(__dirname, 'dist/coverage')

module.exports = function(config) {
  const conf = {
    frameworks: ['jasmine'],
    files: [
      'dist/js/*.js',
      'units/*.spec.js'
    ],
    reporters: ['dots', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR || config.LOG_WARN,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity,
    coverageIstanbulReporter: {
      dir: coveragePath,
      reports: ['lcov', 'text-summary'],
      thresholds: {
        emitWarning: false,
        global: {
          statements: 96,
          branches: 89,
          functions: 100,
          lines: 96
        }
      }
    }
  }

  config.set(conf)
}
