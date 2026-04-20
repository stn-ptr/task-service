const fs = require("fs");
const persistence = require("./persistence/file/task.js");

const taskConfig = "TASK_CONFIG";
const taskData = "TASK_DATA";

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
  const process = require("node:process");

  const cmdConfig = getConfigFile(process.argv);
  const configFile = cmdConfig ? cmdConfig : process.env[taskConfig];
  if (configFile) {
    try {
      const fileContents = fs.readFileSync(configFile, configFileOptions);
      let config = JSON.parse(fileContents);

      const dataDir = process.env[taskData];
      if (dataDir) {
        config.data = dataDir;
      }

      return config;
    } catch (e) {
      console.error(String(e));
      process.exit(1);
    }
  }
}

function setup(dataDir) {
  persistence.setup(dataDir);
}

exports.setup = setup;
exports.getConfig = getConfig;
