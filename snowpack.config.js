module.exports = {
  mount: {
    public: "/gameshow",
    src: "/gameshow/dist",
  },
  plugins: ["@snowpack/plugin-dotenv"],
  routes: [{ src: ".*", dest: "/gameshow/404.html", match: "routes" }],
  buildOptions: {
    metaUrlPath: "/gameshow/dist/snowpack",
    minify: false,
    clean: true,
  },
};
