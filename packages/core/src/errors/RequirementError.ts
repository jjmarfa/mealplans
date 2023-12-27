export default class RequirementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RequirementError";
  }
}
