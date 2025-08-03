const crypto = require("node:crypto");

const persistence = require("../persistence/file/task");

function create(title, callback) {
  const task = {
    id: crypto.randomUUID(),
    title: title,
    created: Date.now(),
    modified: Date.now(),
  };

  persistence.save(task, (task, err) => callback(task, err));
}

function get(id, callback) {
  persistence.load(id, (task, err) => {
    if (err) {
      return callback(null, err);
    }

    publicTask = {
      id: task.id,
      title: task.title,
      done: task.done ? true: false,
    }

    callback(publicTask, null);
  });
}

module.exports = { create, get };
