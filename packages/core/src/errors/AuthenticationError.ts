export default class AuthenticationError extends Error {
  constructor() {
    super("User not authenticated");
    this.name = "AuthenticationError";
  }
}
