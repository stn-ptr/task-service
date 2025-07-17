const fs = require("node:fs");
const crypto = require("node:crypto");

function create(description) {

    task = {
        id: crypto.randomUUID(),
        description: description,
        created: Date.now(),
        modified: Date.now(),
    }

    fs.writeFile("../data/task/" + task.id + ".json", JSON.stringify(task, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        }
    });
    
    return task;
}

module.exports = { create };