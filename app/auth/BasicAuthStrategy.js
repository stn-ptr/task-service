const { Buffer } = require("node:buffer");
const AuthStrategy = require("./AuthStrategy");

/**
 * Basic Authentication Strategie
 */
class BasicAuthStrategy extends AuthStrategy {
  
  authenticate(req) {
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
      
      // Hier würden Sie normalerweise gegen eine Datenbank/User-Store prüfen
      if (this.validateCredentials(username, password)) {
        return {
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

  validateCredentials(username, password) {
    // TODO: Implementierung gegen echten User-Store
    // Für Demo: hardcoded credentials
    const validUsers = this.config.users || {
      "admin": "password123",
      "user": "secret"
    };
    
    return validUsers[username] === password;
  }
}

module.exports = BasicAuthStrategy;
