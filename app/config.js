const fs = require("fs");
const persistence = require("../persistence/file/task.js")

const configFileOptions = { encoding: "utf8" };

function getConfigFile(args) {
  const configParam = "--ConfigurationFile=";
  let configFile = undefined;
  args.forEach(function (arg) {
    const finds = arg.search(configParam);
    configFile = finds >= 0 ? arg.slice(configParam.length) : configFile;
  });
  return configFile;
}

function getConfig() {
  const process = require("node:process")
  const configFile = getConfigFile(process.argv);
  if (configFile) {
    try {
      const fileContents = fs.readFileSync(configFile, configFileOptions);
      return JSON.parse(fileContents);
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  }
}

function setup() {
  persistence.setup();
}

exports.setup = setup;
exports.getConfig = getConfig;
