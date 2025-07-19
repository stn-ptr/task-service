const task = require("../task/task.js");

function app(req, res) {
  const header = req.headers["authorization"] || "";

  if (header.length === 0) {
    res.statusCode = 401;
    res.setHeader("WWW-Authenticate", 'Basic realm="task-service"');
    res.end("Access denied");
  } else {
    const token = header.split(/\s+/).pop() || "";
    const auth = new Buffer(token, "base64").toString();
    const parts = auth.split(/:/);
    const username = parts[0];
    const password = parts[1];
    const url = require("node:url");
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const pathname = parsedUrl.pathname;

    // CORS Headers für Frontend-Zugriff
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // POST /tasks - Neuen Task erstellen
    if (method === "POST" && pathname === "/task") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        try {
          const requestBody = JSON.parse(body);
          const responseBody = task.create(requestBody.title);

          res.writeHead(201, { "Content-Type": "text/plain" });
          res.end(JSON.stringify(responseBody));
        } catch (e) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "error creating the task" }));
        }
      });
    }
  }
}

exports.app = app
