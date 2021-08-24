import { createDataAdapter, DataAdapter } from './create-data-adapter';

export const createDataAdapterStorage = () => {
  const map = new Map<string, DataAdapter<any>>();

  return {
    getAdapter<T = unknown>(path: string): DataAdapter<T> {
      if (map.has(path)) {
        return map.get(path)! as DataAdapter<T>;
      }

      const adapter = createDataAdapter<T>(path);
      map.set(path, adapter);

      return adapter;
    },
  };
};

export type DataAdapterStorage = ReturnType<typeof createDataAdapterStorage>;
