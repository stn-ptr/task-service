const { getConfig } = require("../config.js")
const { createStrategy } = require("./authStrategies.js");

/**
 * authenticates an incoming request using all configured strategies
 * @param {Object} req - HTTP request object
 * @returns {Object|null} user object or null
 */
function authenticate(req) {
  const config = getConfig()
  const strategies = setupStrategies(config);
  for (const strategy of strategies) {
    try {
      const result = strategy(req);
      if (result && result.authenticated) {
        return result;
      }
    } catch (error) {
      console.warn("authentication error:", error.message);
    }
  }

  console.log("authentication failed - no strategy was successful");
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
        strategy = createStrategy(methodConfig, authConfig[methodConfig]);
      } else {
        if (methodConfig.enabled !== false) {
          strategy = createStrategy(methodConfig.type, methodConfig.config);
        }
      }

      if (strategy) {
        strategies.push(strategy);
      }
    } catch (error) {
      console.error("error loading authentication strategy:", error.message);
    }
  });

  if (strategies.length === 0) {
    console.warn("no authentication method configured - all requests will be denied!");
  }
  return strategies;
}

exports.authenticate = authenticate;
