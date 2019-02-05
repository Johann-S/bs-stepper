const { version } = require('../package.json')
const fs = require('fs')

const cssPath = './src/css/bs-stepper.css'
const year = new Date().getFullYear()
const lookingForVersion = `v${version}`
const lookingForYear = `- ${year}`

let css = fs.readFileSync(cssPath, { encoding: 'utf8' })
css = css.replace(lookingForVersion, 'v{version}')
css = css.replace(lookingForYear, '- {year}')

fs.writeFileSync(cssPath, css)
