const fs = require('fs')
const { version } = require('../package.json')

const year = new Date().getFullYear()
const cssPath = './src/css/bs-stepper.css'
const lookingForVersion = `v${version}`
const lookingForYear = `- ${year}`

let css = fs.readFileSync(cssPath, { encoding: 'utf8' })
css = css.replace(lookingForVersion, 'v{version}')
  .replace(lookingForYear, '- {year}')

fs.writeFileSync(cssPath, css)
