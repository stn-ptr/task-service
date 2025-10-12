const { getConfig } = require("../config.js")
const AuthStrategyFactory = require("./AuthStrategyFactory");

/**
 * Authentifiziert eine Anfrage gegen alle konfigurierten Strategien
 * @param {Object} req - HTTP Request Object
 * @returns {Object|null} User-Objekt oder null
 */
function authenticate(req) {
  const config = getConfig()
  const strategies = setupStrategies(config);
  for (const strategy of strategies) {
    try {
      const result = strategy.authenticate(req, config);
      if (result && result.authenticated) {
        console.log(`Erfolgreich authentifiziert mit ${strategy.getName()}`);
        return result;
      }
    } catch (error) {
      console.warn(`Fehler bei ${strategy.getName()}:`, error.message);
    }
  }

  console.log("Authentifizierung fehlgeschlagen - keine Strategie erfolgreich");
  return null;
}

function setupStrategies(config) {
  const strategies = []
  const authConfig = config?.authentication || {};    
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

exports.authenticate = authenticate;
