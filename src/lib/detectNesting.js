function isRoot(node) {
  return node.type === 'root'
}

function isAtLayer(node) {
  return node.type === 'atrule' && node.name === 'layer'
}

export default function (_context) {
  return (root, result) => {
    let found = false

    root.walkAtRules('segmentdesign', (node) => {
      if (found) return false

      if (node.parent && !(isRoot(node.parent) || isAtLayer(node.parent))) {
        found = true
        node.warn(
          result,
          [
            'Nested @segmentdesign rules were detected, but are not supported.',
            "Consider using a prefix to scope segmentdesign's classes: https://segmentdesign.com/docs/configuration#prefix",
            'Alternatively, use the important selector strategy: https://segmentdesign.com/docs/configuration#selector-strategy',
          ].join('\n')
        )
        return false
      }
    })

    root.walkRules((rule) => {
      if (found) return false

      rule.walkRules((nestedRule) => {
        found = true
        nestedRule.warn(
          result,
          [
            'Nested CSS was detected, but CSS nesting has not been configured correctly.',
            'Please enable a CSS nesting plugin *before* segmentdesign in your configuration.',
            'See how here: https://segmentdesign.com/docs/using-with-preprocessors#nesting',
          ].join('\n')
        )
        return false
      })
    })
  }
}
