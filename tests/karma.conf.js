const path = require('path')
const ip = require('ip')
const babel = require('rollup-plugin-babel')
const istanbul = require('rollup-plugin-istanbul')

const {
  browsers,
  browsersKeys,
} = require('./browsers')
const coveragePath = path.resolve(__dirname, 'dist/coverage')
const browserTest = process.env.browser === 'true'
const dev = process.env.dev === 'true'

const rollupPreprocessor = {
  plugins: [
    istanbul({
      exclude: ['src/js/**/*.spec.js']
    }),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  output: {
    format: 'iife',
    name: 'bsStepperTest',
    sourcemap: 'inline'
  }
}

module.exports = function(config) {
  const conf = {
    basePath: '../',
    frameworks: ['jasmine'],
    files: [
      { pattern: 'src/js/**.spec.js', watched: true }
    ],
    reporters: ['dots', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR || config.LOG_WARN,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity,
    rollupPreprocessor: rollupPreprocessor,
    preprocessors: {
      'src/js/**/*.spec.js': ['rollup']
    },
    client: {
      clearContext: false
    }
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
          statements: 97,
          branches: 90,
          functions: 100,
          lines: 96
        }
      }
    }

    if (dev) {
      conf.singleRun = false
      conf.browsers = ['Chrome']
      conf.autoWatch = true
    }
  }

  config.set(conf)
}
