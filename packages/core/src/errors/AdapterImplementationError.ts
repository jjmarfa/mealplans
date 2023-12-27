export default class AdapterImplementationError extends Error {
  constructor(adapterName: string, adapterFnName: string, message: string) {
    super(`${adapterName}.${adapterFnName}: ${message}`);
    this.name = "AdapterImplementationError";
  }
}
