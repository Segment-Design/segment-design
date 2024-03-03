import fs from 'fs'
import path from 'path'

const defaultConfigFiles = [
  './segmentdesign.config.js',
  './segmentdesign.config.cjs',
  './segmentdesign.config.mjs',
  './segmentdesign.config.ts',
]

function isObject(value) {
  return typeof value === 'object' && value !== null
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0
}

function isString(value) {
  return typeof value === 'string' || value instanceof String
}

export default function resolveConfigPath(pathOrConfig) {
  // require('segmentdesign')({ theme: ..., variants: ... })
  if (isObject(pathOrConfig) && pathOrConfig.config === undefined && !isEmpty(pathOrConfig)) {
    return null
  }

  // require('segmentdesign')({ config: 'custom-config.js' })
  if (
    isObject(pathOrConfig) &&
    pathOrConfig.config !== undefined &&
    isString(pathOrConfig.config)
  ) {
    return path.resolve(pathOrConfig.config)
  }

  // require('segmentdesign')({ config: { theme: ..., variants: ... } })
  if (
    isObject(pathOrConfig) &&
    pathOrConfig.config !== undefined &&
    isObject(pathOrConfig.config)
  ) {
    return null
  }

  // require('segmentdesign')('custom-config.js')
  if (isString(pathOrConfig)) {
    return path.resolve(pathOrConfig)
  }

  // require('segmentdesign')
  return resolveDefaultConfigPath()
}

export function resolveDefaultConfigPath() {
  for (const configFile of defaultConfigFiles) {
    try {
      const configPath = path.resolve(configFile)
      fs.accessSync(configPath)
      return configPath
    } catch (err) {}
  }

  return null
}
