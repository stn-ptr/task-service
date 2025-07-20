const fs = require("node:fs");

const defaultDataDir = "./data/task/"
const extension = ".json"

function save(task, callback) {
  fs.writeFile(
    defaultDataDir + task.id + extension,
    JSON.stringify(task, null, 2),
    task, err => callback(task, err)
  );
}

exports.save = save