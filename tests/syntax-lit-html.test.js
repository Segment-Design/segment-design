import { crosscheck, run, css } from './util/run'

crosscheck(({ stable, sigma }) => {
  test('it detects classes in lit-html templates', () => {
    let config = {
      content: [
        {
          raw: `html\`<button class="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">\${data.title}</button>\`;`,
        },
      ],
      corePlugins: { preflight: false },
      theme: {},
      plugins: [],
    }

    return run('@segmentdesign utilities', config).then((result) => {
      stable.expect(result.css).toMatchFormattedCss(css`
        .rounded {
          border-radius: 0.25rem;
        }
        .bg-blue-400 {
          --tw-bg-opacity: 1;
          background-color: rgb(96 165 250 / var(--tw-bg-opacity));
        }
        .px-4 {
          padding-left: 1rem;
          padding-right: 1rem;
        }
        .py-2 {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
        .font-bold {
          font-weight: 700;
        }
        .text-white {
          --tw-text-opacity: 1;
          color: rgb(255 255 255 / var(--tw-text-opacity));
        }
        .hover\:bg-blue-600:hover {
          --tw-bg-opacity: 1;
          background-color: rgb(37 99 235 / var(--tw-bg-opacity));
        }
      `)
      sigma.expect(result.css).toMatchFormattedCss(css`
        .rounded {
          border-radius: 0.25rem;
        }
        .bg-blue-400 {
          background-color: #60a5fa;
        }
        .px-4 {
          padding-left: 1rem;
          padding-right: 1rem;
        }
        .py-2 {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
        .font-bold {
          font-weight: 700;
        }
        .text-white {
          color: #fff;
        }
        .hover\:bg-blue-600:hover {
          background-color: #2563eb;
        }
      `)
    })
  })
})
