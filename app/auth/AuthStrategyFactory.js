const BasicAuthStrategy = require("./BasicAuthStrategy");

/**
 * Factory für Authentifizierungsstrategien
 */
class AuthStrategyFactory {
  
  static createStrategy(type, config) {
    switch (type.toLowerCase()) {
      case "basic":
        const basicStrategy = new BasicAuthStrategy();
        basicStrategy.initialize(config);
        return basicStrategy;
      
      default:
        throw new Error(`Unbekannte Authentifizierungsstrategie: ${type}`);
    }
  }

  static getAvailableStrategies() {
    return ["basic"];
  }
}

module.exports = AuthStrategyFactory;
