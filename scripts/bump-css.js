const fs = require('fs')
const { version } = require('../package.json')

const year = new Date().getFullYear()
const cssPath = './src/css/bs-stepper.css'

let css = fs.readFileSync(cssPath, { encoding: 'utf8' })
css = css.replace('{version}', version)
  .replace('{year}', year)

fs.writeFileSync(cssPath, css)
