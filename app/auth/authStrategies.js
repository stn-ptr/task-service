const basicStrategy = require("./authStrategyBasic.js");
const ApiKeyStrategy = require("./ApiKeyStrategy")

function createStrategy(type, config) {
    switch (type.toLowerCase()) {
        case "basic": {
            return function(req) { return basicStrategy.authenticate(req, config); }
        }

        case "apikey":
        case "api-key":{
            const apiKeyStrategy = new ApiKeyStrategy();
            apiKeyStrategy.initialize(config);
            return apiKeyStrategy;
        }

        default:
            throw new Error(`unknown authentication strategy: ${type}`);
    }
}

exports.createStrategy = createStrategy;
