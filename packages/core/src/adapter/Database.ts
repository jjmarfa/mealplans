import AdapterNoImplementationError from "../errors/AdapterNoImplementationError";

export type SearchOperators = "==" | "!=" | "<" | "<=" | ">" | ">=";
export type SearchConditions<T, K extends keyof T> = [
  K,
  SearchOperators,
  T[K],
][];
export type SearchPagination = {
  page: number;
  limit: number;
};

export type ListOptions = {
  limit?: number;
  order?: [string, "asc" | "desc"];
};

class DatabaseAdapter {
  async transaction(_callback: any) {
    throw new AdapterNoImplementationError();
  }

  async create<T>(_model: string, _params: any): Promise<T> {
    throw new AdapterNoImplementationError();
  }

  async update<T>(_model: string, _id: string, _params: any): Promise<T> {
    throw new AdapterNoImplementationError();
  }

  async delete(_model: string, _id: string): Promise<void> {
    throw new AdapterNoImplementationError();
  }

  async find<T>(_model: string, _id: string): Promise<T> {
    throw new AdapterNoImplementationError();
  }

  async list<T>(
    _model: string,
    _params: SearchConditions<T, keyof T>,
    _options?: ListOptions
  ): Promise<T[]> {
    throw new AdapterNoImplementationError();
  }

  async search<T>(
    _model: string,
    _query: string,
    _fields: any,
    _params?: SearchConditions<T, keyof T>,
    _pagination?: SearchPagination
  ): Promise<T[]> {
    throw new AdapterNoImplementationError();
  }
}

export default DatabaseAdapter;
