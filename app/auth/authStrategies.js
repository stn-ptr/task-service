const basicStrategy = require("./authStrategyBasic.js");
const JwtAuthStrategy = require("./JwtAuthStrategy");

function createStrategy(type, config) {
    switch (type.toLowerCase()) {
        case "basic": {
            return function(req) { return basicStrategy.authenticate(req, config); }
        }
        case "bearer":
        case "jwt": { const jwtStrategy = new JwtAuthStrategy();
            jwtStrategy.initialize(config);
            return jwtStrategy;
        }

        default:
            throw new Error(`unknown authentication strategy: ${type}`);
    }
}

exports.createStrategy = createStrategy;
