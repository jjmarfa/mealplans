export default class AuthorizationError extends Error {
  constructor(entity: string, id: string) {
    super(`User does not own ${entity} - ${id}`);
    this.name = "AuthorizationError";
  }
}
