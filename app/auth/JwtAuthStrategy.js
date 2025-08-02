const AuthStrategy = require("./AuthStrategy");

/**
 * JWT (JSON Web Token) Authentication Strategie
 * Hinweis: Für Production sollten Sie eine bewährte JWT-Bibliothek wie 'jsonwebtoken' verwenden
 */
class JwtAuthStrategy extends AuthStrategy {
  
  authenticate(req) {
    const header = req.headers["authorization"] || "";

    if (!header.startsWith("Bearer ")) {
      return null;
    }

    try {
      const token = header.substring(7); // Remove "Bearer "
      const payload = this.verifyToken(token);
      
      if (payload) {
        return {
          userId: payload.sub,
          username: payload.username,
          authMethod: "jwt",
          authenticated: true,
          expires: payload.exp,
          scopes: payload.scopes || []
        };
      }
      
      return null;
    } catch (error) {
      console.warn("JWT verification error:", error.message);
      return null;
    }
  }

  verifyToken(token) {
    // WARNUNG: Dies ist eine vereinfachte JWT-Implementierung nur für Demo!
    // Für Production verwenden Sie eine echte JWT-Bibliothek mit Signatur-Verifikation
    
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
      
      // Prüfe Ablaufzeit
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return null; // Token abgelaufen
      }

      return payload;
    } catch (error) {
      return null;
    }
  }

  // Hilfsmethode zum Erstellen von Tokens (für Login-Endpoint)
  createToken(userId, username, scopes = []) {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      sub: userId,
      username: username,
      scopes: scopes,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (this.config.tokenLifetime || 3600) // 1 Stunde
    };

    // WARNUNG: Vereinfachte Implementierung - verwenden Sie jsonwebtoken für Production!
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    
    return `${encodedHeader}.${encodedPayload}.fake-signature`;
  }
}

module.exports = JwtAuthStrategy;
