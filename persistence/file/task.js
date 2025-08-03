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

function load(id, callback) {
  fs.readFile(
    defaultDataDir + id + extension,
    "utf8",
    (err, data) => {
      if (err) {
        return callback(null, err);
      }
      try {
        const task = JSON.parse(data);
        callback(task, null);
      } catch (parseError) {
        callback(null, parseError);
      }
    }
  );
}

exports.save = save
exports.load = load
