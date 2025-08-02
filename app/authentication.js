const { getConfig } = require("./config.js");
const AuthenticationManager = require("./auth/AuthenticationManager");

// Singleton-Instanz des AuthenticationManagers
let authManager = null;

function getAuthenticationManager() {
  if (!authManager) {
    const config = getConfig();
    authManager = new AuthenticationManager(config);
  }
  return authManager;
}

function authenticate(req) {
  const manager = getAuthenticationManager();
  return manager.authenticate(req);
}

// Legacy-Funktion für Rückwärtskompatibilität
function legacyAuthenticate(req) {
  const { Buffer } = require("node:buffer");
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

module.exports = {
  authenticate,
  getAuthenticationManager,
  legacyAuthenticate // Für Rückwärtskompatibilität
};
