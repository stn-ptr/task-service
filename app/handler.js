const task = require("./task/task.js");
const { authenticate } = require("./auth/auth.js");

function postTask(req, res) {
  const authentication = authenticate(req);
  if (!authentication) {
    sendAccessDenied(res);
    return;
  }

    const userId = authentication.id;

    let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

    req.on("end", () => {
        try {
            const requestBody = JSON.parse(body);
            task.create(requestBody.title, userId, (task, err) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({error: String(err)}));
                }

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(task));
      });
    } catch {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "error creating the task" }));
    }
  });
}

function getTask(req, res) {
  const authentication = authenticate(req);
  if (!authentication) {
    sendAccessDenied(res);
    return;
  }

    const taskId = req.url.split("/").pop();
    const userId = authentication.id;
    task.get(taskId, userId, (task, err) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Task not found" }));
            return;
        }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(task));
  });
}

function deleteTask(req, res) {
    const authentication = authenticate(req);       
    if (!authentication) {
        sendAccessDenied(res);
        return;
    }
    const id = req.url.split("/").pop();
    const userId = authentication.id;
    task.remove(id, userId, (task, err) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Task not found" }));
            return;
        }

    res.writeHead(200);
    res.end(JSON.stringify(task));
  });
}

function updateTask(req, res) {
  const authentication = authenticate(req);
  if (!authentication) {
    sendAccessDenied(res);
    return;
  }

    const userId = authentication.id;

    const id = req.url.split("/").pop();
    let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

    req.on("end", () => {
        try {
            const requestBody = JSON.parse(body);
            task.update(id, userId, requestBody.title, requestBody.done, (task, err) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: String(err) }));
                    return;
                }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(task));
      });
    } catch {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "error updating the task" }));
    }
  });
}

function getAllTasks(req, res) {
    const authentication = authenticate(req);
    if (!authentication) {
        sendAccessDenied(res);
        return;
    }
    const userId = authentication.id;
    task.getAll(userId, (tasks, err) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: String(err) }));
            return;
        }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(tasks));
  });
}

function sendAccessDenied(res) {
  res.statusCode = 401;
  res.setHeader("WWW-Authenticate", 'Basic realm="task-service"');
  res.end("Access denied");
}

exports.getTask = getTask;
exports.postTask = postTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
exports.getAllTasks = getAllTasks;
