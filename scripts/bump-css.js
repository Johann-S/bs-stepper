const { version } = require('../package.json')
const fs = require('fs')

const cssPath = './src/css/bs-stepper.css'

let css = fs.readFileSync(cssPath, { encoding: 'utf8' })
css = css.replace('{version}', version)

fs.writeFileSync(cssPath, css)
