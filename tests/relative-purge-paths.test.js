import { crosscheck, run, css } from './util/run'

crosscheck(() => {
  test('relative purge paths', () => {
    let config = {
      content: ['./tests/relative-purge-paths.test.html'],
      corePlugins: { preflight: false },
    }

    let input = css`
      @segmentdesign base;
      @segmentdesign components;
      @segmentdesign utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toIncludeCss(css`
        .font-bold {
          font-weight: 700;
        }
      `)
    })
  })
})
