const { resolve } = require("path");
const { name } = require("./package.json");
const toCamelCase = src => src.replace(/-(\w)/g, ($0, $1) => $1.toUpperCase());
let libraryName = name;
let outputFile = libraryName + ".js";

module.exports = {
  entry: {
    main: "./src/index.js"
  },
  output: {
    path: resolve(__dirname, "./dist/"),
    filename: outputFile,
    library: toCamelCase(name),
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  resolve: {
    extensions: [".js", ".vue"]
  },
  devtool: false,
  module: {
    rules: [{
      test: /\.vue$/,
      loader: "vue-loader",
      options: {
        cssSourceMap: false,
        postcss: [
          require("autoprefixer")({
            browsers: ["last 10 versions"]
          })
        ]
      }
    }, {
      test: /\.js$/,
      loader: "babel-loader",
      exclude: /node_modules/
    }]
  }
};
