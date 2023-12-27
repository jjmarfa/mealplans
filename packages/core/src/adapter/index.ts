import AuthAdapter from "./Auth";
import DatabaseAdapter from "./Database";

interface AdapterConfig {
  database: DatabaseAdapter;
  auth: AuthAdapter;
}

/**
 * Adapter class
 *
 * Handles the bridge between the core and the adapters
 */
class Adapter {
  private database: DatabaseAdapter;
  private auth: AuthAdapter;

  constructor(adapter: AdapterConfig) {
    this.database = adapter.database;
    this.auth = adapter.auth;
  }

  /**
   * Setup the adapter
   * @param adapter
   */
  setup(adapter: AdapterConfig) {
    this.database = adapter.database;
    this.auth = adapter.auth;
  }

  getDatabase() {
    return this.database;
  }

  getAuth() {
    return this.auth;
  }
}

const adapter = new Adapter({
  database: new DatabaseAdapter(),
  auth: new AuthAdapter(),
});

export default adapter;
