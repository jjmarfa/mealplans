export default class AdapterNoImplementationError extends Error {
  constructor() {
    super("Adapter has no implementation");
    this.name = "AdapterNoImplementation";
  }
}
