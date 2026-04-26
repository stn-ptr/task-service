const crypto = require("node:crypto");

const persistence = require("../persistence/file/task");

function create(title, userId, callback) {
  const task = {
    id: crypto.randomUUID(),
    title: title,
    created: Date.now(),
    modified: Date.now(),
  };

  persistence.save(task, userId, (task, err) => callback(task, err));
}

function get(taskId, userId, callback) {
  persistence.load(taskId, userId, (task, err) => {
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

function remove(taskId, userId, callback) {
  persistence.load(taskId, userId, (task, err) => {
    if (err) {  
      return callback(null, err);
    }

    persistence.remove(taskId, userId, (err) => {
      if (err) {
        return callback(null, err);
      }
      callback(task, null);
    });
  });
}

function update(taskId, userId, title, done, callback) {
  persistence.load(taskId, userId, (task, err) => {
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

    persistence.save(task, userId, (task, err) => callback(task, err));
  });
}

function getAll(userId, callback) {
  persistence.list(userId, (tasks, err) => {
    if (err) {
      callback(null, err);
      return;
    }

    callback(tasks, null);
  });
}

module.exports = { create, get, remove, update, getAll };
