const { authenticate } = require("./authStrategyBasic.js");

function createStrategy(type, config) {
    switch (type.toLowerCase()) {
        case "basic": {
            return function(req) { return authenticate(req, config); }
        }
        default:
            throw new Error(`unknown authentication strategy: ${type}`);
    }
}

exports.createStrategy = createStrategy;
