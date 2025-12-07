"use strict";

const fs = require("fs");
const { getConfig, setup } = require("./config.js");
const { app } = require("./app.js");

const config = getConfig();
setup();

let httpOptions, server;
if (config !== undefined && config["HttpsOptions"] !== undefined) {
  const keyFileName = config.HttpsOptions.key;
  const certFileName = config.HttpsOptions.cert;
  try {
    httpOptions = {
      key: fs.readFileSync(keyFileName),
      cert: fs.readFileSync(certFileName),
    };
  } catch (e) {
    console.warn(String(e));
  }
} else {
  httpOptions = {};
}

if (httpOptions && httpOptions.key && httpOptions.cert) {
  server = require("node:https");
} else {
  server = require("node:http");
}

server.createServer(httpOptions, app).listen(3000);
