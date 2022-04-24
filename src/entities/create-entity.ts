import { getContext } from "../context-handler";
import { Entity, ReadConfigs } from "../typing-utils/entity";
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
      sendResponse: (options?: SendResponseHandlerOptions) => Promise<void>,
    },
  ) => Promise<T>;
  read?: (
    model: any,
    handlers: {
      sendResponse: (id: IdType, options?: SendResponseHandlerOptions) => Promise<void>,
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
    const { req, res } = getContext();

    const save = async (data: T) => {
      const docRef = adapter.ref();
      await docRef.set(data);

      return docRef;
    }

    const sendResponse = async (data: any, options?: SendResponseHandlerOptions) => {
      options?.statusCode && res.status(options.statusCode);
      data ? res.send(data) : res.end();
    }

    if (interceptors?.create) {
      await interceptors.create(model ?? req.body, { save, sendResponse });
    } else {
      const saved = await save(model ?? JSON.parse(req.body));
      await sendResponse(await saved.get() ?? JSON.parse(req.body));
    }
  };

  const update = async (update?: any) => {
    const { req, res } = getContext();

    const save = async (data: T) => {
      const docRef = adapter.ref(data[configs.idField]);
      await docRef.update(data);

      return docRef;
    }

    const sendResponse = async (data: any, options?: SendResponseHandlerOptions) => {
      options?.statusCode && res.status(options.statusCode);
      data ? res.send(data) : res.end();
    }

    if (interceptors?.update) {
      await interceptors.update(update ?? req.body, { save, sendResponse });
    } else {
      const saved = await save(update ?? JSON.parse(req.body));
      await sendResponse(await saved.get() ?? JSON.parse(req.body));
    }
  };

  const patch = async (update?: any) => {
    const { req, res } = getContext();

    const save = async (data: Partial<T>) => {
      const docRef = adapter.ref(data[configs.idField]);
      const item = await docRef.get();
      await docRef.update({ ...data, ...item });

      return docRef;
    }

    const sendResponse = async (data: any, options?: SendResponseHandlerOptions) => {
      options?.statusCode && res.status(options.statusCode);
      data ? res.send(data) : res.end();
    }

    if (interceptors?.patch) {
      await interceptors.patch(update ?? req.body, { save, sendResponse });
    } else {
      const saved = await save(update ?? JSON.parse(req.body));
      await sendResponse(await saved.get() ?? JSON.parse(req.body));
    }
  };

  const readMany = async () => {
    const { req, res } = getContext();
    const sendResponse = async (options?: SendResponseHandlerOptions) => {
      const docRefs = await adapter.query();
      const data = await Promise.all(docRefs.map((ref) => ref.get()));
      options?.statusCode && res.status(options.statusCode);
      data ? res.send(data) : res.end();
    }

    if (interceptors?.readMany) {
      await interceptors.readMany(req.body, { sendResponse });
    } else {
      await sendResponse();
    }
  };

  const read = async (readConfigs?: ReadConfigs) => {
    const { req, res } = getContext();

    const sendResponse = async (id: IdType, options?: SendResponseHandlerOptions) => {
      const docRef = await adapter.ref(id);
      const data = await docRef.get();
      options?.statusCode && res.status(options.statusCode);
      data ? res.send(data) : res.end();
    }

    if (interceptors?.read) {
      await interceptors.read(
        req.params[readConfigs?.paramMatch[configs.idField as string] ?? configs.idField], { sendResponse }
      );
    } else {
      await sendResponse(
        req.params[readConfigs?.paramMatch[configs.idField as string] ?? configs.idField]
      );
    }
  }

  const deleteHandler = async () => {
    const { req, res } = getContext();
    const save = async (id: IdType) => {
      const docRef = adapter.ref(id);
      await docRef.delete();

      return docRef;
    }

    const sendResponse = async (data: any, options?: SendResponseHandlerOptions) => {
      options?.statusCode && res.status(options.statusCode);
      data ? res.send(data) : res.end();
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
}
