const { Buffer } = require("node:buffer");

function authenticate(req) {
  const header = req.headers["authorization"] || "";

  if (header.length !== 0) {
    const token = header.split(/\s+/).pop() || "";
    const auth = Buffer.from(token, "base64").toString();
    const parts = auth.split(/:/);
    return {
      username: parts[0],
      password: parts[1],
    };
  }

  return undefined;
}

exports.authenticate = authenticate;
