const url = require("node:url");

const handler = require("./handler.js");

function app(req, res) {

  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const pathname = parsedUrl.pathname;

  // CORS Headers für Frontend-Zugriff
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (method === "POST" && pathname === "/task") {
    handler.postTask(req, res)
  }

  if (method === "GET" && pathname.startsWith("/task/")) {
    handler.getTask(req, res);
  }

  if (method === "DELETE" && pathname.startsWith("/task/")) {
    handler.deleteTask(req, res);
  }

  if (method === "PUT" && pathname.startsWith("/task/")) {
    handler.updateTask(req, res);
  }

  if (method === "GET" && pathname === "/task") {
    handler.getAllTasks(req, res);
  }
}

exports.app = app;
