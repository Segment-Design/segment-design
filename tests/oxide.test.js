import { crosscheck, run, html, css, defaults } from './util/run'

crosscheck(({ stable, sigma }) => {
  stable.test.todo('space-x uses physical properties')
  sigma.test('space-x uses logical properties', () => {
    let config = {
      content: [{ raw: html`<div class="space-x-4"></div>` }],
      corePlugins: { preflight: false },
    }

    return run('@segmentdesign base; @segmentdesign utilities;', config).then((result) => {
      expect(result.css).toMatchCss(css`
        ${defaults}
        .space-x-4 > :not([hidden]) ~ :not([hidden]) {
          --tw-space-x-reverse: 0;
          margin-inline-start: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
          margin-inline-end: calc(1rem * var(--tw-space-x-reverse));
        }
      `)
    })
  })
})
