// @ts-check

import fs from 'fs'
import path from 'path'

function isESM() {
  const pkgPath = path.resolve('./package.json')

  try {
    let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    return pkg.type && pkg.type === 'module'
  } catch (err) {
    return false
  }
}

export function init(args) {
  let messages = []

  let isProjectESM = args['--ts'] || args['--esm'] || isESM()
  let syntax = args['--ts'] ? 'ts' : isProjectESM ? 'js' : 'cjs'
  let extension = args['--ts'] ? 'ts' : 'js'

  let segmentdesignConfigLocation = path.resolve(args['_'][1] ?? `./segmentdesign.config.${extension}`)

  if (fs.existsSync(segmentdesignConfigLocation)) {
    messages.push(`${path.basename(segmentdesignConfigLocation)} already exists.`)
  } else {
    let stubContentsFile = fs.readFileSync(
      args['--full']
        ? path.resolve(__dirname, '../../../stubs/config.full.js')
        : path.resolve(__dirname, '../../../stubs/config.simple.js'),
      'utf8'
    )

    let stubFile = fs.readFileSync(
      path.resolve(__dirname, `../../../stubs/segmentdesign.config.${syntax}`),
      'utf8'
    )

    // Change colors import
    stubContentsFile = stubContentsFile.replace('../colors', 'segmentdesign/colors')

    // Replace contents of {ts,js,cjs} file with the stub {simple,full}.
    stubFile =
      stubFile
        .replace('__CONFIG__', stubContentsFile.replace('module.exports =', '').trim())
        .trim() + '\n\n'

    fs.writeFileSync(segmentdesignConfigLocation, stubFile, 'utf8')

    messages.push(`Created segmentdesign config file: ${path.basename(segmentdesignConfigLocation)}`)
  }

  if (args['--postcss']) {
    let postcssConfigLocation = path.resolve('./postcss.config.js')
    if (fs.existsSync(postcssConfigLocation)) {
      messages.push(`${path.basename(postcssConfigLocation)} already exists.`)
    } else {
      let stubFile = fs.readFileSync(
        isProjectESM
          ? path.resolve(__dirname, '../../../stubs/postcss.config.js')
          : path.resolve(__dirname, '../../../stubs/postcss.config.cjs'),
        'utf8'
      )

      fs.writeFileSync(postcssConfigLocation, stubFile, 'utf8')

      messages.push(`Created PostCSS config file: ${path.basename(postcssConfigLocation)}`)
    }
  }

  if (messages.length > 0) {
    console.log()
    for (let message of messages) {
      console.log(message)
    }
  }
}
