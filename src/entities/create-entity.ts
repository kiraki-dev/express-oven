import { getContext } from "../context-handler";
import { Entity } from "../typing-utils/entity";
import { DataAdapter, DocRef } from "../typing-utils/data-adapter";
import { IdType, KeyWithIdValue } from "../typing-utils/misc";

interface SendResponseHandlerOptions {
  statusCode?: number;
}

interface Interceptors<T> {
  create?: (
    model: any,
    handlers: {
      save: (item: T) => Promise<DocRef<T>>,
      sendResponse: (item: any, options?: SendResponseHandlerOptions) => Promise<void>,
    },
  ) => Promise<T>;
  update?: (
    model: any,
    handlers: {
      save: (item: T) => Promise<DocRef<T>>,
      sendResponse: (item: any, options?: SendResponseHandlerOptions) => Promise<void>,
    },
  ) => Promise<T>;
  patch?: (
    model: any,
    handlers: {
      save: (item: Partial<T>) => Promise<DocRef<T>>,
      sendResponse: (item: any, options?: SendResponseHandlerOptions) => Promise<void>,
    },
  ) => Promise<T>;
  delete?: (
    model: any,
    handlers: {
      save: (id: IdType) => Promise<DocRef<T>>,
      sendResponse: (item: any, options?: SendResponseHandlerOptions) => Promise<void>,
    },
  ) => Promise<T>;
  readMany?: (
    model: any,
    handlers: {
      sendResponse: (item: any, options?: SendResponseHandlerOptions) => Promise<void>,
    },
  ) => Promise<T>;
  read?: (
    model: any,
    handlers: {
      sendResponse: (item: any, options?: SendResponseHandlerOptions) => Promise<void>,
    },
  ) => Promise<T>;
}

interface CreateEntityConfigs<T> {
  idField: KeyWithIdValue<T>
}

export const createEntity = <T extends Record<any, any>>(
  adapter: DataAdapter<T>,
  configs: CreateEntityConfigs<T>,
  interceptors?: Interceptors<T>,
): Entity<T> => {
  const create = async (model?: any) => {
    const { req } = getContext();

    const save = async (data: T) => {
      const docRef = adapter.ref();
      await docRef.set(data);

      return docRef;
    }

    if (interceptors?.create) {
      await interceptors.create(model ?? req.body, { save, sendResponse });
    } else {
      const saved = await save(model ?? JSON.parse(req.body));
      await sendResponse(await saved.get() ?? JSON.parse(req.body));
    }
  };

  const update = async (update?: any) => {
    const { req, options: { getEntityId } } = getContext();

    const save = async (data: T) => {
      const id = getEntityId?.(req) ?? data[configs.idField];
      const docRef = adapter.ref(id);
      await docRef.update(data);

      return docRef;
    }

    if (interceptors?.update) {
      await interceptors.update(update ?? req.body, { save, sendResponse });
    } else {
      const saved = await save(update ?? JSON.parse(req.body));
      await sendResponse(await saved.get() ?? JSON.parse(req.body));
    }
  };

  const patch = async (update?: any) => {
    const { req, options: { getEntityId } } = getContext();

    const save = async (data: Partial<T>) => {
      const id = getEntityId?.(req) ?? data[configs.idField];
      const docRef = adapter.ref(id);
      const item = await docRef.get();
      await docRef.update({ ...data, ...item });

      return docRef;
    }

    if (interceptors?.patch) {
      await interceptors.patch(update ?? req.body, { save, sendResponse });
    } else {
      const saved = await save(update ?? JSON.parse(req.body));
      await sendResponse(await saved.get() ?? JSON.parse(req.body));
    }
  };

  const readMany = async () => {
    const { req, options: { getQuery } } = getContext();
    const query = getQuery?.(req);
    const docRefs = await adapter.query(query);
    const data = await Promise.all(docRefs.map((ref) => ref.get()));

    if (interceptors?.readMany) {
      await interceptors.readMany(data, { sendResponse });
    } else {
      await sendResponse(data);
    }
  };

  const read = async () => {
    const { req, options: { getEntityId } } = getContext();
    const id = getEntityId(req);
    const docRef = await adapter.ref(id);
    const data = await docRef.get();

    if (interceptors?.read) {
      await interceptors.read(data, { sendResponse });
    } else {
      await sendResponse(data);
    }
  }

  const deleteHandler = async () => {
    const { req } = getContext();
    const save = async (id: IdType) => {
      const docRef = adapter.ref(id);
      await docRef.delete();

      return docRef;
    }

    if (interceptors?.delete) {
      await interceptors.delete(req.body, { save, sendResponse });
    } else {
      const saved = await save(JSON.parse(req.body));
      await sendResponse(await saved.get() ?? JSON.parse(req.body));
    }
  };

  return {
    create,
    update,
    patch,
    readMany,
    read,
    delete: deleteHandler,
  }
};

const sendResponse = async (data: any, options?: SendResponseHandlerOptions) => {
  const { res } = getContext();
  options?.statusCode && res.status(options.statusCode);
  data ? res.send(data) : res.end();
};
