module.exports = {
  mount: {
    public: "/gameshow",
    src: "/gameshow/dist",
    web_modules: "/gameshow/dist/web_modules",
  },
  plugins: ["@snowpack/plugin-dotenv"],
  devOptions: {
    fallback: "/gameshow/404.html",
  },
  installOptions: {
    namedExports: ["recoil"],
  },
  buildOptions: {
    metaDir: "/gameshow/dist/snowpack",
    webModulesUrl: "/gameshow/dist/web_modules",
    minify: false,
    clean: true,
  },
};
