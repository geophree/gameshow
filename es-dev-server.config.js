const { wrapRollupPlugin: wrap } = require("es-dev-server-rollup");
const { nodeResolve: resolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const envify = require("process-envify");

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
};

module.exports = {
  appIndex: "index.html",
  plugins: [
    wrap(resolve()),
    wrap(commonjs()),
    wrap(replace({ ...envify(env) })),
  ],
};
