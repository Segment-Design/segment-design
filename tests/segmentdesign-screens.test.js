import { crosscheck, run, html, css } from './util/run'

crosscheck(() => {
  test('class variants are inserted at `@segmentdesign variants`', async () => {
    let config = {
      content: [{ raw: html`<div class="font-bold hover:font-bold md:font-bold"></div>` }],
    }

    let input = css`
      @segmentdesign utilities;
      @segmentdesign variants;
      .foo {
        color: black;
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .font-bold,
        .hover\:font-bold:hover {
          font-weight: 700;
        }
        @media (min-width: 768px) {
          .md\:font-bold {
            font-weight: 700;
          }
        }
        .foo {
          color: #000;
        }
      `)
    })
  })

  test('`@segmentdesign screens` works as an alias for `@segmentdesign variants`', async () => {
    let config = {
      content: [{ raw: html`<div class="font-bold hover:font-bold md:font-bold"></div>` }],
    }

    let input = css`
      @segmentdesign utilities;
      @segmentdesign screens;
      .foo {
        color: black;
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .font-bold,
        .hover\:font-bold:hover {
          font-weight: 700;
        }
        @media (min-width: 768px) {
          .md\:font-bold {
            font-weight: 700;
          }
        }
        .foo {
          color: #000;
        }
      `)
    })
  })
})
