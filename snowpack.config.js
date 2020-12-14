module.exports = {
  mount: {
    public: "/gameshow",
    src: "/gameshow/dist",
    web_modules: "/gameshow/dist/web_modules",
  },
  plugins: ["@snowpack/plugin-dotenv"],
  experiments: {
    routes: [{ src: ".*", dest: "/gameshow/404.html", match: "routes" }],
  },
  buildOptions: {
    metaDir: "/gameshow/dist/snowpack",
    webModulesUrl: "/gameshow/dist/web_modules",
    minify: false,
    clean: true,
  },
};
