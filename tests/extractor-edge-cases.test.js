import { crosscheck, run, html, css } from './util/run'

crosscheck(() => {
  test('PHP arrays', async () => {
    let config = {
      content: [
        {
          raw: html`<h1 class="<?php echo wrap(['class' => "max-w-[16rem]"]); ?>">Hello world</h1>`,
        },
      ],
    }

    return run('@segmentdesign utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .max-w-\[16rem\] {
          max-width: 16rem;
        }
      `)
    })
  })

  test('arbitrary values with quotes', async () => {
    let config = { content: [{ raw: html`<div class="content-['hello]']"></div>` }] }

    return run('@segmentdesign utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .content-\[\'hello\]\'\] {
          --tw-content: 'hello]';
          content: var(--tw-content);
        }
      `)
    })
  })
})
