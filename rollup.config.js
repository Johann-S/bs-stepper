const path = require('path')
const babel = require('rollup-plugin-babel')
const { terser } = require('rollup-plugin-terser')

const pkg = require(path.resolve(__dirname, 'package.json'))
const year = new Date().getFullYear()

const buildProd = process.env.PROD === 'true'
const buildDev = process.env.DEV === 'true'
const buildTest = process.env.TEST === 'true'

const conf = {
  input: './src/js/index.js',
  output: {
    banner:
`/*!
 * bsStepper v${pkg.version} (${pkg.homepage})
 * Copyright 2018 - ${year} ${pkg.author}
 * Licensed under MIT (https://github.com/Johann-S/bs-stepper/blob/master/LICENSE)
 */`,
    file: './dist/js/bs-stepper.js',
    format: 'umd',
    name: 'Stepper',
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

if (buildTest) {
  conf.output.file = './tests/dist/js/bs-stepper.js'
}

if (buildDev) {
  conf.output.file = './tests/dist/js/bs-stepper.js'
  conf.watch = {
    include: 'src/**.js'
  }
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
