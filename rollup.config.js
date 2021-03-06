const { babel } = require('@rollup/plugin-babel')
const { terser } = require('rollup-plugin-terser')

const { version, homepage, author } = require('./package.json')
const year = new Date().getFullYear()

const buildProd = process.env.PROD === 'true'
const buildDev = process.env.DEV === 'true'

const conf = {
  input: './src/js/index.js',
  output: {
    banner:
`/*!
 * bsStepper v${version} (${homepage})
 * Copyright 2018 - ${year} ${author}
 * Licensed under MIT (https://github.com/Johann-S/bs-stepper/blob/master/LICENSE)
 */`,
    file: './dist/js/bs-stepper.js',
    format: 'umd',
    name: 'Stepper',
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      // Include the helpers in the bundle, at most one copy of each
      babelHelpers: 'bundled'
    })
  ]
}

if (buildDev) {
  conf.output.file = './tests/dist/js/bs-stepper.js'
}

if (buildProd) {
  conf.output.file = './dist/js/bs-stepper.min.js'
  conf.plugins.push(terser({
    compress: {
      typeofs: false
    },
    mangle: true,
    output: {
      comments: /^!/
    }
  }))
}

module.exports = conf
