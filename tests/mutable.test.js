import path from 'path'
import postcss from 'postcss'

import { crosscheck, run, html, css } from './util/run'

crosscheck(() => {
  function pluginThatMutatesRules() {
    return (root) => {
      root.walkRules((rule) => {
        rule.nodes
          .filter((node) => node.prop === 'background-image')
          .forEach((node) => {
            node.value = 'url("./bar.png")'
          })

        return rule
      })
    }
  }

  test('plugins mutating rules after segmentdesign doesnt break it', async () => {
    let config = {
      content: [{ raw: html`<div class="bg-foo"></div>` }],
      theme: {
        backgroundImage: {
          foo: 'url("./foo.png")',
        },
      },
      plugins: [],
    }

    function checkResult(result) {
      expect(result.css).toMatchFormattedCss(css`
        .bg-foo {
          background-image: url('./foo.png');
        }
      `)
    }

    // Verify the first run produces the expected result
    let firstRun = await run('@segmentdesign utilities', config)
    checkResult(firstRun)

    // Outside of the context of segmentdesign jit more postcss plugins may operate on the AST:
    // In this case we have a plugin that mutates rules directly
    await postcss([pluginThatMutatesRules()]).process(firstRun, {
      from: path.resolve(__filename),
    })

    // Verify subsequent runs don't produce mutated rules
    let secondRun = await run('@segmentdesign utilities', config)
    checkResult(secondRun)
  })
})
