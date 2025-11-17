const BasicAuthStrategy = require("./BasicAuthStrategy");

/**
 * Factory for authentication strategies
 */
function createStrategy(type, config) {
    switch (type.toLowerCase()) {
        case "basic": {
            const basicStrategy = new BasicAuthStrategy();
            basicStrategy.initialize(config);
            return basicStrategy;
        }
        default:
            throw new Error(`Unbekannte Authentifizierungsstrategie: ${type}`);
    }
}

module.exports = createStrategy;
