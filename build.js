const replace = require("replace-in-file");
const { process } = require("cssnano");
const UglifyJS = require("uglify-js");
const rollup = require("rollup");
const vue = require("rollup-plugin-vue2");
const compileStylus = require("stylus");
const cssOnly = require("rollup-plugin-css-only");
const buble = require("rollup-plugin-buble");
const { name } = require("./package.json");
const { unlinkSync, writeFileSync, readFileSync } = require("fs");
const toCamelCase = src => src.replace(/-(\w)/g, ($0, $1) => $1.toUpperCase());
const replaceContent = "__CSS_CONTENT__";
const tmpCssPath = "dist/bundle.css";
const minifyJsPath = `dist/${name}.min.js`;

const moduleName = toCamelCase(name);
const files = [
  { dest: `dist/${name}.cjs.js`, format: "cjs" },
  { dest: `dist/${name}.es.js`, format: "es" },
  { dest: `dist/${name}.umd.js`, format: "umd" }
]
  .map(file => {
    return file.format === "umd" ? Object.assign(file, { moduleName }) : file;
  });
(async () => {
  try {
    const bundle = await rollup.rollup({
      entry: "src/index.js",
      plugins: [
        vue(),
        cssOnly({
          async output (styles) {
            // transform stylus to .css
            const style = compileStylus(styles);
            let css = await style.render();
            /* eslint-disable no-useless-escape */
            css = css.replace(/\"/g, "");
            writeFileSync(tmpCssPath, css);
          }
        }),
        buble()
      ]
    });
    // write .js files
    for (let file of files) {
      await bundle.write(file);
    }
    // minify .css code
    const { css } = await process(readFileSync(tmpCssPath, "utf-8"), { safe: true });
    // replace to .js file
    await replace({
      files: files.map(file => file.dest),
      from: replaceContent,
      to: css
    });
    // minify UMD .js
    const result = UglifyJS.minify(`dist/${name}.umd.js`, {
      outSourceMap: minifyJsPath + ".map"
    });
    // write minify .js file
    writeFileSync(minifyJsPath, result.code, { encoding: "utf8" });
    writeFileSync(minifyJsPath + ".map", result.map, { encoding: "utf8" });
    unlinkSync(tmpCssPath);
    console.log("ok!");
  } catch (error) {
    console.log(error);
  }
})();
