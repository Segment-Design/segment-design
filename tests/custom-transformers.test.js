import { crosscheck, run, html, css } from './util/run'

function customTransformer(content) {
  return content.replace(/uppercase/g, 'lowercase')
}

crosscheck(({ stable, sigma }) => {
  sigma.test.todo('transform function')
  stable.test('transform function', () => {
    let config = {
      content: {
        files: [{ raw: html`<div class="uppercase"></div>` }],
        transform: customTransformer,
      },
    }

    return run('@segmentdesign utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .lowercase {
          text-transform: lowercase;
        }
      `)
    })
  })

  sigma.test.todo('transform.DEFAULT')
  stable.test('transform.DEFAULT', () => {
    let config = {
      content: {
        files: [{ raw: html`<div class="uppercase"></div>` }],
        transform: {
          DEFAULT: customTransformer,
        },
      },
    }

    return run('@segmentdesign utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .lowercase {
          text-transform: lowercase;
        }
      `)
    })
  })

  sigma.test.todo('transform.{extension}')
  stable.test('transform.{extension}', () => {
    let config = {
      content: {
        files: [
          { raw: 'blah blah blah', extension: 'html' },
          { raw: 'blah blah blah', extension: 'php' },
        ],
        transform: {
          html: () => 'uppercase',
          php: () => 'lowercase',
        },
      },
    }

    return run('@segmentdesign utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .uppercase {
          text-transform: uppercase;
        }
        .lowercase {
          text-transform: lowercase;
        }
      `)
    })
  })
})
