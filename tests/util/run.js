import path from "path";
import postcss from "postcss";
import segmentdesign from "../../src";
import { env } from "../../src/lib/sharedState";

export * from "./strings";
export * from "./defaults";

export let map = JSON.stringify({
  version: 3,
  file: null,
  sources: [],
  names: [],
  mappings: "",
});

globalThis.__SIGMA__ = env.ENGINE === "sigma";

export function run(input, config, plugin = segmentdesign) {
  let { currentTestName } = expect.getState();

  return postcss(plugin(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  });
}

export function runWithSourceMaps(input, config, plugin = segmentdesign) {
  let { currentTestName } = expect.getState();

  return postcss(plugin(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
    map: {
      prev: map,
    },
  });
}

let nullTest = Object.assign(function () {}, {
  skip: () => {},
  only: () => {},
  each: () => () => {},
  todo: () => {},
});
let nullProxy = new Proxy(
  {
    test: nullTest,
    it: nullTest,
    xit: nullTest.skip,
    fit: nullTest.only,
    xdescribe: nullTest.skip,
    fdescribe: nullTest.only,
  },
  {
    get(target, prop, _receiver) {
      if (prop in target) {
        return target[prop];
      }
      return Object.assign(() => {
        return nullProxy;
      }, nullProxy);
    },
  },
);

/**
 * @typedef {object} CrossCheck
 * @property {typeof import('@jest/globals')} sigma
 * @property {typeof import('@jest/globals')} stable
 * @property {object} engine
 * @property {boolean} engine.sigma
 * @property {boolean} engine.stable
 */

/**
 * @param {(data: CrossCheck) => void} fn
 */
export function crosscheck(fn) {
  let engines =
    env.ENGINE === "sigma"
      ? [{ engine: "Stable" }, { engine: "Sigma" }]
      : [{ engine: "Stable" }];

  describe.each(engines)("$engine", ({ engine }) => {
    let engines = {
      sigma: engine === "Sigma" ? globalThis : nullProxy,
      stable: engine === "Stable" ? globalThis : nullProxy,
      engine: { sigma: engine === "Sigma", stable: engine === "Stable" },
    };

    beforeEach(() => {
      globalThis.__SIGMA__ = engines.engine.sigma;
    });

    fn(engines);
  });
}
