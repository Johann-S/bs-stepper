const path = require('path')
const babel = require('rollup-plugin-babel')
const { uglify } = require('rollup-plugin-uglify')

const pkg = require(path.resolve(__dirname, 'package.json'))
const year = new Date().getFullYear()

const buildProd = process.env.PROD === 'true'
const buildDev = process.env.DEV === 'true'

const conf = {
  input: './src/js/index.js',
  output: {
    banner:
`/*!
 * bsStepper v${pkg.version} (${pkg.homepage})
 * Copyright ${year} ${pkg.author}
 * Licensed under MIT (https://github.com/Johann-S/bs-stepper/blob/master/LICENSE)
 */`,
    file: './dist/js/bs-stepper.js',
    format: 'umd',
    name: 'bsStepper',
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

if (buildDev) {
  conf.output.file = './tests/dist/js/bs-stepper.js'
  conf.watch = {
    include: 'src/**.js'
  }
}

if (buildProd) {
  conf.output.file = './dist/js/bs-stepper.min.js'
  conf.plugins.push(uglify({
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
