import { resolveDebug } from '../src/lib/sharedState'
import { crosscheck } from './util/run'

crosscheck(() => {
  it.each`
    value                     | expected
    ${'true'}                 | ${true}
    ${'1'}                    | ${true}
    ${'false'}                | ${false}
    ${'0'}                    | ${false}
    ${'*'}                    | ${true}
    ${'segmentdesign'}          | ${true}
    ${'segmentdesign:*'}        | ${true}
    ${'other,segmentdesign'}    | ${true}
    ${'other,segmentdesign:*'}  | ${true}
    ${'other,-segmentdesign'}   | ${false}
    ${'other,-segmentdesign:*'} | ${false}
    ${'-segmentdesign'}         | ${false}
    ${'-segmentdesign:*'}       | ${false}
  `('should resolve the debug ($value) flag correctly ($expected)', ({ value, expected }) => {
    expect(resolveDebug(value)).toBe(expected)
  })
})
