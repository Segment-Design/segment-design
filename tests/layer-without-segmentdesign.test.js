import { crosscheck, run, html, css } from './util/run'

crosscheck(() => {
  test('using @layer without @segmentdesign', async () => {
    let config = {
      content: [{ raw: html`<div class="foo"></div>` }],
    }

    let input = css`
      @layer components {
        .foo {
          color: black;
        }
      }
    `

    await expect(run(input, config)).rejects.toThrowError(
      '`@layer components` is used but no matching `@segmentdesign components` directive is present.'
    )
  })

  test('using @responsive without @segmentdesign', async () => {
    let config = {
      content: [{ raw: html`<div class="foo"></div>` }],
    }

    let input = css`
      @responsive {
        .foo {
          color: black;
        }
      }
    `

    await expect(run(input, config)).rejects.toThrowError(
      '`@responsive` is used but `@segmentdesign utilities` is missing.'
    )
  })

  test('using @variants without @segmentdesign', async () => {
    let config = {
      content: [{ raw: html`<div class="foo"></div>` }],
    }

    let input = css`
      @variants hover {
        .foo {
          color: black;
        }
      }
    `

    await expect(run(input, config)).rejects.toThrowError(
      '`@variants` is used but `@segmentdesign utilities` is missing.'
    )
  })

  test('non-segmentdesign @layer rules are okay', async () => {
    let config = {
      content: [{ raw: html`<div class="foo"></div>` }],
    }

    let input = css`
      @layer custom {
        .foo {
          color: black;
        }
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @layer custom {
          .foo {
            color: #000;
          }
        }
      `)
    })
  })
})
