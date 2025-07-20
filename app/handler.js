const task = require("../task/task.js");
const { authenticate } = require("./authentication.js");

function postTask(req, res) {
    const authentication = authenticate(req);
    if (!authentication) {
        res.statusCode = 401;
        res.setHeader("WWW-Authenticate", 'Basic realm="task-service"');
        res.end("Access denied");
        return;
    }

    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try {
            const requestBody = JSON.parse(body);
            task.create(requestBody.title, (task, err) => {
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

exports.postTask = postTask