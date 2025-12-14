const { Buffer } = require("node:buffer");
const crypto = require("crypto");

function authenticate(req, config) {
  const header = req.headers["authorization"] || "";

  if (!header.startsWith("Basic ")) {
    return null;
  }

  try {
    const token = header.substring(6); // Remove "Basic "
    const auth = Buffer.from(token, "base64").toString();
    const parts = auth.split(":");

    if (parts.length !== 2) {
      return null;
    }

      const [username, password] = parts;
      
      if (validateCredentials(username, password, config)) {
        const id = config.users[username].id;
        return {
          id,
          username,
          authMethod: "basic",
          authenticated: true
        };
      }
      
      return null;
    } catch (error) {
      console.warn("Basic Auth parsing error:", error.message);
      return null;
    }
  }

function validateCredentials(username, password, config) {
  const users = config && config.users;

  if (!users) {
    return false;
  }

  const user = users[username];
  if (!user || !user.salt || !user.hash) {
    return false;
  }

  const hash = crypto
    .pbkdf2Sync(password, Buffer.from(user.salt, "hex"), 10000, 64, "sha512")
    .toString("hex");
  return hash.toLowerCase() === user.hash.toLowerCase();
}

module.exports.authenticate = authenticate;
