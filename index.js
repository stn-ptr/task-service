"use strict";

const https = require("https");
const fs = require("fs");

const configFileOptions = { encoding: "utf8" };

const configFile = getConfigFile(process.argv);

let config = undefined;

if (configFile) {
  fs.exists(configFile, function (exists) {
    if (!exists) {
      process.exit(1);
    }
  });

  const fileContents = fs.readFileSync(configFile, configFileOptions);
  config = JSON.parse(fileContents);
} else {
  process.exit(1);
}

let httpOptions;
if (config !== undefined && config['HttpsOptions'] !== undefined) {
  const keyFileName = config.HttpsOptions.key;
  const certFileName = config.HttpsOptions.cert;
  httpOptions = {
    key: fs.readFileSync(keyFileName),
    cert: fs.readFileSync(certFileName),
  };
} else {
  process.exit(1);
}

https
  .createServer(httpOptions, function (req, res) {
    const header = req.headers["authorization"] || "";

    if (header.length === 0) {
      res.statusCode = 401;
      res.setHeader("WWW-Authenticate", 'Basic realm="task-service"');
      res.end("Access denied");
    } else {
      const token = header.split(/\s+/).pop() || "";
      const auth = new Buffer(token, "base64").toString();
      const parts = auth.split(/:/);
      const username = parts[0];
      const password = parts[1];

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Username: " + username + "; Password: " + password);
    }
  })
  .listen(1337);

function getConfigFile(args) {
  const configParam = "--ConfigurationFile=";
  let configFile = undefined;
  args.forEach(function (arg) {
    const finds = arg.search(configParam);
    configFile =
      finds >= 0
        ? arg.slice(configParam.length)
        : configFile;
  });
  return configFile;
}
