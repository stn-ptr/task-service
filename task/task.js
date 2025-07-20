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

module.exports = { create };
