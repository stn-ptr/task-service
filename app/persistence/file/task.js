const fs = require("node:fs");

const extension = ".json";
const defaultDataDir = "./data/";
const defaultUsersDir = `${defaultDataDir}users/`;
const taskDir = (userId) => `${defaultUsersDir}${userId}/tasks/`
const taskFile = (taskId, userId) => `${taskDir(userId)}${taskId}${extension}`;

let dataLocation = defaultDataDir;

function setup() {
  dataLocation = dataDir ? dataDir : defaultDataDir;
  fs.mkdirSync(dataLocation, { recursive: true });
}

function save(task, userId, callback) {
  const dir = taskDir(userId);
  fs.mkdir(dir, { recursive: true }, (mkdirErr) => {
    if (mkdirErr) {
      return callback(null, mkdirErr);
    }
    fs.writeFile(
      taskFile(task.id, userId),
      JSON.stringify(task, null, 2),
      (err) => callback(task, err)
    );
  });
}

function load(taskId, userId, callback) {
  fs.readFile(
    taskFile(taskId, userId),
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

function remove(taskId, userId, callback) {
    fs.unlink(taskFile(taskId, userId), err => {
      callback(err);
    });
}

function list(userId, callback) {
  const dir = taskDir(userId);
  fs.readdir(dir, (err, files) => {
    if (err) {
      if (err.code === "ENOENT") {
        return callback([], null);
      }
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
