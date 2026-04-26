const fs = require("node:fs");

const defaultDataDir = "./data/task/";
const extension = ".json";

let dataLocation = defaultDataDir;

function setup(dataDir) {
  dataLocation = dataDir ? dataDir : defaultDataDir;
  fs.mkdirSync(dataLocation, { recursive: true });
}

function save(task, callback) {
  fs.writeFile(
    dataLocation + task.id + extension,
    JSON.stringify(task, null, 2),
    task,
    (err) => callback(task, err),
  );
}

function load(id, callback) {
  fs.readFile(dataLocation + id + extension, "utf8", (err, data) => {
    if (err) {
      return callback(null, err);
    }
    try {
      const task = JSON.parse(data);
      callback(task, null);
    } catch (parseError) {
      callback(null, parseError);
    }
  });
}

function remove(id, callback) {
  fs.unlink(dataLocation + id + extension, (err) => {
    callback(err);
  });
}

function list(callback) {
  fs.readdir(dataLocation, (err, files) => {
    if (err) {
      return callback(null, err);
    }
    const tasks = [];
    files.forEach((file) => {
      if (file.endsWith(extension)) {
        const id = file.slice(0, -extension.length);
        tasks.push(id);
      }
    });
    callback(tasks, null);
  });
}

exports.save = save;
exports.load = load;
exports.remove = remove;
exports.list = list;
exports.setup = setup;
