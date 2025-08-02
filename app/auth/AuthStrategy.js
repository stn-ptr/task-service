/**
 * Basis-Interface für alle Authentifizierungsstrategien
 */
class AuthStrategy {
  /**
   * Authentifiziert eine Anfrage
   * @param {Object} req - HTTP Request Object
   * @returns {Object|null} User-Objekt oder null wenn nicht authentifiziert
   */
  authenticate(req) {
    throw new Error("authenticate() muss in der abgeleiteten Klasse implementiert werden");
  }

  /**
   * Name der Strategie für Logging/Debugging
   * @returns {string}
   */
  getName() {
    return this.constructor.name;
  }

  /**
   * Initialisiert die Strategie mit Konfiguration
   * @param {Object} config - Konfigurationsobjekt
   */
  initialize(config) {
    this.config = config || {};
  }
}

module.exports = AuthStrategy;
