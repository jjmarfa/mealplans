export class RepositorySearchError extends Error {
  constructor(field: string) {
    super(`Field ${field} is not searchable.`);
    this.name = "RepositorySearchError";
  }
}
