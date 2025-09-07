const AuthStrategyFactory = require("./AuthStrategyFactory");

/**
 * Hauptklasse für Authentifizierung mit Strategy Pattern
 * Unterstützt multiple Strategien und Chain of Responsibility
 */
class AuthenticationManager {
  
  constructor(config = {}) {
    this.strategies = [];
    this.config = config;
    setupStrategies(this.config);
  }

  /**
   * Authentifiziert eine Anfrage gegen alle konfigurierten Strategien
   * @param {Object} req - HTTP Request Object
   * @returns {Object|null} User-Objekt oder null
   */
  authenticate(req) {
    // Versuche alle Strategien nacheinander (Chain of Responsibility)
    for (const strategy of this.strategies) {
      try {
        const result = strategy.authenticate(req);
        if (result && result.authenticated) {
          console.log(`Erfolgreich authentifiziert mit ${strategy.getName()}`);
          return result;
        }
      } catch (error) {
        console.warn(`Fehler bei ${strategy.getName()}:`, error.message);
        // Weiter mit nächster Strategie
      }
    }

    console.log("Authentifizierung fehlgeschlagen - keine Strategie erfolgreich");
    return null;
  }

  /**
   * Middleware-Funktion für Express-ähnliche Frameworks
   */
  middleware() {
    return (req, res, next) => {
      const user = this.authenticate(req);
      
      if (user) {
        req.user = user;
        next();
      } else {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          error: "Unauthorized",
          message: "Authentifizierung erforderlich"
        }));
      }
    };
  }

  /**
   * Prüft ob ein Benutzer bestimmte Berechtigungen hat
   */
  hasPermission(user, requiredScopes = []) {
    if (!user || !user.authenticated) {
      return false;
    }

    if (requiredScopes.length === 0) {
      return true; // Keine spezifischen Berechtigungen erforderlich
    }

    const userScopes = user.scopes || [];
    return requiredScopes.every(scope => userScopes.includes(scope));
  }
}

function setupStrategies(config) {
  const strategies = []
  const authConfig = config.authentication || {};    
  const methods = authConfig.methods || ["basic"];
    
  methods.forEach(methodConfig => {
    try {
      let strategy;

      if (typeof methodConfig === "string") {
        strategy = AuthStrategyFactory.createStrategy(methodConfig, authConfig[methodConfig]);
      } else {
        // Erweiterte Konfiguration: { type: "basic", enabled: true, config: {...} }
        if (methodConfig.enabled !== false) {
          strategy = AuthStrategyFactory.createStrategy(methodConfig.type, methodConfig.config);
        }
      }

      if (strategy) {
        strategies.push(strategy);
        console.log(`Authentifizierungsstrategie geladen: ${strategy.getName()}`);
      }
    } catch (error) {
      console.error(`Fehler beim Laden der Authentifizierungsstrategie:`, error.message);
    }
  });

  if (strategies.length === 0) {
    console.warn("Keine Authentifizierungsstrategien konfiguriert - alle Anfragen werden abgelehnt!");
  }
  return strategies;
}

module.exports = AuthenticationManager;
