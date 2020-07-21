import html from "@open-wc/rollup-plugin-html";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import envify from "process-envify";

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
};

export default {
  input: "index.html",
  output: {
    dir: "dist",
    format: "es",
  },
  plugins: [html(), resolve(), commonjs(), replace({ ...envify(env) })],
};
