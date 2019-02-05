const { version } = require('../package.json')
const fs = require('fs')

const cssPath = './src/css/bs-stepper.css'
const lookingFor = `v${version}`

let css = fs.readFileSync(cssPath, { encoding: 'utf8' })
css = css.replace(lookingFor, 'v{version}')

fs.writeFileSync(cssPath, css)
