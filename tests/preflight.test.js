import { crosscheck, run, html, css } from './util/run'

crosscheck(({ stable, sigma }) => {
  it('preflight has a correct border color fallback', () => {
    let config = {
      content: [{ raw: html`<div class="border-black"></div>` }],
      theme: {
        borderColor: ({ theme }) => theme('colors'),
      },
      plugins: [],
      corePlugins: { preflight: true },
    }

    let input = css`
      @segmentdesign base;
      @segmentdesign utilities;
    `

    return run(input, config).then((result) => {
      stable.expect(result.css).toContain(`border-color: currentColor;`)
      // Lightning CSS optimizes this to just `border-color: 0 solid;` based on the br value.
      sigma.expect(result.css).toContain(`border: 0 solid;`)
    })
  })
})
