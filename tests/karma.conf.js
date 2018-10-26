const path = require('path')
const ip = require('ip')
const {
  browsers,
  browsersKeys,
} = require('./browsers')
const coveragePath = path.resolve(__dirname, 'dist/coverage')
const browserTest = process.env.browser === 'true'

module.exports = function(config) {
  const conf = {
    frameworks: ['jasmine'],
    files: [
      'dist/js/*.js',
      'units/*.spec.js'
    ],
    reporters: ['dots'],
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR || config.LOG_WARN,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity,
  }

  if (browserTest) {
    conf.hostname = ip.address()
    conf.browserStack = {
      username: process.env.BROWSER_STACK_USERNAME,
      accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
      build: `bsStepper-${new Date().toISOString()}`,
      project: 'bsStepper',
      retryLimit: 1,
    }

    conf.customLaunchers = browsers
    conf.browsers = browsersKeys
    conf.reporters.push('BrowserStack')
  } else {
    conf.reporters.push('coverage-istanbul')
    conf.coverageIstanbulReporter = {
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
