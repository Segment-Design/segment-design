let log = require('segmentdesign/lib/util/log').default

let localModules = {
  'segmentdesign/colors': require('segmentdesign/colors'),
  'segmentdesign/defaultConfig': require('segmentdesign/defaultConfig'),
  'segmentdesign/defaultTheme': require('segmentdesign/defaultTheme'),
  'segmentdesign/resolveConfig': require('segmentdesign/resolveConfig'),
  'segmentdesign/plugin': require('segmentdesign/plugin'),

  '@segmentdesign/aspect-ratio': require('@segmentdesign/aspect-ratio'),
  '@segmentdesign/container-queries': require('@segmentdesign/container-queries'),
  '@segmentdesign/forms': require('@segmentdesign/forms'),
  '@segmentdesign/line-clamp': () => {
    log.warn('line-clamp-in-core', [
      'As of segmentdesign v3.3, the `@segmentdesign/line-clamp` plugin is now included by default.',
      'Remove it from the `plugins` array in your configuration to eliminate this warning.',
    ])
  },
  '@segmentdesign/typography': require('@segmentdesign/typography'),

  // These are present to allow them to be specified in the PostCSS config file
  autoprefixer: require('autoprefixer'),
  segmentdesign: require('segmentdesign'),
}

// Swap out the default JITI implementation with one that has the built-in modules above preloaded as "native modules"
// NOTE: This uses a private, internal API of segmentdesign and is subject to change at any time
let { useCustomJiti } = require('segmentdesign/lib/lib/load-config')
let { transform } = require('sucrase')

useCustomJiti(() =>
  require('jiti')(__filename, {
    interopDefault: true,
    nativeModules: Object.keys(localModules),
    transform: (opts) => {
      return transform(opts.source, {
        transforms: ['typescript', 'imports'],
      })
    },
  })
)

let { patchRequire } = require('./patch-require.js')
patchRequire(
  // Patch require(…) to return the bundled modules above so they don't need to be installed
  localModules,

  // Create a require cache that maps module IDs to module objects
  // This MUST be done before require is patched to handle caching
  Object.fromEntries(
    Object.keys(localModules).map((id) => [
      id,
      id === '@segmentdesign/line-clamp'
        ? `node_modules/@segmentdesign/line-clamp/`
        : require.cache[require.resolve(id)],
    ])
  )
)

require('segmentdesign/lib/cli')
