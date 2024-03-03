#!/usr/bin/env node

if (__SIGMA__) {
  module.exports = require("./sigma/cli");
} else {
  module.exports = require("./cli/index");
}
