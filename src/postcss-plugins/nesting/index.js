import { nesting } from './plugin'

export default Object.assign(
  function (opts) {
    return {
      postcssPlugin: 'segmentdesign/nesting',
      Once(root, { result }) {
        return nesting(opts)(root, result)
      },
    }
  },
  { postcss: true }
)
