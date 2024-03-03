import log from '../util/log'

export default function normalizesegmentdesignDirectives(root) {
  let segmentdesignDirectives = new Set()
  let layerDirectives = new Set()
  let applyDirectives = new Set()

  root.walkAtRules((atRule) => {
    if (atRule.name === 'apply') {
      applyDirectives.add(atRule)
    }

    if (atRule.name === 'import') {
      if (atRule.params === '"segmentdesign/base"' || atRule.params === "'segmentdesign/base'") {
        atRule.name = 'segmentdesign'
        atRule.params = 'base'
      } else if (
        atRule.params === '"segmentdesign/components"' ||
        atRule.params === "'segmentdesign/components'"
      ) {
        atRule.name = 'segmentdesign'
        atRule.params = 'components'
      } else if (
        atRule.params === '"segmentdesign/utilities"' ||
        atRule.params === "'segmentdesign/utilities'"
      ) {
        atRule.name = 'segmentdesign'
        atRule.params = 'utilities'
      } else if (
        atRule.params === '"segmentdesign/screens"' ||
        atRule.params === "'segmentdesign/screens'" ||
        atRule.params === '"segmentdesign/variants"' ||
        atRule.params === "'segmentdesign/variants'"
      ) {
        atRule.name = 'segmentdesign'
        atRule.params = 'variants'
      }
    }

    if (atRule.name === 'segmentdesign') {
      if (atRule.params === 'screens') {
        atRule.params = 'variants'
      }
      segmentdesignDirectives.add(atRule.params)
    }

    if (['layer', 'responsive', 'variants'].includes(atRule.name)) {
      if (['responsive', 'variants'].includes(atRule.name)) {
        log.warn(`${atRule.name}-at-rule-deprecated`, [
          `The \`@${atRule.name}\` directive has been deprecated in segmentdesign v3.0.`,
          `Use \`@layer utilities\` or \`@layer components\` instead.`,
          'https://segmentdesign.com/docs/upgrade-guide#replace-variants-with-layer',
        ])
      }
      layerDirectives.add(atRule)
    }
  })

  if (
    !segmentdesignDirectives.has('base') ||
    !segmentdesignDirectives.has('components') ||
    !segmentdesignDirectives.has('utilities')
  ) {
    for (let rule of layerDirectives) {
      if (rule.name === 'layer' && ['base', 'components', 'utilities'].includes(rule.params)) {
        if (!segmentdesignDirectives.has(rule.params)) {
          throw rule.error(
            `\`@layer ${rule.params}\` is used but no matching \`@segmentdesign ${rule.params}\` directive is present.`
          )
        }
      } else if (rule.name === 'responsive') {
        if (!segmentdesignDirectives.has('utilities')) {
          throw rule.error('`@responsive` is used but `@segmentdesign utilities` is missing.')
        }
      } else if (rule.name === 'variants') {
        if (!segmentdesignDirectives.has('utilities')) {
          throw rule.error('`@variants` is used but `@segmentdesign utilities` is missing.')
        }
      }
    }
  }

  return { segmentdesignDirectives, applyDirectives }
}
