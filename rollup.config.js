const vue = require("rollup-plugin-vue2");
const buble = require("rollup-plugin-buble");
const minify = require("rollup-plugin-minify");
const { name } = require("./package.json");
const { argv } = require("yargs");
const toCamelCase = src => src.replace(/-(\w)/g, ($0, $1) => $1.toUpperCase());
const body = {
  entry: "src/index.js",
  plugins: [
    vue(),
    buble()
  ]
};
if (argv.umd) {
  body.moduleName = toCamelCase(name);
  body.sourceMap = true;
  body.format = "umd";
  body.dest = `dist/${name}.umd.js`;
  body.plugins.push(minify({ umd: `dist/${name}.min.js` }));
} else {
  body.dest = `dist/${name}.common.js`;
  body.format = "cjs";
}
export default body;
