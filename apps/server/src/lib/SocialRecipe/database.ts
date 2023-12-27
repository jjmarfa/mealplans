import {
  AdapterImplementationError,
  DatabaseAdapter,
  SearchConditions,
  SearchPagination,
  ListOptions,
} from "@social-recipes/core";
import { firestore } from "../Firebase";
import getTypesenseClient from "../Typesense";
import { addPrefix, parseOperator } from "../Typesense/helper";
import { SearchParams } from "typesense/lib/Typesense/Documents";
import { TypesenseError } from "typesense/lib/Typesense/Errors";

class Database implements DatabaseAdapter {
  async transaction<T>(
    callback: (dbActions: Omit<DatabaseAdapter, "transaction">) => Promise<T>
  ) {
    const typesenseClient = getTypesenseClient();
    const result = await firestore.runTransaction(async (transaction) => {
      const executables: (() => void)[] = [];

      const res = await callback({
        create: async (collection, data) => {
          const newDoc = firestore.collection(collection).doc();
          const doc = await transaction.get(newDoc);

          executables.push(async () => {
            await transaction.create(doc.ref, { id: newDoc.id, ...data });
            await typesenseClient
              .collections(addPrefix(collection))
              .documents()
              .upsert({ id: newDoc.id, ...data });
          });

          return { id: newDoc.id, ...data };
        },
        update: async (collection, id, data) => {
          const updatedDoc = firestore.collection(collection).doc(id);
          const doc = await transaction.get(updatedDoc);

          executables.push(async () => {
            await transaction.update(doc.ref, data);
            await typesenseClient
              .collections(addPrefix(collection))
              .documents()
              .upsert({ id, ...data });
          });

          return { id, ...data };
        },
        delete: async (collection, id) => {
          const removedDoc = firestore.collection(collection).doc(id);
          const doc = await transaction.get(removedDoc);

          executables.push(async () => {
            await transaction.delete(doc.ref);
            await typesenseClient
              .collections(addPrefix(collection))
              .documents()
              .delete(id);
          });
        },
        find: async <T>(collection: string, id: string) => {
          const findDoc = firestore.collection(collection).doc(id);
          const doc = await transaction.get(findDoc);

          if (!doc.exists) {
            throw new Error("Not Found");
          }

          return doc.data() as T;
        },
        list: async () => {
          throw new Error("Not Applicable on transaction");
        },
        search: async () => {
          throw new Error("Not Applicable on transaction");
        },
      });

      await Promise.all(executables.map((executable) => executable()));

      return res;
    });

    return result;
  }

  async create<T extends { id?: string }>(collection: string, data: T) {
    const typesenseClient = getTypesenseClient();
    let doc;

    try {
      if (data.id) {
        doc = firestore.collection(collection).doc(data.id);
      } else {
        doc = firestore.collection(collection).doc();
      }

      const unix = Math.floor(new Date().getTime() / 1000);

      const createdParams = {
        ...data,
        id: doc.id,
        createdAt: unix,
        updatedAt: unix,
      };
      await doc.create(createdParams);

      await typesenseClient
        .collections(addPrefix(collection))
        .documents()
        .upsert(createdParams);

      return createdParams;
    } catch (e) {
      throw new AdapterImplementationError(
        "FirebaseAdapter",
        "create",
        (e as Error).message
      );
    }
  }

  async update<T>(model: string, id: string, params: any): Promise<T> {
    try {
      const typesenseClient = getTypesenseClient();
      const doc = firestore.collection(model).doc(id);

      const unix = Math.floor(new Date().getTime() / 1000);

      await doc.update({ ...params, updatedAt: unix });

      await typesenseClient
        .collections(addPrefix(model))
        .documents()
        .upsert({ id, ...params });

      return { ...params, id, updatedAt: unix };
    } catch (e) {
      if (e instanceof TypesenseError) {
        throw new AdapterImplementationError(
          "Typesesnse Error",
          "update",
          (e as Error).message
        );
      }
      throw new AdapterImplementationError(
        "FirebaseAdapter",
        "update",
        (e as Error).message
      );
    }
  }

  async delete(model: string, id: string): Promise<void> {
    const typesenseClient = getTypesenseClient();
    const doc = firestore.collection(model).doc(id);

    await typesenseClient.collections(addPrefix(model)).documents().delete(id);

    await doc.delete();
  }

  async find<T>(collection: string, id: string) {
    const doc = firestore.collection(collection).doc(id);
    const result = await doc.get();

    return result.data() as T;
  }

  async list<T>(
    collection: string,
    params: SearchConditions<T, keyof T>,
    options: ListOptions
  ): Promise<T[]> {
    let query: FirebaseFirestore.Query = firestore.collection(collection);
    params.forEach((cond) => {
      const [path, operator, val] = cond;
      query = query.where(String(path), operator, val);
    });

    query = query.limit(options.limit || 10);
    if (options.order) {
      const [orderBy, direction] = options.order;
      query = query.orderBy(orderBy, direction);
    }

    const snap = await query.get();

    return snap.docs.map((doc) => doc.data() as T);
  }

  async search<T>(
    model: string,
    query: string,
    fields: any,
    params?: SearchConditions<T, keyof T>,
    pagination: SearchPagination = {
      page: 1,
      limit: 12,
    }
  ): Promise<T[]> {
    const typesenseClient = getTypesenseClient();
    const filters_by: string[] = [];
    params?.forEach((param) => {
      const [field, operator, value] = param;

      filters_by.push(`${String(field)}:${parseOperator(operator)}${value}`);
    });

    const buildSearch: SearchParams = {
      q: query,
      query_by: fields,
      page: pagination.page,
      per_page: pagination.limit,
    };

    if (filters_by.length > 0) buildSearch.filter_by = filters_by.join("&&");

    const result = await typesenseClient
      .collections(addPrefix(model))
      .documents()
      .search(buildSearch);

    if (result.found === 0) return [];

    const data = await Promise.all(
      (result.hits || []).map(async (hit) =>
        this.find<T>(model, (hit.document as { id: string }).id)
      )
    );

    return data;
  }
}

const database = new Database();

export default database;
