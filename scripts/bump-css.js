const { version } = require('../package.json')
const fs = require('fs')

const year = new Date().getFullYear()
const cssPath = './src/css/bs-stepper.css'

let css = fs.readFileSync(cssPath, { encoding: 'utf8' })
css = css.replace('{version}', version)
css = css.replace('{year}', year)

fs.writeFileSync(cssPath, css)
