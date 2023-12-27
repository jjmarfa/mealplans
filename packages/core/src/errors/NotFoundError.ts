export default class NotFoundError extends Error {
  constructor(model: string, id: string) {
    super(`Not Found: ${model} [${id}]`);
    this.name = "NotFoundError";
  }
}
