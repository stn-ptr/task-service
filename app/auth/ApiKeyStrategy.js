const AuthStrategy = require("./AuthStrategy");

/**
 * API Key Authentication Strategie
 */
class ApiKeyStrategy extends AuthStrategy {
  
  authenticate(req) {
    // API Key kann in verschiedenen Headern oder Query-Parametern sein
    const apiKey = req.headers["x-api-key"] || 
                   req.headers["authorization"]?.replace("Bearer ", "") ||
                   req.query?.apikey;

    if (!apiKey) {
      return null;
    }

    if (this.validateApiKey(apiKey)) {
      return {
        apiKey: apiKey.substring(0, 8) + "...", // Für Logging, nicht den ganzen Key
        authMethod: "apikey",
        authenticated: true,
        // API Keys können verschiedene Rollen/Scopes haben
        scopes: this.getApiKeyScopes(apiKey)
      };
    }

    return null;
  }

  validateApiKey(apiKey) {
    const validApiKeys = this.config.apiKeys || [
      "sk-1234567890abcdef",
      "ak-fedcba0987654321"
    ];
    
    return validApiKeys.includes(apiKey);
  }

  getApiKeyScopes(apiKey) {
    const keyScopes = this.config.keyScopes || {};
    return keyScopes[apiKey] || ["read"];
  }
}

module.exports = ApiKeyStrategy;
