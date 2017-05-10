#!/usr/bin/env node
var argv = require("yargs")
  .usage("Usage: $0 [options]")
  .example("$0 -f index.js", "注入version banner  至 index.js")
  .alias("f", "file")
  .nargs("f", 1)
  .describe("f", "指定要注入banner的文件")
  .demandOption(["f"])
  .help("h")
  .alias("h", "help")
  .epilog("copyright 2017")
  .locale("Chinese").argv;

const path = require("path");
const prependFile = require("prepend-file");

var filePath = argv.file;
var homeReg = /^~/;
if (homeReg.test(filePath)) {
  filePath = filePath.replace(homeReg, process.env.HOME);
} else if (!path.isAbsolute(filePath)) {
  filePath = path.resolve(process.cwd(), filePath);
}


try {
  var pkgFile = require(path.join(process.cwd(), "package.json"));
  var banner = `window["____${pkgFile.name}____version"]="${pkgFile.version}";\n`;
  prependFile(filePath, banner, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("修改成功！");
  });
} catch (e) {
  console.log(e);
}
