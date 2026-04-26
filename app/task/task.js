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

    const publicTask = {
      id: task.id,
      title: task.title,
      done: task.done ? true : false,
    };

    callback(publicTask, null);
  });
}

function remove(id, callback) {
  persistence.load(id, (task, err) => {
    if (err) {
      return callback(null, err);
    }

    persistence.remove(id, (err) => {
      if (err) {
        return callback(null, err);
      }
      callback(task, null);
    });
  });
}

function update(id, title, done, callback) {
  persistence.load(id, (task, err) => {
    if (err) {
      return callback(null, err);
    }

    const timestamp = Date.now();

    if (title !== undefined) {
      task.title = title;
    }

    if (done !== undefined) {
      if (done === true) {
        if (task.done === undefined) {
          task.done = timestamp;
        }
      } else {
        if (done === false) {
          delete task.done;
        }
      }
    }

    task.modified = timestamp;

    persistence.save(task, (task, err) => callback(task, err));
  });
}

function getAll(callback) {
  persistence.list((tasks, err) => {
    if (err) {
      callback(null, err);
      return;
    }

    callback(tasks, null);
  });
}

module.exports = { create, get, remove, update, getAll };
