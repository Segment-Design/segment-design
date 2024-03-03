import { crosscheck } from './run'

crosscheck(({ stable, sigma, engine }) => {
  stable.test('should run on stable', () => {
    expect(engine.stable).toBe(true)
    expect(engine.sigma).toBe(false)
  })
  sigma.test('should run on sigma', () => {
    expect(engine.stable).toBe(false)
    expect(engine.sigma).toBe(true)
  })
  test('should run on both', () => {
    sigma.expect(engine.sigma).toBe(true)
    sigma.expect(engine.stable).toBe(false)
    stable.expect(engine.sigma).toBe(false)
    stable.expect(engine.stable).toBe(true)
  })
})
