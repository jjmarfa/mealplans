import adapter from "../adapter";
import DatabaseAdapter, {
  ListOptions,
  SearchConditions,
  SearchPagination,
} from "../adapter/Database";
import { RepositorySearchError } from "../errors/RepositorySearchError";

/**
 * BaseRepository is a generic class that provides basic CRUD operations for a given model.
 * It uses a database adapter and a search engine adapter to perform the operations.
 */
class BaseRepository<Entity> {
  private database: DatabaseAdapter;
  protected searchable: readonly (keyof Entity)[] = [] as const;
  protected model: string = "Base" as const;

  constructor(database?: any) {
    this.database = database || adapter.getDatabase();
  }

  /**
   * Creates a new record in the database and indexes it in the search engine.
   */
  async create(params: Omit<Entity, "id"> & { id?: string }): Promise<Entity> {
    const result = await this.database.create<Entity>(this.model, params);

    return result;
  }

  /**
   * Updates a record in the database and search engine with the given ID and parameters.
   */
  async update(id: string, params: any) {
    return this.database.update<Entity>(this.model, id, params);
  }

  /**
   * Deletes a document from the database and search engine by its ID.
   * @param id The ID of the document to delete.
   * @returns A Promise that resolves when the document has been deleted from both the database and search engine.
   */
  async delete(id: string) {
    return this.database.delete(this.model, id);
  }

  /**
   * Finds a record in the database by its ID.
   */
  async find(id: string) {
    return this.database.find<Entity>(this.model, id);
  }

  async list<EntityKeys extends keyof Entity>(
    query: SearchConditions<Entity, EntityKeys>,
    options: ListOptions
  ) {
    return this.database.list<Entity>(this.model, query, options);
  }

  /**
   * Searches for items in the search engine based on a given text based on the fields specified.
   */
  async search<
    SearchableKeys extends (typeof this.searchable)[number],
    EntityKeys extends keyof Entity,
  >(
    text: string,
    field: SearchableKeys,
    params?: SearchConditions<Entity, EntityKeys>,
    pagination?: SearchPagination
  ): Promise<Entity[]> {
    if (!this.searchable.includes(field)) {
      throw new RepositorySearchError(String(field));
    }

    return this.database.search(this.model, text, field, params, pagination);
  }
}

export default BaseRepository;
